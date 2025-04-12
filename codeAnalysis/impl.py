from github import Github
from datetime import datetime
import os
from dotenv import load_dotenv
from collections import defaultdict
import mimetypes

# Basic mapping from file extensions to languages
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
    return EXTENSION_LANG_MAP.get(ext, None)  # Return None if not a code file

def scrape_github_user_info(username: str, top_n: int = 10) -> dict:
    load_dotenv()
    GITHUB_API_KEY = os.getenv("GITHUB_API_KEY")
    g = Github(GITHUB_API_KEY)
    user = g.get_user(username)

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

    commits_by_language = defaultdict(list)

    for repo in user.get_repos():
        try:
            commits = repo.get_commits(author=username)[:5]
        except Exception:
            continue  # skip inaccessible or empty repos

        for commit in commits:
            try:
                files = commit.files
                commit_langs = set()

                for f in files:
                    lang = get_language_from_filename(f.filename)
                    if lang:
                        commit_langs.add(lang)

                if not commit_langs:
                    continue  # skip non-code commits

                commit_data = {
                    'sha': commit.sha,
                    'message': commit.commit.message.split('\n')[0].strip(),
                    'repo': repo.name,
                    'date': commit.commit.author.date.isoformat()
                }

                for lang in commit_langs:
                    commits_by_language[lang].append(commit_data)

            except Exception:
                continue  # skip if any errors

    # Flatten all commits, group by language, sort by date, and limit top N
    all_commits = []
    for lang, commits in commits_by_language.items():
        for commit in commits:
            all_commits.append((lang, commit))

    # Sort all commits by date
    all_commits.sort(key=lambda x: x[1]['date'], reverse=True)

    # Take top N commits
    top_commits_by_lang = defaultdict(list)
    for lang, commit in all_commits[:top_n]:
        top_commits_by_lang[lang].append(commit)

    return {
        'user_info': user_info,
        'commits_by_language': dict(top_commits_by_lang)
    }

# Example use
if __name__ == "__main__":
    username = "JanBanasik"
    result = scrape_github_user_info(username, top_n=10)
    print(result)
