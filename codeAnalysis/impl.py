from github import Github
from datetime import datetime
import os

def scrape_github_user_info(username: str) -> dict:
    GITHUB_API_KEY = os.getenv("GITHUB_API_KEY")
    print(GITHUB_API_KEY)
    g = Github(GITHUB_API_KEY)
    user = g.get_user(username)

    # Collect user information
    user_info = {
        'login': user.login,
        'bio': user.bio if user.bio else 'Brak bio',
        'location': user.location if user.location else 'Brak lokalizacji',
        'avatar_url': user.avatar_url,
        'public_repos': user.public_repos,
        'followers': user.followers,
        'following': user.following,
        'created_at': user.created_at.strftime('%Y-%m-%d') if user.created_at else None
    }

    commits_by_language = {}

    # Collect commits from each repository
    for repo in user.get_repos():
        # Determine the repository's primary language
        lang = repo.language or 'Other'
        if lang not in commits_by_language:
            commits_by_language[lang] = []

        try:
            # Fetch the last 2 commits from the repository
            commits = repo.get_commits()[:2]
        except Exception as e:
            # Handle exceptions like empty repositories
            commits = []

        for commit in commits:
            # Extract relevant commit details
            commit_date = commit.commit.author.date if commit.commit.author else datetime.min
            commit_data = {
                'sha': commit.sha,
                'message': commit.commit.message.split('\n')[0].strip() if commit.commit.message else '',
                'repo': repo.name,
                'date': commit_date.isoformat() if commit_date else None
            }
            commits_by_language[lang].append(commit_data)

    # Sort commits by date within each language and keep top 5
    for lang in commits_by_language:
        # Sort commits in descending order of date
        commits_by_language[lang].sort(key=lambda x: x['date'], reverse=True)
        # Keep only the top 5 most recent commits
        commits_by_language[lang] = commits_by_language[lang][:5]

    # Combine user info and commits into the result dictionary
    return {
        'user_info': user_info,
        'commits_by_language': commits_by_language
    }




# Przykład użycia:
if __name__ == "__main__":
    username = "JanBanasik"  # Wstaw nazwę użytkownika GitHub
    print(scrape_github_user_info(username))

