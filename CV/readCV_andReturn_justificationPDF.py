import os

from CV.Cv import extract_text_from_pdf, get_summary_as_json, save_to_json
from CV.comparison import CVJobComparator


def getResultsForPDFFile(pdf_path, output_path):
    text = extract_text_from_pdf(pdf_path)
    summary = get_summary_as_json(text)
    output_path = os.path.join(output_path, "CV.json")
    save_to_json(summary, output_path)
    comparator = CVJobComparator(output_path, os.path.join("CV/", "example.json"))
    score, justification = comparator.compare()
    return score, justification
