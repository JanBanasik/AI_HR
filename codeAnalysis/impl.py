from github import Github
import os
import json
from dotenv import load_dotenv
from collections import defaultdict
import time

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
    return EXTENSION_LANG_MAP.get(ext, None)


def extract_added_code_from_patch(patch):
    added_lines = []
    for line in patch.splitlines():
        if line.startswith('+') and not line.startswith('+++'):
            added_lines.append(line[1:])
    return "\n".join(added_lines) if added_lines else None


def scrape_github_user_info(username: str, top_n: int = 3, months: int = 6) -> dict:
    load_dotenv()
    GITHUB_API_KEY = os.getenv("GITHUB_API_KEY")
    g = Github(GITHUB_API_KEY)
    user = g.get_user(username)

    # Calculate threshold timestamp for months
    current_time = time.time()
    threshold_timestamp = current_time - (months * 30 * 24 * 60 * 60)  # convert months to seconds

    user_info = {
        'login': user.login,
        'bio': user.bio or 'Brak bio',
        'location': user.location or 'Brak lokalizacji',
        'avatar_url': user.avatar_url,
        'public_repos': user.public_repos,
        'followers': user.followers,
        'following': user.following,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }

    commits_by_language = defaultdict(list)

    for repo in user.get_repos():
        commits = repo.get_commits(author=username)
        commits = list(commits)
        if len(commits) >= 2:
            commits = commits[:min(99, len(commits) - 1)]
        else:
            commits = []


        if not commits:
            continue
        for commit in commits:
            try:
                commit_timestamp = commit.commit.author.date.timestamp()  # Convert to UNIX timestamp
                if commit_timestamp < threshold_timestamp:
                    continue

                for f in commit.files:
                    lang = get_language_from_filename(f.filename)
                    if not lang or not f.patch:
                        continue

                    code_diff = extract_added_code_from_patch(f.patch)
                    if code_diff is None:
                        continue

                    lines = code_diff.splitlines()
                    if len(lines) > 100:
                        code_diff = "\n".join(lines[:100])
                        lines = lines[:100]

                    commit_data = {
                        'sha': commit.sha,
                        'message': commit.commit.message.split('\n')[0].strip(),
                        'repo': repo.name,
                        'date': commit.commit.author.date.isoformat(),
                        'filename': f.filename,
                        'code_diff': code_diff,
                        'line_count': len(lines)
                    }
                    commits_by_language[lang].append(commit_data)
            except Exception:
                continue

    top_commits_by_lang = {}
    for lang, commits in commits_by_language.items():
        if len(commits) < top_n:
            continue
        sorted_commits = sorted(commits, key=lambda x: x['line_count'], reverse=True)
        top_commits_by_lang[lang] = sorted_commits[:top_n]

    return {
        'user_info': user_info,
        'commits_by_language': top_commits_by_lang
    }


# Example usage
if __name__ == "__main__":
    username = "antoniopater"
    info = scrape_github_user_info(username, top_n=10, months=3)

    with open("data.json", "w") as f:
        json.dump(info, f, indent=4)

    if "Python" in info["commits_by_language"]:
        for file_change in info["commits_by_language"]["Python"]:
            print("New commit in file:", file_change["filename"])
            print(file_change["code_diff"])
            print("-" * 40)
