import os
import requests
import subprocess
from github import Github
from git import Repo

g = Github()


def scrape_github_user(username, top_n=3, clone_dir="cloned_repos"):
    clone_dir = f"{username}_repos"
    user = g.get_user(username)
    print(f"📄 Nazwa: {user.name}")
    print(f"👥 Followers: {user.followers}")
    print(f"📦 Repozytoria publiczne: {user.public_repos}")

    # Sortuj repozytoria po liczbie gwiazdek
    repos = sorted(user.get_repos(), key=lambda r: r.stargazers_count, reverse=True)

    os.makedirs(clone_dir, exist_ok=True)
    cloned_paths = []

    for repo in repos[:top_n]:
        print(f"🚀 Klonuję: {repo.full_name} ({repo.stargazers_count} ⭐)")
        repo_dir = os.path.join(clone_dir, repo.name)
        if not os.path.exists(repo_dir):
            Repo.clone_from(repo.clone_url, repo_dir)
        cloned_paths.append(repo_dir)

    return cloned_paths  # Zwraca ścieżki do lokalnych repozytoriów


if __name__ == "__main__":
    username = "FilipBaciak"  # albo kandydat z inputa
    paths = scrape_github_user(username)
    print("📁 Skopiowano repozytoria do:", paths)
