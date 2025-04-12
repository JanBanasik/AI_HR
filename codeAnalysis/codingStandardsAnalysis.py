import time
import json
import os

import requests

from codeAnalysis.geminiModel import getResultsForGivenPrompt
from impl import scrape_github_user_info
from create_prompt import createPrompt, createOverallPrompt


commit_data = scrape_github_user_info("JanBanasik")  # Renamed variable

evalsByLanguage = {}

for lang, commits in commit_data["commits_by_language"].items():
    scores = []
    print(lang)
    for commit in commits:
        prompt = createPrompt(commit)
        response = getResultsForGivenPrompt(prompt)

        scores.append(response)

    res = '\n'.join(scores)
    overallPrompt = createOverallPrompt(lang, res)
    overallResponse = getResultsForGivenPrompt(overallPrompt)
    evalsByLanguage[lang] = overallResponse
    time.sleep(5)

# Check if the JSON file already exists
file_path = 'github_opinions.json'
if os.path.exists(file_path):
    # Load the existing data from the file
    with open(file_path, 'r') as f:
        data = json.load(f)
else:
    # Initialize an empty structure if file does not exist
    data = {}

# Add the new evaluations under the "GitHub" key
data['GitHub'] = evalsByLanguage

# Save the updated data back to the JSON file
with open(file_path, 'w') as f:
    json.dump(data, f, indent=4)

# Optionally print out the evaluations
for language, evals in evalsByLanguage.items():
    print(f"--- {language} ---")
    print(evals)
    print("\n")
