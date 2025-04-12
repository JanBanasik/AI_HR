from itertools import islice
from github import Github
from datetime import datetime, timedelta
import os
import json
from dotenv import load_dotenv
from collections import defaultdict

# Basic mapping from file extensions to programming languages
EXTENSION_LANG_MAP = {
    '.py': 'Python',
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.go': 'Go',
    '.rb': 'Ruby',
    '.rs': 'Rust',
    '.php': 'PHP',
    '.html': 'HTML',
    '.css': 'CSS',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.sh': 'Shell',
    '.pl': 'Perl',
}


def get_language_from_filename(filename):
    _, ext = os.path.splitext(filename)
    return EXTENSION_LANG_MAP.get(ext, None)  # Return None if not a recognized code file


def extract_added_code_from_patch(patch):
    """
    Extracts added lines (ignoring context and headers) from a given file patch.
    """
    added_lines = []
    for line in patch.splitlines():
        # Only include lines that are additions (skip diff headers starting with '+++')
        if line.startswith('+') and not line.startswith('+++'):
            added_lines.append(line[1:])  # Remove the leading '+' character
    return "\n".join(added_lines) if added_lines else None


def scrape_github_user_info(username: str, top_n: int = 10, months: int = 3) -> dict:
    """
    Scrapes GitHub user information and commit file changes from the last `months` months,
    trimming each commit's code diff to at most 200 lines.

    Parameters:
        username (str): GitHub username.
        top_n (int): Number of recent commits per language to include.
        months (int): Only consider commits from the past `months` months.
    """
    load_dotenv()
    GITHUB_API_KEY = os.getenv("GITHUB_API_KEY")
    g = Github(GITHUB_API_KEY)
    user = g.get_user(username)

    # Calculate the threshold date by approximating one month as 30 days
    threshold_date = datetime.utcnow() - timedelta(days=months * 30)

    # Collect basic user information
    user_info = {
        'login': user.login,
        'bio': user.bio or 'Brak bio',
        'location': user.location or 'Brak lokalizacji',
        'avatar_url': user.avatar_url,
        'public_repos': user.public_repos,
        'followers': user.followers,
        'following': user.following,
        'created_at': user.created_at.strftime('%Y-%m-%d') if user.created_at else None
    }

    # Temporary storage for commit file changes grouped by language
    commits_by_language = defaultdict(list)

    # Iterate over the user's repositories and fetch commits
    for repo in user.get_repos():
        try:
            # Fetch a few recent commits authored by the user in this repository
            commits = list(islice(repo.get_commits(author=username), 5))
        except Exception:
            continue  # Skip repositories that are inaccessible or empty

        for commit in commits:
            try:
                # Convert commit author date for comparison
                commit_date = commit.commit.author.date
                # Check if the commit is within the last `months` months
                if commit_date < threshold_date:
                    continue

                # Process each file within the commit individually
                for f in commit.files:
                    lang = get_language_from_filename(f.filename)
                    if not lang or not f.patch:
                        continue  # Skip if file is not recognized or has no patch

                    code_diff = extract_added_code_from_patch(f.patch)
                    if code_diff is None:
                        continue

                    # Trim the code diff to at most 200 lines
                    lines = code_diff.splitlines()
                    if len(lines) > 200:
                        code_diff = "\n".join(lines[:200])

                    commit_data = {
                        'sha': commit.sha,
                        'message': commit.commit.message.split('\n')[0].strip(),
                        'repo': repo.name,
                        'date': commit_date.isoformat(),
                        'filename': f.filename,
                        'code_diff': code_diff
                    }
                    # Store the commit data under the detected language
                    commits_by_language[lang].append(commit_data)
            except Exception:
                continue  # Skip processing this commit if any error occurs

    # For each language, sort its commits by date (most recent first) and keep only the top_n commits
    top_commits_by_lang = {}
    for lang, commits in commits_by_language.items():
        sorted_commits = sorted(commits, key=lambda x: x['date'], reverse=True)
        top_commits_by_lang[lang] = sorted_commits[:top_n]

    return {
        'user_info': user_info,
        'commits_by_language': top_commits_by_lang
    }


# Example usage:
if __name__ == "__main__":
    username = "JanBanasik"  # Insert the GitHub username
    # Retrieve commits only from the last 3 months
    info = scrape_github_user_info(username, top_n=10, months=3)

    with open("data.json", "w") as f:
        json.dump(info, f, indent=4)

    # For demonstration, print out code diffs for Python files
    if "Python" in info["commits_by_language"]:
        for file_change in info["commits_by_language"]["Python"]:
            print("New commit in file:", file_change["filename"])
            print(file_change["code_diff"])
            print("-" * 40)
