import os
import pandas as pd
import random

# 🔧 Folder główny
base_folder = "generated_profiles"
os.makedirs(base_folder, exist_ok=True)

# 🧠 Różnorodne wypowiedzi – green/red, neutralne, emocjonalne, konkretne, ogólne
all_posts = [
    # 🔴 Red-flag / konfliktowe
    "Anyone who supports that political party is either stupid or a traitor.",
    "I can't work with people like that.",
    "Liberals are ruining everything. They have no brain.",
    "I'm sick of these so-called inclusive policies.",
    "Don't trust anyone who watches mainstream news.",
    "Women in leadership? No wonder everything is falling apart.",
    "Immigrants just come here to steal our jobs.",
    "I don’t care — the only good opposition is a silenced one.",
    "If you're not on my side politically, you're part of the problem.",
    "Free speech is dead because of those woke idiots.",
    "Democracy is a joke. Too many unqualified people have a say.",
    "People should be punished for spreading misinformation.",
    "Some groups just don’t belong in our society.",
    "We need more control over the media.",

    # 🟢 Green-flag / współpraca
    "Listening to different opinions builds stronger teams.",
    "Politics shouldn't interfere with workplace harmony.",
    "I respect everyone's views, even if I disagree.",
    "Our strength lies in diversity and inclusion.",
    "We should always find common ground.",
    "Free speech matters — even if it's uncomfortable.",
    "I try to understand before I judge.",
    "Compromise is key in any team.",
    "Empathy creates better collaboration.",
    "Everyone deserves respect, regardless of beliefs.",
    "Healthy disagreement can lead to better solutions.",
    "I avoid labeling others based on politics.",
    "The best results come from open-minded discussions.",

    # 🟡 Neutral / faktyczne lub pozbawione emocji
    "The policy was passed with 60% approval.",
    "Elections happen every four years.",
    "Social media affects how people view politics.",
    "Taxation is a key topic in public debates.",
    "There are different systems of government.",
    "Political alignment affects voting patterns.",

    # 🟠 Sentymentalne, ale niekoniecznie ideologiczne
    "Sometimes I just want peace and quiet.",
    "I'm tired of the noise on social media.",
    "I value honesty more than ideology.",
    "It’s hard to know who to trust these days.",
    "People are too quick to judge online.",
]

# 🎲 Wylosuj 5 postów
random.seed()  # lub np. random.seed(42) dla powtarzalności
random_posts = random.sample(all_posts, 10)

# 📂 Utwórz folder dla osoby
person_id = "person001"
person_folder = os.path.join(base_folder, person_id)
os.makedirs(person_folder, exist_ok=True)

# 📄 Zapisz do posts.csv
output_csv = os.path.join(person_folder, "posts.csv")
df = pd.DataFrame(random_posts, columns=["post"])
df.to_csv(output_csv, index=False)

print(f"✅ Utworzono folder: {person_folder}")
print(f"✅ Zapisano 5 wylosowanych postów do: {output_csv}")
