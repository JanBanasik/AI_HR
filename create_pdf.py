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
            print(review_str)
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


# ----------------------------------------------------------------------
# Example JSON Data (simulate reading from JSON files)
# ----------------------------------------------------------------------

# Evaluation info (first JSON object)
eval_info = {
    "person_id": "person001",
    "fit_score": -1.0,
    "classification": "Negative",
    "stability_score": 0.2,
    "aggression_score": 0.9,
    "political_score": 1.0,
    "controversial_score": 0.9,
    "political_explanation": (
        "The user's repeated, aggressive, and demeaning language, combined with strong ideological pronouncements and personal attacks, "
        "will severely damage team cohesion and trust, creating a hostile work environment."),
    "summary": (
        "This individual exhibits a consistently dismissive and arrogant communication style, characterized by self-aggrandizement and a lack of respect for "
        "differing perspectives. Their behavior suggests a strong preference for independent work, coupled with an unwillingness to collaborate or compromise. "
        "In a team setting, this individual would likely be a disruptive force, fostering conflict and undermining team cohesion through condescending remarks and a refusal "
        "to engage constructively. Their actions indicate a potential for escalating conflict and challenging authority. They may struggle to accept feedback and demonstrate poor emotional regulation.")
}

# GitHub reviews (second JSON object)
github_reviews = {
    "C++": (
        "Strong Sides:  None evident from the provided information.\n\nWeak Sides: Excessive use of preprocessor directives, poor error handling, hardcoded paths, "
        "insufficient commit messages, lack of modularity, and incomplete code snippets.\n\nOverall Opinion: The candidate demonstrates a weak understanding of C++ best practices, "
        "particularly regarding code clarity, maintainability, and error handling. The reliance on preprocessor directives and lack of context in the code snippets suggest a need "
        "for significant improvement in fundamental C++ programming skills. The candidate's apparent disregard for proper commit messaging further indicates a lack of professional software development practices.\n"),
    "TypeScript": (
        "Based on the provided Playwright and GraphQL test code, the candidate demonstrates a weak understanding of TypeScript in a testing context.\n\nStrong Sides: "
        "The candidate shows basic familiarity with Playwright and GraphQL API testing frameworks. They are able to write tests that execute.\n\nWeak Sides: The tests suffer from extensive use "
        "of hardcoded values, minimal error handling, poor test coverage, inadequate commit messaging, and weak assertions, indicative of a superficial approach to testing.\n\nOverall Opinion: "
        "The candidate's TypeScript skills in this specific context are underdeveloped. The code lacks the robustness, thoroughness, and attention to detail expected in a production environment, "
        "revealing critical gaps in their understanding of best practices for writing reliable and maintainable tests. Significant improvement is needed.\n"),
    "JavaScript": (
        "Strong Sides:\n\nThe code achieves its basic functionality of table sorting and URL-based state persistence.\n\nWeak Sides:**\n\nHeavy reliance on global variables severely impacts maintainability and testability.\n"
        "* Inefficient sorting algorithm (likely O(n^2)) leads to performance issues with large datasets.\n* Poor error handling leaves the code vulnerable to crashes.\n* Lack of descriptive variable names, "
        "comments, and inconsistent styling hinders readability and understanding.\n\nOverall Opinion:\n\nThe candidate demonstrates a weak grasp of JavaScript best practices and efficient coding techniques. "
        "The code is functional but suffers from significant design flaws, making it brittle, inefficient, and difficult to maintain. The candidate needs substantial improvement in areas like code structure, "
        "error handling, and algorithm efficiency.\n"),
    "Python": (
        "Weak Sides:**\n\nThe candidate demonstrates a weak understanding of code clarity and efficiency, writing repetitive and convoluted code with insufficient comments.\nThe candidate shows poor commit message practices, "
        "providing unhelpful or misleading descriptions of changes.\n* The candidate lacks consistent adherence to best practices, including proper error handling and input validation.\n\nStrong Sides:\n\n* The candidate displays a basic functional "
        "understanding of Python syntax and some libraries.\n* The candidate uses descriptive function names.\n\nOverall Opinion:\n\nThe candidate's Python skills are currently rudimentary and require substantial improvement in several key areas. "
        "The demonstrated proficiency is insufficient for professional-level development, requiring significant mentorship and further learning to reach acceptable standards.\n"),
    "HTML": (
        "Strong Sides:\n\nThe candidate successfully altered the language of the generated HTML documentation.\n\nWeak Sides:\n\nThe candidate demonstrated reliance on manual translation instead of potentially more efficient automated methods. "
        "The commit message lacked sufficient detail and clarity.\n\nOverall Opinion:\n\nThe candidate displays basic competence in utilizing HTML within the context of Javadoc generation; however, they lack efficiency and attention to detail "
        "regarding documentation best practices and commit messaging. Further evaluation is needed to assess overall HTML proficiency.\n"),
    "CSS": (
        "Strong Sides:\n\nNone explicitly mentioned; the provided reviews highlight only weaknesses.\n\nWeak Sides:**\n\nPoor code structure with excessive repetition and lack of reusable classes.\nInsufficient commenting, or excessive commenting where not needed.\n"
        "* Misleading commit messages failing to reflect actual changes.\n* Lack of adherence to modern CSS best practices, indicating insufficient knowledge of CSS methodology and best practices.\n\nOverall Opinion:\n\nThe candidate demonstrates a weak understanding "
        "of efficient and maintainable CSS coding practices. The consistent issues across multiple reviews suggest a fundamental lack of skill and awareness of best practices in CSS development. Improvement in code structure, commenting strategy, and commit message clarity is necessary.\n"),
    "Java": (
        "Strong Sides:\n\nThe candidate demonstrates some familiarity with Java concurrency constructs, using AtomicInteger and ConcurrentLinkedQueue.\n\nWeak Sides:\n\nThe code contains fundamental flaws in concurrency handling, including incorrect logic in synchronization "
        "and resource management, resulting in potential deadlocks and incorrect behavior. Test cases are poorly designed, relying on unreliable timeouts and failing to properly test for expected behavior. Error handling is virtually nonexistent, and overall code quality is low "
        "due to inconsistent formatting, logic errors, and missing functionality.\n\nOverall Opinion:\n\nThe candidate exhibits a weak understanding of Java concurrency and software engineering principles, requiring significant improvement before being considered proficient in Java programming. "
        "The code is riddled with serious errors, indicating a need for substantial retraining and practice in these areas.\n")
}

# Resume / Personal Details (third JSON object)
resume_info = {
    "name": "Antoni Pater",
    "contact": {
        "email": "antonipaterbusiness@gmail.com",
        "phone": "+48 510 637 158"
    },
    "tech_skills": [
        "Python", "C++", "XGBoost", "Scikit-learn", "PyTorch", "Pandas", "Matplotlib",
        "NumPy", "PostgreSQL", "Git", "GitHub", "Colab", "Linux", "Torchvision", "DenseNet121"
    ],
    "soft_skills": [
        "Highly motivated", "Ambitious", "Passionate about applying AI to solve real-world problems"
    ],
    "experience": [],
    "projects": [
        {
            "title": "BloodGuard: AI Health Diagnosis via Blood Test Analysis",
            "description": "Built an XGBoost model to classify blood test results, enabling predictions and accuracy evaluation with preprocessing.",
            "technologies": ["Python", "XGBoost", "Pandas", "Scikit-learn"],
            "role": "Developer",
            "results": "Enabled predictions and accuracy evaluation"
        },
        {
            "title": "ChestXrayClassifier: AI-Powered Pneumonia Detection from Chest X-Ray Images",
            "description": "Developed an AI diagnostic tool in PyTorch using DenseNet121 to classify chest X-rays as NORMAL or PNEUMONIA.",
            "technologies": ["PyTorch", "Torchvision", "Scikit-learn", "DenseNet121"],
            "role": "Developer",
            "results": "Developed an AI diagnostic tool for classifying chest X-rays."
        },
        {
            "title": "Desktop learning application",
            "description": "Developed a desktop learning application using Python to enhance educational experiences through interactive features.",
            "technologies": ["Python"],
            "role": "Developer",
            "results": "Developed an interactive desktop learning application."
        }
    ],
    "education": [
        {
            "university": "AGH University of Science and Technology",
            "degree": "Bachelor of Computer Science and Intelligent Systems",
            "period": "2023 - 2027"
        }
    ],
    "certifications": [],
    "languages": [
        {"language": "English", "level": "B2"},
        {"language": "Polish", "level": "Native"}
    ]
}

# ----------------------------------------------------------------------
# Generate the PDF report
# ----------------------------------------------------------------------
pdf_path = generate_pdf_report(eval_info, github_reviews, resume_info)
print(f"PDF report generated at: {pdf_path}")
