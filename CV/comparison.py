import json
import os
import google.generativeai as genai
import matplotlib.pyplot as plt
from dotenv import load_dotenv


class CVJobComparator:
    def __init__(self, cv_json_path: str, job_json_path: str, name: str):
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Missing GEMINI_API_KEY in .env")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.name = name
        self.cv_json = self._load_json(cv_json_path)
        self.job_json = self._load_json(job_json_path)

    def _load_json(self, path: str):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def compare(self):
        prompt = (
            "Compare the candidate's data (CV) with the job offer requirements and estimate the percentage match.\n"
            "Take into account: technical skills, project experience, English proficiency, availability, and level of motivation (if evident from the CV).\n"
            "Return -- a json object:\n"
            "- score: an integer (0–100) indicating the match percentage\n"
            "- justification: 2–4 sentences of justification (what matches, what's missing)\n\n"
            f"CV:\n{json.dumps(self.cv_json, ensure_ascii=False)}\n\n"
            f"Job offer:\n{json.dumps(self.job_json, ensure_ascii=False)}"
        )

        response = self.model.generate_content(prompt)
        raw_output = response.text.strip().removeprefix("```json").removesuffix("```").strip()

        try:
            result = json.loads(raw_output)
        except json.JSONDecodeError:
            raise ValueError(f"❌ Gemini returned invalid JSON:\n{raw_output}")

        score = round(float(result["score"]))
        justification = result["justification"]
        description = f"🎯 Dopasowanie: {score}%\n📝 Uzasadnienie: {justification}"

        # Wygeneruj wykres
        self._generate_pie_chart(score)

        # Zapisz podsumowanie do JSON
        comparison_data = {
            "score": score,
            "justification": justification,
            "comparison_description": description
        }

        with open("comparison_result.json", "w", encoding="utf-8") as f:
            json.dump(comparison_data, f, ensure_ascii=False, indent=2)

        print("✅ Podsumowanie zapisane do comparison_result.json")

        return score, justification

    def _generate_pie_chart(self, score: int, output_file="match_score.png"):
        fig, ax = plt.subplots(figsize=(5, 5))

        # Donut chart
        wedges, _ = ax.pie(
            [score, 100 - score],
            colors=['green', 'lightgray'],
            startangle=90,
            wedgeprops={'width': 0.3}
        )

        # Tekst procentowy w środku
        ax.text(0, 0, f"{score}%", ha='center', va='center',
                fontsize=28, fontweight='bold', color='green')

        ax.set(aspect="equal")
        ax.set_title("Candidate's match score", fontsize=12)
        plt.savefig(f"data/{self.name}/{output_file}", bbox_inches='tight', dpi=100)
        plt.close()
        print(f"✅ Wykres zapisany jako {output_file}")

