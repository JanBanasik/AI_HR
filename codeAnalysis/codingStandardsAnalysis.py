import requests
from impl import scrape_github_user_info
from create_prompt import createPrompt


commit = scrape_github_user_info("JanBanasik")

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}

evalsByLanguage = {}
for key, value in commit["commits_by_language"].items():
    scores = []
    for commit in value:
        prompt = createPrompt(commit)
        data = {
            "model": "llama3-8b-8192",
            "messages": [{"role": "user", "content": f"{prompt}"}],
            "temperature": 0.7
        }

        response = requests.post(url, headers=headers, json=data)
        try:
            scores.append(response.json()["choices"][0]["choice"])
        except KeyError as e:
            continue

    res = '\n'.join(scores)
    overallPrompt = f"Based on those scores, please evaulate the candidate in the realm of {key} programming language: {res}"
    data = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": f"{overallPrompt}"}],
        "temperature": 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        evalsByLanguage[key] = response.json()["choices"][0]["choice"]
    except Exception as e:
        print(f"Error for: {key} language")
        print(e)

for language, evals in evalsByLanguage.items():
    print(language, evals)