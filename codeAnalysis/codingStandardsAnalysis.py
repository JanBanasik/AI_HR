import requests
from impl import scrape_github_user_info
from geminiModel import getResultsForGivenPrompt

def createPrompt(commit) -> str:
    return f"""
    **Act as a Senior Software Engineer performing a code review.**  
    Analyze the following code changes from GitHub commit in repository '{commit['repo']}' (Date: {commit['date']}):
    Don't provide any updated versions of the code, just analyze it 
    **Commit Message:**  
    {commit['message']}

    **Code Changes:**
    {commit['code_diff']}"""


commit_data = scrape_github_user_info("JanBanasik")  # Renamed variable

url = "https://api.groq.com/openai/v1/chat/completions"
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json"
}

evalsByLanguage = {}

for lang, commits in commit_data["commits_by_language"].items():
    scores = []
    print(lang)
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