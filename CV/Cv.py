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
        "Jesteś ekspertem HR w branży technologicznej. Twoim zadaniem jest bardzo dokładna analiza poniższego CV i wyodrębnienie najważniejszych informacji "
        "w sposób, który pozwoli ocenić kandydata pod kątem technicznych umiejętności, potencjału, samodzielności oraz przydatności do pracy w branży IT.\n\n"
        "🔍 Przeanalizuj każdą sekcję CV i wybierz tylko te informacje, które:\n"
        "- pokazują rzeczywiste umiejętności techniczne (np. języki programowania, frameworki, technologie, narzędzia),\n"
        "- potwierdzają doświadczenie projektowe (np. co dokładnie zrobił kandydat, jaki był jego wkład, jakie technologie zastosował),\n"
        "- wskazują na samodzielność, kreatywność lub osiągnięcia (np. projekty open-source, własne inicjatywy, konkursy, certyfikaty),\n"
        "- mają konkretne rezultaty (np. liczby, użytkownicy, efekty, mierzalne wyniki).\n\n"
        "🎯 Nie przepisuj wszystkiego – wybieraj tylko najbardziej wartościowe informacje z punktu widzenia rekrutera technicznego.\n\n"
        "Zwróć dane w uporządkowanym formacie JSON z następującymi polami:\n"
        "- name: imię i nazwisko\n"
        "- contact: email i numer telefonu\n"
        "- tech_skills: lista technologii i narzędzi, z którymi kandydat faktycznie pracował\n"
        "- soft_skills: lista miękkich umiejętności (jeśli są podane)\n"
        "- experience: lista doświadczeń zawodowych lub wolontariackich (rola, firma, zakres obowiązków, technologie, rezultaty)\n"
        "- projects: projekty własne lub zespołowe z opisem celu, technologii, roli kandydata, efektów\n"
        "- education: edukacja (uczelnia, kierunek, okres)\n"
        "- certifications: certyfikaty (nazwa, organizator, data)\n"
        "- languages: języki i poziomy\n\n"
        "Jeśli jakaś sekcja nie występuje – po prostu zwróć pustą listę. CV do analizy:\n\n"
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
