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

    return getResultsForGivenPrompt(f"User profile assessment based on LeetCode data.\n\n"
f"User:\n"
f"- Username: {profile['username']}\n"
f"- Ranking: {profile['ranking']}\n"
f"- Rating: {profile['star_rating']}\n"
f"- Solved problems:\n"
f"  - Easy: {profile['solved']['Easy']}\n"
f"  - Medium: {profile['solved']['Medium']}\n"
f"  - Hard: {profile['solved']['Hard']}\n"
f"  - Total: {profile['solved']['All']}\n"
f"- Badges: {', '.join(profile['badges'])}\n\n"
f"Please evaluate the user's profile based on the above information, considering their progress in problem-solving, ranking, and badges."
)


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


def save_profile_to_json(profile_data, outputPath):
    outputPath = os.path.join(outputPath, "leetcode_profile.json")
    with open(outputPath, "w", encoding="utf-8") as f:
        json.dump(profile_data, f, indent=4, ensure_ascii=False)

    print(f"✔️ Dane zapisane do {outputPath}")


def get_user_features(username, outputPath):
    s = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiNjc4NDQ1NyIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImFsbGF1dGguYWNjb3VudC5hdXRoX2JhY2tlbmRzLkF1dGhlbnRpY2F0aW9uQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjNjM2NkOWU2MjkwZDE0N2FjZGZjNDE3MDUzMTc2N2YwYmNhNzg0NDZjODJmODEwMTYwZjdhZDE0NTQ5NDZhMzMiLCJzZXNzaW9uX3V1aWQiOiIzOGI1OWVlMyIsImlkIjo2Nzg0NDU3LCJlbWFpbCI6Imphbi5qZXJ6eS5iYW5hc2lrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiSmFuQmFuYXNpayIsInVzZXJfc2x1ZyI6IkphbkJhbmFzaWsiLCJhdmF0YXIiOiJodHRwczovL2Fzc2V0cy5sZWV0Y29kZS5jb20vdXNlcnMvYXZhdGFycy9hdmF0YXJfMTY5MDA2ODMxMS5wbmciLCJyZWZyZXNoZWRfYXQiOjE3NDQ0OTc5ODUsImlwIjoiMTk1LjE1MC4xOTIuMjUwIiwiaWRlbnRpdHkiOiIzM2QwZjI1N2E4MTdkMWNhNGM0MzgxYjg3ZjhhZDgzZiIsImRldmljZV93aXRoX2lwIjpbIjVhYjI0N2RkY2ZlN2ViMWI3NDczZGM2ZDM4MGQ2NzExIiwiMTk1LjE1MC4xOTIuMjUwIl0sIl9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMH0.hp2cagB21J6fLEU3_E6nHYlq2OGlPny9MbPwP8kBDU4"
    fetcher = LeetcodeFetcher(
        s,
        "SfKWxwLiZB6yQt6AlxNXAzMRH1KhXFoOP8KPwom6R0XU5L765D7zCjTYf3rZDfN9")

    profile = fetcher.get_user_profile(f"{username}")
    save_profile_to_json({"review": generate_profile_review(profile)}, outputPath)

