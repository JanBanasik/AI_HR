import os
import fitz  # PyMuPDF
import google.generativeai as genai
import json
from dotenv import load_dotenv


# === Konfiguracja API z pliku .env ===
def configure_gemini():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Missing GEMINI_API_KEY in .env")
    genai.configure(api_key=api_key)


# === Wczytaj tekst z PDF ===
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text.strip()


# === Wygeneruj JSON z Gemini ===
def get_summary_as_json(cv_text):
    configure_gemini()
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        "You are an HR expert in the technology industry. Your task is to conduct a very thorough analysis of the following CV and extract the most important information "
        "in a way that allows for assessing the candidate's technical skills, potential, independence, and suitability for working in the IT industry.\n\n"
        "🔍 Analyze each section of the CV and select only the information that:\n"
        "- demonstrates actual technical skills (e.g., programming languages, frameworks, technologies, tools),\n"
        "- confirms project experience (e.g., what exactly the candidate did, their contribution, technologies used),\n"
        "- indicates independence, creativity, or achievements (e.g., open-source projects, personal initiatives, competitions, certifications),\n"
        "- has concrete results (e.g., numbers, users, effects, measurable outcomes).\n\n"
        "🎯 Do not transcribe everything – select only the most valuable information from the perspective of a technical recruiter.\n\n"
        "Return the data in an organized JSON format with the following fields:\n"
        "- name: full name\n"
        "- contact: email and phone number\n"
        "- tech_skills: list of technologies and tools the candidate has actually worked with\n"
        "- soft_skills: list of soft skills (if provided)\n"
        "- experience: list of professional or volunteer experiences (role, company, scope of responsibilities, technologies, results)\n"
        "- projects: personal or team projects with a description of the goal, technologies, candidate's role, outcomes\n"
        "- education: education (university, field of study, period)\n"
        "- certifications: certifications (name, organizer, date)\n"
        "- languages: languages and proficiency levels\n\n"
        "If a section is missing – simply return an empty list. CV for analysis:\n\n"
        f"{cv_text}"
    )

    response = model.generate_content(prompt)

    # czasem odpowiedź zawiera "```json" – usuwamy to, jeśli występuje
    cleaned_text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
    return cleaned_text


# === Zapisz JSON do pliku ===
def save_to_json(text, output_path="cv_summary.json"):
    try:
        data = json.loads(text)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        # print(f"✅ JSON zapisany do {output_path}")
    except json.JSONDecodeError as e:
        # print("⚠️ Odpowiedź nie jest poprawnym JSON-em:")
        print(e)
        # print("\nOryginalna treść odpowiedzi:\n")
        # print(text)


# === Główna funkcja ===
def main():
    configure_gemini()
    pdf_path = "Antoni-3.pdf"  # podaj własną ścieżkę
    text = extract_text_from_pdf(pdf_path)
    summary = get_summary_as_json(text)
    save_to_json(summary)


if __name__ == "__main__":
    main()
