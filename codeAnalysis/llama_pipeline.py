import requests

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}



data = {
    "model": "llama3-8b-8192",
    "messages": [{"role": "user", "content": "How does photosynthesis work?"}],
    "temperature": 0.7
}

response = requests.post(url, headers=headers, json=data)
print(response.json()['choices'][0]['message']['content'])
