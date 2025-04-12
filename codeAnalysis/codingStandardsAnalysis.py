import requests
from impl import scrape_github_user_info
from create_prompt import createPrompt


commit_data = scrape_github_user_info("antoniopater")  # Renamed variable

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}

evalsByLanguage = {}

for lang, commits in commit_data["commits_by_language"].items():
    scores = []
    print(lang)
    print(commits)
    for commit in commits:
        prompt = createPrompt(commit)
        response = getResultsForGivenPrompt(prompt)

        scores.append(response)

    res = '\n'.join(scores)
    overallPrompt = f"Based on those scores, please evaluate the candidate in the realm of {lang} programming language: {res}"
    overallResponse = getResultsForGivenPrompt(overallPrompt)
    evalsByLanguage[lang] = overallResponse

for language, evals in evalsByLanguage.items():
    print(f"--- {language} ---")
    print(evals)
    print("\n")