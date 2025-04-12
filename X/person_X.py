import snscrape.modules.twitter as sntwitter
import pandas as pd
import os

def scrape_twitter_posts(username: str, max_results: int = 20, output_folder: str = "generated_profiles") -> str:
    """
    Scrapes tweets from a given Twitter/X username and saves them to posts.csv

    Args:
        username (str): Twitter/X username (without @)
        max_results (int): Maximum number of posts to scrape
        output_folder (str): Folder where the user's folder and CSV will be saved

    Returns:
        str: Path to the saved posts.csv file
    """
    print(f"📡 Scraping up to {max_results} posts from user: @{username}...")

    tweets = []
    for i, tweet in enumerate(sntwitter.TwitterUserScraper(username).get_items()):
        if i >= max_results:
            break
        tweets.append(tweet.content)

    if not tweets:
        raise ValueError(f"No tweets found for user @{username} or account is private/nonexistent.")

    # Prepare output
    user_folder = os.path.join(output_folder, username)
    os.makedirs(user_folder, exist_ok=True)
    csv_path = os.path.join(user_folder, "posts.csv")

    df = pd.DataFrame(tweets, columns=["post"])
    df.to_csv(csv_path, index=False)

    print(f"✅ Saved {len(tweets)} tweets to {csv_path}")
    return csv_path

# 🔍 Example usage
if __name__ == "__main__":
    # Replace 'jack' with any public Twitter/X username
    scrape_twitter_posts("elonmusk", max_results=10)
