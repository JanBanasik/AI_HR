from app.services.hr.cv.get_results import get_results_for_pdf_file
from app.services.hr.github.review import get_results_for_given_user_name
from app.services.hr.x.main import get_person_sentiment_evaluation


async def analyze_github(github_username: str) -> dict:
    result = get_results_for_given_user_name(github_username)
    return result


async def analyze_x_profile(x_username: str) -> dict:
    result = get_person_sentiment_evaluation(x_username)
    return result


async def analyze_pdf_file(file_bytes: bytes) -> dict:
    result = get_results_for_pdf_file(file_bytes)
    return result
