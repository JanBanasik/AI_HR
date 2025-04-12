import os
import re
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import google.generativeai as genai

class GeminiAnalyzer:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.person_id = self._extract_person_id()
        self.output_dir = os.path.join("plots", self.person_id)
        os.makedirs(self.output_dir, exist_ok=True)
        self.model = None
        self.posts = []
        self._load_env_and_configure()
        self._load_posts()

    def _extract_person_id(self):
        parts = self.csv_path.split(os.sep)
        if len(parts) >= 2:
            return parts[-2]  # e.g., person001
        return "unknown"

    def _load_env_and_configure(self):
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Missing GEMINI_API_KEY in .env")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def _load_posts(self):
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"File not found: {self.csv_path}")
        df = pd.read_csv(self.csv_path)
        if 'post' not in df.columns:
            raise ValueError("CSV file must contain 'post' column")
        self.posts = df['post'].dropna().tolist()

    def _generate_prompt(self, instruction, format_string):
        prompt = instruction + "\nPosts:\n"
        for i, post in enumerate(self.posts, 1):
            prompt += f"{i}. {post}\n"
        prompt += f"\n{format_string}"
        return prompt

    def _get_score_from_prompt(self, prompt, pattern):
        response = self.model.generate_content(prompt)
        text = response.text.strip()
        print("\n📥 Gemini Raw Response:\n", text)

        match = re.search(pattern, text)
        if match:
            return float(match.group(1)), text

        numbers = re.findall(r"\d+(?:\.\d+)?", text)
        if numbers:
            score_index = text.lower().find("score")
            if score_index != -1:
                closest = min(
                    numbers,
                    key=lambda num: abs(text.lower().find(num) - score_index)
                )
                return float(closest), text
            else:
                return float(numbers[0]), text

        raise ValueError("Could not parse response.")

    def analyze_team_fit(self):
        instruction = (
            "You are an expert in workplace psychology. Based on the following social media posts, evaluate whether the author is suitable for teamwork."
            " Provide a detailed analysis and return only two elements:\n"
            "1. Team Fit Score on a scale from -1 (very poor team fit) to +1 (excellent team fit).\n"
            "2. One-word classification: Positive (good team fit) or Negative (poor team fit)."
        )
        prompt = self._generate_prompt(instruction, "Answer:")
        response = self.model.generate_content(prompt).text.strip()
        score_match = re.search(r"Score:\s*(-?\d+\.?\d*)", response)
        class_match = re.search(r"Classification:\s*(Positive|Negative)", response, re.IGNORECASE)
        score = float(score_match.group(1)) if score_match else 0.0
        classification = class_match.group(1).capitalize() if class_match else "Uncertain"
        return score, classification, response

    def analyze_stability(self):
        instruction = (
            "Analyze the following user's posts and assess how consistent and stable their opinions and tone are."
            " Return a single number from 0 (very inconsistent/chaotic) to 1 (very stable and consistent)."
        )
        prompt = self._generate_prompt(instruction, "Answer:")
        return self._get_score_from_prompt(prompt, r"(?:Stability|score(?: of)?)[:=]?\s*(\d+(?:\.\d+)?)")

    def analyze_aggression(self):
        instruction = (
            "Evaluate the overall level of aggressiveness, hostility or confrontational tone in the user's posts."
            " Return a number from 0 (calm and respectful) to 1 (very aggressive)."
        )
        prompt = self._generate_prompt(instruction, "Answer:")
        return self._get_score_from_prompt(prompt, r"(?:Aggression|score(?: of)?)[:=]?\s*(\d+(?:\.\d+)?)")

    def analyze_political_agitation(self):
        instruction = (
            "As a workplace psychologist AI, evaluate whether the following posts by a user reveal political agitation or strong ideological positioning "
            "that could negatively influence collaboration in a diverse team. Consider the tone, content, and repeatability of political or ideological expressions. "
            "Return two things:\n"
            "1. Political Agitation Score from 0 (no signs of political bias or agitation) to 1 (strong political agitation or bias).\n"
            "2. A one-sentence explanation of how this may affect teamwork.\n"
            "Format: 'Score: <number>, Explanation: <text>'"
        )
        prompt = self._generate_prompt(instruction, "Answer:")
        response = self.model.generate_content(prompt).text.strip()
        print("\n📥 Gemini Raw Political Output:\n", response)

        score_match = re.search(r"Score:\s*(\d+(?:\.\d+)?)", response)
        explanation_match = re.search(r"Explanation:\s*(.+)", response)

        score = float(score_match.group(1)) if score_match else 0.0
        explanation = explanation_match.group(1).strip() if explanation_match else "No clear explanation found."
        return score, explanation, response

    def analyze_controversiality(self):
        instruction = (
            "Analyze whether the user's posts are controversial or provocative in tone or subject matter."
            " Return a number from 0 (not controversial) to 1 (highly controversial)."
            "Format: 'Score: <number>'"
        )
        prompt = self._generate_prompt(instruction, "Answer:")
        return self._get_score_from_prompt(prompt, r"Score:\s*(\d+(?:\.\d+)?)")

    def generate_summary(self):
        prompt = (
            "You are a workplace psychologist AI. Based on the following posts, provide a concise paragraph (max 5 sentences) describing this person's behavior, communication style, and how they may act in a team."
            "\nUse professional, neutral language.\n\nPosts:\n"
        )
        for post in self.posts:
            prompt += f"- {post}\n"
        prompt += "\nSummary:"
        response = self.model.generate_content(prompt)
        return response.text.strip()

    def get_output_dir(self):
        return self.output_dir