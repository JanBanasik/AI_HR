def create_prompt(commit) -> str:
    return f"""
    **Act as a Senior Software Engineer performing a code review.**  
    Analyze the following code changes from GitHub commit in repository '{commit['repo']}' (Date: {commit['date']}):

    Give a brief evaluation of a code clearness and proficiency in the language.
    If the coded is not good enough, point it out (generally, without stating any improvement).
    Take into account, that the provided code is only a commit and serves as a part of a greater repository.
    **Commit Message:**  
    {commit['message']}

    **Code Changes:**
    {commit['code_diff']}."""


def create_overall_prompt(lang, res):
    overall_prompt = f"""
    Based on those scores, please evaluate the candidate in the realm of \n
{lang} \n
programming language. DO NOT SAY, that the provided code is insufficient to make the review or mention it anyhow -- make the opinion anyway.
Quickly list weak and strong sides and at the end make an overall opinion. Your description SHOULD NOT be excessive -- one short sentence per each pros or cons and 2, 3 sentence of summary.
Here's the code: 
{res}"""

    return overall_prompt
