from .gemini_model import get_results_for_given_prompt
from .impl import scrape_github_user_info
from .prompts import create_prompt, create_overall_prompt


def get_results_for_given_user_name(username: str) -> dict:
    commit_data = scrape_github_user_info(username)  # Renamed variable

    evals_by_language = {}

    for lang, commits in commit_data["commits_by_language"].items():
        scores = []
        for commit in commits:
            prompt = create_prompt(commit)
            response = get_results_for_given_prompt(prompt)

            scores.append(response)

        res = '\n'.join(scores)
        overall_prompt = create_overall_prompt(lang, res)
        overall_response = get_results_for_given_prompt(overall_prompt)
        evals_by_language[lang] = overall_response

    return evals_by_language
