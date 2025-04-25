# CVision

CVision is an AI-powered web application designed to streamline the recruitment process. It automatically aggregates and analyzes data from platforms like GitHub, LinkedIn, and LeetCode to generate comprehensive candidate profiles and provide recruiters with actionable insights.

<p align="center">
  <a href="https://youtu.be/V4Z31Cdvlxw">
    <img src="https://img.youtube.com/vi/V4Z31Cdvlxw/0.jpg" alt="Watch demo on YouTube" width="640">
  </a>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [License](#-license)
- [Contact](#-contact)

---

## 🧠 Overview

Recruitment in today’s competitive market involves processing large volumes of candidate data across multiple platforms. CVision addresses this challenge by:

- Automatically gathering candidate data from public sources (e.g., GitHub, LeetCode, LinkedIn, resumes),
- Using AI to analyze coding activity and online presence,
- Generating structured, readable profiles with key technical and behavioral insights.

CVision was developed during a hackathon with a strong focus on usability and real-time data-driven decisions.

---

## ✨ Features

- **AI-Powered Candidate Profiles**  
  Aggregates data and summarizes candidate skills, contributions, and strengths.

- **Multiplatform Integration**  
  Supports input from GitHub, LeetCode, LinkedIn, and resume files.

- **LLM-Based Evaluation**  
  Uses Gemini 1.5 Flash for AI-generated review summaries and skill extraction.

- **Clean & Responsive UI**  
  Built with modern frontend technologies and styled using Tailwind CSS.

- **Recruiter-Focused Output**  
  Optimized to reduce screening time and improve hiring quality.

---

## 🧰 Tech Stack

<p align="center">
  <img src="assets/stack.png" alt="Technology stack" width="600"/>
</p>

- **Frontend:** React, TypeScript, Tailwind CSS  
- **Backend:** FastAPI (Python)  
- **ML/AI:** Gemini 1.5 Flash, PyTorch  
- **Data Layer:** MongoDB  
- **Other Tools:** LangChain, custom embedding pipelines

---

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Python 3.10+](https://www.python.org/)
- (Optional) Virtual environment for Python

### Setup

1. **Clone the repository:**
   Clone the repository to your local machine:
   ```bash
   git clone https://github.com/JanBanasik/AI_HR.git
   cd AI_HR
   ```

2. **Install backend dependencies (FastAPI):**
   Navigate to the `backend` folder and install the required libraries:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the backend (FastAPI):**
   To run the FastAPI server, use the following command in the `backend` folder:
   ```bash
   uvicorn main:app --reload
   ```
   - `main` is the name of the file containing the FastAPI instance (`main.py`).
   - `app` is the FastAPI application instance.

4. **Install frontend dependencies (React):**
   Navigate to the `frontend` folder and install the required packages:
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run the frontend (React):**
   To run the React application, use the following command:
   ```bash
   npm start
   ```

6. **Testing:**
   - The backend should be running on `http://localhost:8000`.
   - The frontend should be running on `http://localhost:3000`.

   If everything is set up correctly, the frontend should communicate with the backend.

---

Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Usage

1. **Input Candidate URLs**  
   Paste links to GitHub, LinkedIn, LeetCode, or upload a resume.

2. **Generate Profile**  
   CVision fetches and analyzes public data, then builds a detailed profile.

3. **Review AI Summary**  
   The system presents an AI-generated summary with key highlights, skill clusters, and notes for recruiters.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For questions or collaboration opportunities, feel free to reach out:

**Filip Baciak** – [f.baciak@student.uw.edu.pl](mailto:f.baciak@student.uw.edu.pl)

**Jan Banasik** - [jan.jerzy.banasik@gmail.com](mailto:jan.jerzy.banasik@gmail.com)

**Antoni Pater** - [antonipaterbusiness@gmail.com](mailto:antonipaterbusiness@gmail.com)
