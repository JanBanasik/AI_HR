from fpdf import FPDF
import json
import re


class PDFReport(FPDF):
    def header(self):
        # Create a header with a background color and title
        self.set_fill_color(70, 130, 180)  # Steel blue
        self.set_text_color(255, 255, 255)  # White text
        self.set_font("Arial", "B", 18)
        self.cell(0, 15, "Person Report", ln=True, align="C", fill=True)
        self.ln(5)
        # Reset text color for content
        self.set_text_color(0, 0, 0)

    def footer(self):
        # Page numbers in the footer
        self.set_y(-15)
        self.set_font("Arial", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()} / {{nb}}", 0, 0, "C")

    def chapter_title(self, title):
        # Stylized chapter header
        self.set_font("Arial", "B", 14)
        self.set_fill_color(200, 220, 255)  # Light blue background for sections
        self.cell(0, 10, title, ln=True, fill=True)
        self.ln(2)

    def chapter_body(self, text):
        # Write text with markup parsing, handling inline bold between asterisks.
        write_markup(self, text)
        self.ln(5)

    def add_section(self, title, content):
        """Adds a section only if the provided content exists."""
        if content:
            self.chapter_title(title)
            self.chapter_body(content)


def write_markup(pdf, text, line_height=8):
    """
    Process the text so that any occurrence of *...* is printed in bold.
    This function splits the input text at newline characters and then
    further splits each line using '*' as the delimiter.
    """
    lines = text.split('\n')
    for line in lines:
        # Split the line into segments using '*' as a delimiter.
        segments = line.split('*')
        for index, segment in enumerate(segments):
            # Odd-index segments are inside asterisks => bold.
            if index % 2 == 1:
                pdf.set_font("Arial", "B", 12)
            else:
                pdf.set_font("Arial", "", 12)
            pdf.write(line_height, segment)
        pdf.ln(line_height)


def generate_pdf_report(person_info):
    pdf = PDFReport()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    # Add a generic personal details section (if available)
    details = []
    if 'person_id' in person_info:
        details.append(f"Person ID: {person_info['person_id']}")
    if 'fit_score' in person_info:
        details.append(f"Fit Score: {person_info['fit_score']}")
    if 'classification' in person_info:
        details.append(f"Classification: {person_info['classification']}")
    if 'stability_score' in person_info:
        details.append(f"Stability Score: {person_info['stability_score']}")
    if 'aggression_score' in person_info:
        details.append(f"Aggression Score: {person_info['aggression_score']}")
    if 'political_score' in person_info:
        details.append(f"Political Score: {person_info['political_score']}")
    if 'controversial_score' in person_info:
        details.append(f"Controversial Score: {person_info['controversial_score']}")
    if details:
        personal_details = "\n".join(details)
        pdf.add_section("Personal Details", personal_details)

    # Add Twitter Section (if available)
    if "Twitter" in person_info:
        # Assuming the Twitter section is a dictionary containing tweets or other info.
        twitter_content = ""
        twitter_data = person_info["Twitter"]
        for key, value in twitter_data.items():
            twitter_content += f"{key}: {value}\n"
        pdf.add_section("Twitter", twitter_content)

    # Add GitHub Section (if available)
    if "GitHub" in person_info:
        # If multiple languages are present, create a section per language
        github_data = person_info["GitHub"]
        for language, review in github_data.items():
            pdf.add_section(f"GitHub Review - {language}", review)

    # Add additional sections if present
    if "political_explanation" in person_info:
        pdf.add_section("Political Explanation", person_info["political_explanation"])

    if "summary" in person_info:
        pdf.add_section("Summary", person_info["summary"])

    # Save the PDF output
    pdf_output = "aesthetic_person_report.pdf"
    pdf.output(pdf_output)
    return pdf_output
