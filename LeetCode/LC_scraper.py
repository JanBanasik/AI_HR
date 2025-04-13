import requests
import re
from bs4 import BeautifulSoup
import json
import google.generativeai as genai
from dotenv import load_dotenv
import os
import matplotlib.pyplot as plt


def getResultsForGivenPrompt(prompt) -> str:
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    response = gemini_model.generate_content(prompt)
    return response.text


def generate_profile_review(profile):
    prompt = f"""
    Ocena profilu użytkownika na podstawie danych z LeetCode.

    Użytkownik:
    - Nazwa użytkownika: {profile["username"]}
    - Ranking: {profile["ranking"]}
    - Ocena: {profile["star_rating"]}
    - Rozwiązane zadania:
      - Łatwe: {profile["solved"]["Easy"]}
      - Średnie: {profile["solved"]["Medium"]}
      - Trudne: {profile["solved"]["Hard"]}
      - Łącznie: {profile["solved"]["All"]}
    - Odznaki: {", ".join(profile["badges"])}

    Proszę ocenić profil użytkownika na podstawie powyższych informacji, uwzględniając jego postępy w rozwiązywaniu zadań, ranking oraz odznaki.
    """

    return getResultsForGivenPrompt(prompt)


def clean_html_to_text(html_content):
    """
    Usuwa tagi HTML z treści i formatuje tekst w bardziej przyjazny sposób.
    """
    # Używamy BeautifulSoup do parsowania HTML i usuwania tagów
    soup = BeautifulSoup(html_content, "html.parser")

    # Usuwamy wszelkie tagi <p>, <ul>, <ol>, <code> i zamieniamy je na przejrzysty tekst
    text = soup.get_text(separator="\n")

    # Dodatkowo możemy usunąć jakieś nadmiarowe białe znaki
    text = re.sub(r'\n+', '\n', text).strip()

    return text


class LeetcodeFetcher:
    def __init__(self, session_cookie, csrf_token):
        self.session_cookie = session_cookie
        self.csrf_token = csrf_token

    def get_user_profile(self, username="JanBanasik"):  # Możesz też przekazać dowolnego usera
        url = "https://leetcode.com/graphql"
        query = '''
        query userProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            profile {
              ranking
              starRating
              userAvatar
            }
            badges {
              displayName
            }
          }
        }
        '''
        variables = {"username": username}

        headers = {
            "Content-Type": "application/json",
            "x-csrftoken": self.csrf_token,
            "cookie": f"LEETCODE_SESSION={self.session_cookie}; csrftoken={self.csrf_token}"
        }

        response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)

        # DEBUG
        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)

        data = response.json()["data"]["matchedUser"]

        solved_counts = {
            entry["difficulty"]: entry["count"]
            for entry in data["submitStats"]["acSubmissionNum"]
        }

        return {
            "username": data["username"],
            "ranking": data["profile"].get("ranking"),
            "star_rating": data["profile"].get("starRating"),
            "solved": solved_counts,
            "badges": [badge["displayName"] for badge in data["badges"]],
            "avatar": data["profile"]["userAvatar"]
        }


def save_profile_to_json(profile_data, outputPath="leetcode_profile.json"):
    formatted_data = {
        "username": profile_data["username"],
        "ranking": profile_data["ranking"],
        "star_rating": profile_data["star_rating"],
        "solved_problems": {
            "Easy": profile_data["solved"].get("Easy", 0),
            "Medium": profile_data["solved"].get("Medium", 0),
            "Hard": profile_data["solved"].get("Hard", 0),
            "Total": profile_data["solved"].get("All", 0),
        },
        "badges": profile_data["badges"],
        "avatar_url": profile_data["avatar"]
    }
    outputPath = os.path.join(outputPath, "leetcode_profile.json")
    with open(outputPath, "w", encoding="utf-8") as f:
        json.dump(formatted_data, f, indent=4, ensure_ascii=False)

    print(f"✔️ Dane zapisane do {outputPath}")


def get_user_features(username, outputPath):
    s = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiNjc4NDQ1NyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjNjM2NkOWU2MjkwZDE0N2FjZGZjNDE3MDUzMTc2N2YwYmNhNzg0NDZjODJmODEwMTYwZjdhZDE0NTQ5NDZhMzMiLCJzZXNzaW9uX3V1aWQiOiIzOGI1OWVlMyIsImlkIjo2Nzg0NDU3LCJlbWFpbCI6Imphbi5qZXJ6eS5iYW5hc2lrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiSmFuQmFuYXNpayIsInVzZXJfc2x1ZyI6IkphbkJhbmFzaWsiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvYXZhdGFycy9hdmF0YXJfMTY5MDA2ODMxMS5wbmciLCJyZWZyZXNoZWRfYXQiOjE3NDQ0OTc5ODUsImlwIjoiMTk1LjE1MC4xOTIuMjUwIiwiaWRlbnRpdHkiOiIzM2QwZjI1N2E4MTdkMWNhNGM0MzgxYjg3ZjhhZDgzZiIsImRldmljZV93aXRoX2lwIjpbIjVhYjI0N2RkY2ZlN2ViMWI3NDczZGM2ZDM4MGQ2NzExIiwiMTk1LjE1MC4xOTIuMjUwIl0sIl9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMH0.hp2cagB21J6fLEU3_E6nHYlq2OGlPny9MbPwP8kBDU4"
    fetcher = LeetcodeFetcher(
        s,
        "SfKWxwLiZB6yQt6AlxNXAzMRH1KhXFoOP8KPwom6R0XU5L765D7zCjTYf3rZDfN9")

    profile = fetcher.get_user_profile(f"{username}")
    save_profile_to_json(profile, outputPath)
