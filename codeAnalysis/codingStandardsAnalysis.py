import requests
from impl import scrape_github_user_info
from create_prompt import createPrompt



commit = scrape_github_user_info("JanBanasik")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}



for key, value in commit["commits_by_language"].items():
    for commit in value:
        prompt = createPrompt(commit)
        data = {
            "model": "llama3-8b-8192",
            "messages": [{"role": "user", "content": f"{prompt}"}],
            "temperature": 0.7
        }

        response = requests.post(url, headers=headers, json=data)
        print(response.json()['choices'][0]['message']['content'])
