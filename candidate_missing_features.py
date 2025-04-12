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
        f"""
        Na podstawie podanego uzasadnienia, a także na podstawie wczytanych wymagań pracy, napisz czego brakuje kandydatowi
        Jakich umiejętności zarówno twardych jak i miękkich 
        
        f"Justification:\n{justification}\n\n"
        f"Oferta pracy:\n{json.dumps(job_desc, ensure_ascii=False)}"
        """
    )

    response = getResultsForGivenPrompt(prompt)
    raw_output = response.strip().removeprefix("```json").removesuffix("```").strip()
    return raw_output

