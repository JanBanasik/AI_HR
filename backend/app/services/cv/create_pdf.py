from fpdf import FPDF


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


def generate_pdf_report(eval_info, github_reviews, resume_info):
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
    for key in ['person_id', 'fit_score', 'classification', 'stability_score',
                'aggression_score', 'political_score', 'controversial_score']:
        if key in eval_info:
            details.append(f"{key.replace('_', ' ').title()}: {eval_info[key]}")
    if details:
        pdf.add_section("Evaluation Details", "\n".join(details))

    if "political_explanation" in eval_info:
        pdf.add_section("Political Explanation", eval_info["political_explanation"])

    if "summary" in eval_info:
        pdf.add_section("Summary", eval_info["summary"])

    # ============================
    # Section: GitHub Reviews
    # ============================
    if github_reviews and isinstance(github_reviews, dict):
        for language, review in github_reviews.items():
            title = f"GitHub Review - {language}"
            # Check if review is a dict. If so, convert it to a string.
            if isinstance(review, dict):
                review_str = "\n".join(f"{k}: {v}" for k, v in review.items())
            else:
                review_str = review

            pdf.add_section(title, review_str)

    # ============================
    # Section: Resume / Personal Info
    # ============================
    # Header with name
    if "name" in resume_info:
        pdf.chapter_title(f"Resume: {resume_info['name']}")

    # Contact Info
    if "contact" in resume_info:
        contact = resume_info["contact"]
        contact_details = []
        for k, v in contact.items():
            contact_details.append(f"{k.title()}: {v}")
        pdf.add_section("Contact Information", "\n".join(contact_details))

    # Technical Skills
    if "tech_skills" in resume_info and resume_info["tech_skills"]:
        tech_skills = ", ".join(resume_info["tech_skills"])
        pdf.add_section("Technical Skills", tech_skills)

    # Soft Skills
    if "soft_skills" in resume_info and resume_info["soft_skills"]:
        soft_skills = ", ".join(resume_info["soft_skills"])
        pdf.add_section("Soft Skills", soft_skills)

    # Experience (if any)
    if "experience" in resume_info and resume_info["experience"]:
        experience = "\n".join(resume_info["experience"])
        pdf.add_section("Experience", experience)

    # Projects
    if "projects" in resume_info and resume_info["projects"]:
        project_texts = []
        for proj in resume_info["projects"]:
            proj_lines = []
            for field in ["title", "description", "technologies", "role", "results"]:
                if field in proj:
                    value = proj[field]
                    if isinstance(value, list):
                        value = ", ".join(value)
                    proj_lines.append(f"{field.title()}: {value}")
            project_texts.append("\n".join(proj_lines))
            project_texts.append("-" * 40)
        pdf.add_section("Projects", "\n".join(project_texts))

    # Education
    if "education" in resume_info and resume_info["education"]:
        education_texts = []
        for edu in resume_info["education"]:
            edu_lines = []
            for field in ["university", "degree", "period"]:
                if field in edu:
                    edu_lines.append(f"{field.title()}: {edu[field]}")
            education_texts.append("\n".join(edu_lines))
            education_texts.append("-" * 40)
        pdf.add_section("Education", "\n".join(education_texts))

    # Certifications
    if "certifications" in resume_info and resume_info["certifications"]:
        certifications = "\n".join(resume_info["certifications"])
        pdf.add_section("Certifications", ", ".join(certifications))

    # Languages
    if "languages" in resume_info and resume_info["languages"]:
        language_texts = []
        for lang in resume_info["languages"]:
            # e.g., "English (B2)"
            language_texts.append(f"{lang.get('language', '')} ({lang.get('level', '')})")
        pdf.add_section("Languages", ", ".join(language_texts))

    # Save the PDF to a file
    pdf_output = "aesthetic_person_report.pdf"
    pdf.output(pdf_output)
    return pdf_output
