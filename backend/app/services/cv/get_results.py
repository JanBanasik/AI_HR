from .cv import extract_text_from_pdf, get_summary_as_json, configure_gemini


def get_results_for_pdf_file(file_bytes):
    configure_gemini()
    text = extract_text_from_pdf(file_bytes)
    summary = get_summary_as_json(text)
    return summary
