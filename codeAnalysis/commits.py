import os
from github import Github
from git import Repo
import subprocess

# Ustaw token (opcjonalnie, ale zalecane)
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # lub wpisz na sztywno
g = Github(GITHUB_TOKEN) if GITHUB_TOKEN else Github()


def scrape_and_clone_repos_with_python(username, top_n=3, clone_dir="cloned_repos"):
    user = g.get_user(username)

    # Pobranie repozytoriów użytkownika
    repos = sorted(user.get_repos(), key=lambda r: r.stargazers_count, reverse=True)

    # Utwórz katalog do klonowania repozytoriów
    os.makedirs(clone_dir, exist_ok=True)
    cloned_paths = []

    count = 0
    for repo in repos:
        if count >= top_n:
            break

        # Sprawdzamy, czy repozytorium zawiera pliki Pythona
        contents = repo.get_contents("")
        has_python_code = False
        for content_file in contents:
            if content_file.name.endswith(".py"):  # Szukamy plików .py
                has_python_code = True
                break

        if has_python_code:
            print(f"🚀 Repozytorium zawiera kod Python: {repo.full_name} ({repo.stargazers_count} ⭐)")
            print(f"Sprawdzam pliki w repozytorium {repo.name}...")

            repo_dir = os.path.join(clone_dir, repo.name)

            # Klonowanie repozytorium
            if not os.path.exists(repo_dir):
                print(f"Klonuję repozytorium: {repo.full_name}")
                Repo.clone_from(repo.clone_url, repo_dir)
            cloned_paths.append(repo_dir)
            count += 1
        else:
            print(f"🚫 Repozytorium {repo.full_name} nie zawiera plików .py")

    return cloned_paths  # Zwraca ścieżki do lokalnych repozytoriów


def analyze_code_quality(repo_dirs):
    for repo_dir in repo_dirs:
        print(f"\n🔍 Analiza repozytorium: {repo_dir}")

        # Uruchomienie pylint na repozytorium
        print("\n📋 Uruchamiam pylint...")
        pylint_result = subprocess.run(
            ["pylint", "--max-line-length=100", repo_dir],
            capture_output=True, text=True
        )

        if pylint_result.stdout:
            print("\n📋 Wynik pylint:")
            print(pylint_result.stdout)
        else:
            print("Brak wyników z pylint!")

        # Uruchomienie radon na repozytorium (kompleksowość)
        print("\n📊 Uruchamiam radon...")
        radon_result = subprocess.run(
            ["radon", "cc", "--total-average", repo_dir],
            capture_output=True, text=True
        )

        if radon_result.stdout:
            print("\n📊 Wynik radon (kompleksowość):")
            print(radon_result.stdout)
        else:
            print("Brak wyników z radon!")


# Przykład użycia:
if __name__ == "__main__":
    username = "JanBanasik"  # Wstaw nazwę użytkownika GitHub
    print(f"Pobieram repozytoria użytkownika {username}...")
    repo_paths = scrape_and_clone_repos_with_python(username)  # Klonowanie repo
    if repo_paths:
        print("Repozytoria zostały sklonowane. Rozpoczynam analizę jakości kodu.")
        analyze_code_quality(repo_paths)  # Analiza jakości kodu
    else:
        print("Brak repozytoriów zawierających kod Python.")
