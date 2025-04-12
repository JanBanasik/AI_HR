from github import Github
from datetime import datetime
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

def extract_added_code(commit):
    """
    Extracts only the added code lines (ignoring deleted fragments, context, and diff headers)
    from all code files in a commit.
    """
    added_lines = []
    for f in commit.files:
        # Ensure the file has a patch available (patches may be None for binary or large files)
        if f.patch:
            for line in f.patch.splitlines():
                # Only include lines that are additions:
                # Skip lines that are diff headers (which begin with "+++")
                if line.startswith('+') and not line.startswith('+++'):
                    added_lines.append(line[1:])  # Remove the leading '+' character
    return "\n".join(added_lines)

def scrape_github_user_info(username: str, top_n: int = 10) -> dict:
    load_dotenv()
    GITHUB_API_KEY = os.getenv("GITHUB_API_KEY")
    g = Github(GITHUB_API_KEY)
    user = g.get_user(username)

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

    # Temporary storage for commits grouped by language
    commits_by_language = defaultdict(list)

    # Iterate over the user's repositories and fetch commits
    for repo in user.get_repos():
        try:
            # Fetch a few recent commits authored by the user in this repository
            commits = repo.get_commits(author=username)[:5]
        except Exception:
            continue  # Skip repositories that are inaccessible or empty

        for commit in commits:
            try:
                # Determine if the commit contains code changes, based on file extensions
                commit_langs = set()
                for f in commit.files:
                    lang = get_language_from_filename(f.filename)
                    if lang:
                        commit_langs.add(lang)
                # If no code files were changed, skip this commit
                if not commit_langs:
                    continue

                # Extract only new changes from the commit (ignoring deletions)
                code_diff = extract_added_code(commit)

                commit_data = {
                    'sha': commit.sha,
                    'message': commit.commit.message.split('\n')[0].strip(),
                    'repo': repo.name,
                    'date': commit.commit.author.date.isoformat(),
                    'code_diff': code_diff
                }

                # Save commit data under every detected language
                for lang in commit_langs:
                    commits_by_language[lang].append(commit_data)

            except Exception:
                continue  # Skip this commit if any error occurs

    # Flatten and sort commits from all languages by date (most recent first)
    all_commits = []
    for lang, commits in commits_by_language.items():
        for commit in commits:
            all_commits.append((lang, commit))
    all_commits.sort(key=lambda x: x[1]['date'], reverse=True)

    # Gather only the top N overall commits and re-group them by language
    top_commits_by_lang = defaultdict(list)
    for lang, commit in all_commits[:top_n]:
        top_commits_by_lang[lang].append(commit)

    return {
        'user_info': user_info,
        'commits_by_language': dict(top_commits_by_lang)
    }

# Przykład użycia:
if __name__ == "__main__":
    username = "JanBanasik"  # Wstaw nazwę użytkownika GitHub
    info = scrape_github_user_info(username)
    #
    # with open("data.json", "w") as f:
    #     json.dump(info, f, indent=4)

    for lol in info["commits_by_language"]["Python"]:
        print(lol["code_diff"])
