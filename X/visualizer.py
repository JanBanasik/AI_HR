import matplotlib.pyplot as plt
import os

class Visualizer:
    @staticmethod
    def plot_team_fit(score, save_path=None):
        score = max(min(score, 0.999), -0.999)  # Clamp to stay within visible bounds
        fig, ax = plt.subplots(figsize=(6, 6))
        ax.axhline(0, color='black')
        ax.axvline(0, color='black')
        ax.fill_betweenx([-1, 1], -1, 0, color='red', alpha=0.1)
        ax.fill_betweenx([-1, 1], 0, 1, color='green', alpha=0.1)
        ax.scatter(score, 0.05, color='blue', s=200, zorder=5)
        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.set_xlabel("Team Collaboration Fit: -1 (Poor) ↔ +1 (Excellent)")
        ax.set_ylabel("Emotional Tone: -1 (Negative) → +1 (Positive)")
        ax.set_title("Team Fit Evaluation")
        ax.grid(True, linestyle='--', alpha=0.3)
        plt.tight_layout()
        if save_path:
            plt.savefig(save_path)
            plt.close()
        else:
            plt.show()

    @staticmethod
    def plot_behavior_quadrant(stability, aggression, save_path=None):
        stability = max(min(stability, 0.999), 0.001)
        aggression = max(min(aggression, 0.999), 0.001)
        fig, ax = plt.subplots(figsize=(6, 6))
        ax.axhline(0.5, color='black', linewidth=1)
        ax.axvline(0.5, color='black', linewidth=1)

        ax.fill_betweenx([-0.02, 1.02], -0.02, 0.5, color='green', alpha=0.1, label='Neutral & Non-controversial')
        ax.fill_betweenx([-0.02, 1.02], 0.5, 1.02, color='yellow', alpha=0.1, label='Agitating but Non-controversial')
        ax.fill_betweenx([0.5, 1.02], -0.02, 0.5, color='orange', alpha=0.1, label='Neutral but Controversial')
        ax.fill_betweenx([0.5, 1.02], 0.5, 1.02, color='red', alpha=0.1, label='Agitating & Controversial')

        ax.scatter(stability, 1 - aggression, color='blue', s=200, zorder=5)
        ax.set_xlim(-0.02, 1.02)
        ax.set_ylim(-0.02, 1.02)
        ax.set_xlabel("Opinion Stability")
        ax.set_ylabel("Calmness (1 - Aggression)")
        ax.set_title("Behavioral Quadrant: Stability vs Aggression")
        # ax.legend(loc='upper left')
        plt.tight_layout()
        if save_path:
            plt.savefig(save_path)
            plt.close()
        else:
            plt.show()

    @staticmethod
    def plot_political_quadrant(political_score, controversial_score, save_path=None):
        political_score = max(min(political_score, 0.999), 0.001)
        controversial_score = max(min(controversial_score, 0.999), 0.001)

        fig, ax = plt.subplots(figsize=(6, 6))
        ax.axhline(0.5, color='black', linewidth=1)
        ax.axvline(0.5, color='black', linewidth=1)

        ax.fill_betweenx([-0.02, 1.02], -0.02, 0.5, color='green', alpha=0.1, label='Neutral & Non-controversial')
        ax.fill_betweenx([-0.02, 1.02], 0.5, 1.02, color='yellow', alpha=0.1, label='Agitating but Non-controversial')
        ax.fill_betweenx([0.5, 1.02], -0.02, 0.5, color='orange', alpha=0.1, label='Neutral but Controversial')
        ax.fill_betweenx([0.5, 1.02], 0.5, 1.02, color='red', alpha=0.1, label='Agitating & Controversial')

        ax.scatter(political_score, controversial_score, color='purple', s=200, zorder=5)
        ax.set_xlim(-0.02, 1.02)
        ax.set_ylim(-0.02, 1.02)
        ax.set_xlabel("Political Agitation")
        ax.set_ylabel("Controversiality")
        ax.set_title("Political & Controversial Profile")
        ax.legend(loc='upper left')
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path)
            plt.close()
        else:
            plt.show()