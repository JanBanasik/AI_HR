import google.generativeai as genai
from dotenv import load_dotenv
import os
import json




def getResultsForGivenPrompt(prompt) -> str:
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    response = gemini_model.generate_content(prompt)
    return response.text


def load_job_desc(jobDescriptionPath):
    with open(jobDescriptionPath, "r", encoding="utf-8") as f:
        return json.load(f)


def get_missing_features(justification, jobDescriptionPath) -> str:
    job_desc = load_job_desc(jobDescriptionPath)

    prompt = (
        f"""Based on the provided justification and the loaded job requirements, identify the candidate's missing skills, both hard and soft.
        
        f"Justification:\n{justification}\n\n"
        f"Job offer:\n{json.dumps(job_desc, ensure_ascii=False)}"
        """
    )

    response = getResultsForGivenPrompt(prompt)
    raw_output = response.strip().removeprefix("```json").removesuffix("```").strip()
    return raw_output

