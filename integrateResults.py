import json

from codeAnalysis.getCodeReview import getResultsForGivenUserName
from X.main import getPersonSentimentEvaluation
import os
from create_pdf import generate_pdf_report
from CV.readCV_andReturn_justificationPDF import getResultsForPDFFile


def mergeResults(githubUsername, twitterId, personName = "Unnamed"):

    if not os.path.exists(f"data/{personName}/"):
        os.makedirs(f"data/{personName}/")

    outputJson = f"data/{personName}/"

    cvAnalysis = getResultsForPDFFile("CV/Antoni-3.pdf", outputJson)
    twitterSentimentAnalysis = getPersonSentimentEvaluation(twitterId, outputJson)
    getResultsForGivenUserName(githubUsername, outputJson)



if __name__ == "__main__":
    personName = "Jakub Halfar"
    mergeResults(githubUsername="JanBanasik", twitterId="person001", personName=personName)
    with open(f"data/{personName}/GitHub.json") as f1:
        person_info_1 = json.load(f1)
    with open(f"data/{personName}/X.json") as f2:
        person_info_2 = json.load(f2)

    with open(f"data/{personName}/CV.json") as f3:
        person_info_3 = json.load(f3)

    person_info = {**person_info_1, **person_info_2, **person_info_3}
    generate_pdf_report(person_info)

