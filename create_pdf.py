from fpdf import FPDF
import json
import re


# Helper function to write text with inline bold formatting (i.e. *text* becomes bold)
def write_markup(pdf, text, line_height=8):
    """
    Process and write the text so that any text enclosed in * is printed in bold.
    It splits the text by newline and then by '*'.
    """
    lines = text.split('\n')
    for line in lines:
        # Split line by "*" to toggle bold formatting for odd parts
        segments = line.split('*')
        for index, segment in enumerate(segments):
            # Odd index segments are within asterisks -> bold.
            if index % 2 == 1:
                pdf.set_font("Helvetica", "B", 12)
            else:
                pdf.set_font("Helvetica", "", 12)
            pdf.write(line_height, segment)
        pdf.ln(line_height)


# Custom PDF class with header, footer, and section methods
class PDFReport(FPDF):
    def header(self):
        # Create an attractive header with a colored background and title.
        self.set_fill_color(70, 130, 180)  # Steel blue
        self.set_text_color(255, 255, 255)  # White text
        self.set_font("Helvetica", "B", 18)
        self.cell(0, 15, "Person Report", new_x="LMARGIN", new_y="NEXT", align="C", fill=True)
        self.ln(5)
        # Reset text color for the rest of the document.
        self.set_text_color(0, 0, 0)

    def footer(self):
        # Add a footer with page numbers.
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()} / {{nb}}", new_x="LMARGIN", new_y="NEXT", align="C")

    def chapter_title(self, title):
        # Section title with a light background.
        self.set_font("Helvetica", "B", 14)
        self.set_fill_color(200, 220, 255)  # Light blue fill
        self.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT", fill=True)
        self.ln(2)

    def chapter_body(self, text):
        # Write body text using our markup parser for inline bold formatting.
        write_markup(self, text)
        self.ln(5)

    def add_section(self, title, content):
        """Adds a section only if content exists (non-empty)."""
        if content:
            self.chapter_title(title)
            self.chapter_body(content)


def generate_pdf_report(eval_info, github_reviews, missing_features, resume_info, justification, leet_code_features, name_path):
    """
    Generates an aesthetically pleasing PDF report combining:
     - Evaluation info (scores, classification, explanations, summary)
     - GitHub reviews (for multiple languages)
     - Resume information (name, contact, skills, projects, education, etc.)
    """
    pdf = PDFReport()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # ============================
    # Section: Evaluation & Scores
    # ============================
    details = []
    name = "name"
    details.append(f"{name.replace('_', ' ').title()}: {resume_info['name']}")
    for key in ['fit_score', 'classification', 'stability_score',
                'aggression_score', 'political_score', 'controversial_score']:
        if key in eval_info:
            details.append(f"{key.replace('_', ' ').title()}: {eval_info[key]}")
    if details:
        pdf.add_section("Evaluation Details", "\n".join(details))

    pdf.add_section("Resume fitting results description", justification["justification"])

    x = 10  # x position
    w = 100  # width
    h = 0  # height (0 means auto-calculate to maintain aspect ratio)
    image_width = 90
    page_width = pdf.w - 2 * pdf.l_margin  # Effective page width
    x_position = (page_width - image_width) / 2 + pdf.l_margin
    pdf.image(f"{name_path}/match_score.png", x=x_position, y=pdf.get_y() + 5, w = image_width)

    pdf.add_page()
    pdf.add_section("Candidate's missing features", missing_features["missing_features"])

    pdf.add_page()
    if "political_explanation" in eval_info:
        pdf.add_section("X post evaluation", eval_info["political_explanation"])

    if "summary" in eval_info:
        pdf.add_section("Summary", eval_info["summary"])



    pdf.add_page()

    pdf.add_section("LeetCode activity evaluation", leet_code_features["review"])

    pdf.add_page()
    # ============================
    # Section: GitHub Reviews
    # ============================
    if github_reviews and isinstance(github_reviews, dict):
        github_reviews = github_reviews["GitHub"]
        for language, review in github_reviews.items():
            title = f"GitHub Review - {language}"
            # Check if review is a dict. If so, convert it to a string.
            if isinstance(review, dict):
                review_str = "\n".join(f"{k}: {v}" for k, v in review.items())
            else:
                review_str = review

            pdf.add_section(title, review_str)


    # Save the PDF to a file
    pdf_output = "aesthetic_person_report.pdf"
    pdf.output(pdf_output)
    return pdf_output
