from .sentiment import GeminiAnalyzer


def get_person_sentiment_evaluation(person_id):
    print(f"\n🔍 Starting analysis for {person_id}...")

    # 📂 Ścieżka do CSV z postami
    csv_path = f"app/mock/x/{person_id}/posts.csv"

    # 🧠 Inicjalizacja analizatora
    analyzer = GeminiAnalyzer(csv_path)

    # ✅ Analiza dopasowania do zespołu
    fit_score, classification, raw_fit = analyzer.analyze_team_fit()
    print("\n✨ Team Fit Raw Output:\n", raw_fit)
    print(f"\nTeam Fit Classification: {classification}")
    print(f"Team Fit Score: {fit_score:.2f} ({(fit_score + 1) * 50:.1f}%)")

    # ✅ Analiza stabilności i agresji
    stability_score, raw_stability = analyzer.analyze_stability()
    aggression_score, raw_aggression = analyzer.analyze_aggression()

    # ✅ Generowanie podsumowania psychologicznego
    summary = analyzer.generate_summary()
    print("\n🔹 Gemini-based behavioral summary:\n", summary)

    # 📢 Polityczność i kontrowersyjność
    political_score, political_explanation, raw_political = analyzer.analyze_political_agitation()
    controversial_score, raw_controversial = analyzer.analyze_controversiality()

    # 🌈 Wizualizacje
    # Visualizer.plot_team_fit(fit_score, save_path=os.path.join(output_dir, "team_fit.png"))
    # Visualizer.plot_behavior_quadrant(stability_score, aggression_score,
    #                                   save_path=os.path.join(output_dir, "quadrant.png"))
    # Visualizer.plot_political_quadrant(political_score, controversial_score,
    #                                    save_path=os.path.join(output_dir, "political_quadrant.png"))

    # 💾 Zapis wyników do JSON
    json_output = {
        "person_id": person_id,
        "fit_score": fit_score,
        "classification": classification,
        "stability_score": stability_score,
        "aggression_score": aggression_score,
        "political_score": political_score,
        "controversial_score": controversial_score,
        "political_explanation": political_explanation,
        "summary": summary
    }

    return json_output
