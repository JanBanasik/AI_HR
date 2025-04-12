def createPrompt(commit) -> str:
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

