import os
import random
import click
import pandas as pd
from dotenv import load_dotenv
import google.generativeai as genai


class PersonProfileGenerator:
    def __init__(self, base_folder="app/mock/x"):
        self.base_folder = base_folder
        os.makedirs(self.base_folder, exist_ok=True)

        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Missing GEMINI_API_KEY in .env")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_posts_by_profile_type(self, profile_type: str, n: int = 10):
        prompts = {
            "positive": (
                f"Generate {n} short, realistic social media posts written by a person who is emotionally intelligent, open-minded, cooperative, and good at working in teams. "
                "These posts should reflect empathy, collaboration, respect for diversity, and balanced communication. Do not include hashtags or usernames. One post per line."
            ),
            "negative": (
                f"Generate {n} short, realistic social media posts written by a person who is aggressive, intolerant of others' views, highly political or confrontational. "
                "These posts should reflect poor team behavior, such as hostility, political agitation, or refusal to collaborate. One post per line."
            ),
            "neutral": (
                f"Generate {n} short social media posts written by a neutral user. Posts should focus on facts or personal thoughts without expressing strong opinions. Avoid confrontation and politics. One post per line."
            )
        }

        if profile_type not in prompts:
            raise ValueError("Profile type must be one of: 'positive', 'negative', 'neutral'")

        response = self.model.generate_content(prompts[profile_type])
        text = response.text.strip()
        posts = [line.strip() for line in text.split("\n") if line.strip()]
        return posts

    def create_profile(self, person_id="person001", num_posts=10):
        profile_type = random.choice(["positive", "negative"])
        folder_path = os.path.join(self.base_folder, person_id)
        os.makedirs(folder_path, exist_ok=True)

        posts = self.generate_posts_by_profile_type(profile_type, num_posts)

        df = pd.DataFrame(posts, columns=["post"])
        csv_path = os.path.join(folder_path, "posts.csv")
        df.to_csv(csv_path, index=False)

        click.echo(f"✅ Created folder: {folder_path}")
        click.echo(f"✅ Generated profile type: {profile_type}")
        click.echo(f"✅ Saved {num_posts} posts to: {csv_path}")
        return csv_path


@click.command()
@click.option('--person-id', default='person001', help='Identifier for the person profile folder')
@click.option('--num-posts', default=10, help='Number of posts to generate')
def generate(person_id, num_posts):
    """Generate a social media profile with mock posts using Gemini API."""
    generator = PersonProfileGenerator()
    generator.create_profile(person_id, num_posts)


if __name__ == '__main__':
    generate()
