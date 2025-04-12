import os
from github import Github

# Ustaw token (opcjonalnie, ale zalecane)
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # lub wpisz na sztywno
g = Github(GITHUB_TOKEN) if GITHUB_TOKEN else Github()


def scrape_github_user_info(username):
    user = g.get_user(username)

    # Pobranie wymaganych danych
    login = user.login
    bio = user.bio
    location = user.location
    avatar_url = user.avatar_url
    public_repos = user.public_repos
    followers = user.followers
    following = user.following
    created_at = user.created_at

    # Formatowanie wyników
    print("### Pobranie danych z GitHub API:")
    print(f"- [ ] **Login:** {login}")
    print(f"- [ ] **Bio:** {bio if bio else 'Brak bio'}")
    print(f"- [ ] **Lokalizacja:** {location if location else 'Brak lokalizacji'}")
    print(f"- [ ] **Avatar URL:** {avatar_url}")
    print(f"- [ ] **Liczba repozytoriów:** {public_repos}")
    print(f"- [ ] **Liczba obserwujących:** {followers}")
    print(f"- [ ] **Liczba obserwowanych:** {following}")
    print(f"- [ ] **Data dołączenia do GitHub:** {created_at.strftime('%Y-%m-%d')}")


# Przykład użycia:
if __name__ == "__main__":
    username = "JanBanasik"  # Wstaw nazwę użytkownika GitHub
    scrape_github_user_info(username)
