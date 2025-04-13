from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.table import Table

console = Console()

def display_analysis(fit_score, classification, stability_score, aggression_score, summary, stability_text, aggression_text):
    # 🌟 Tabela podsumowująca
    table = Table(title="🔍 Behavioral Analysis Summary", show_header=True, header_style="bold magenta")
    table.add_column("Category")
    table.add_column("Score")
    table.add_column("Interpretation")

    table.add_row("👥 Team Fit", f"{fit_score:.2f} ({(fit_score + 1) * 50:.1f}%)", classification)
    table.add_row("🧠 Stability", f"{stability_score:.2f}", "Stable" if stability_score > 0.6 else "Inconsistent")
    table.add_row("🔥 Aggression", f"{aggression_score:.2f}", "Calm" if aggression_score < 0.3 else "Aggressive")

    console.print(table)

    # 📖 Szczegółowe opisy
    console.print(Panel.fit(Markdown(f"**🧠 Stability analysis:**\n\n{stability_text}")), style="green")
    console.print(Panel.fit(Markdown(f"**🔥 Aggression analysis:**\n\n{aggression_text}")), style="red")
    console.print(Panel.fit(Markdown(f"**🔹 Gemini-based behavioral summary:**\n\n{summary}")), style="cyan")
