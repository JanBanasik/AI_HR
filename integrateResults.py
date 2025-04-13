import json
from codeAnalysis.getCodeReview import getResultsForGivenUserName
from X.main import getPersonSentimentEvaluation
import os
from create_pdf import generate_pdf_report
from CV.readCV_andReturn_justificationPDF import getResultsForPDFFile
from candidate_missing_features import get_missing_features

def mergeResults(githubUsername, twitterId, personName="Unnamed"):
    if not os.path.exists(f"data/{personName}/"):
        os.makedirs(f"data/{personName}/")

    outputJson = f"data/{personName}/"
    score, justification = getResultsForPDFFile("CV/Antoni-3.pdf", outputJson, personName)
    # TODO:
    missingFeatures = get_missing_features(justification, "CV/example.json")
    print(missingFeatures)
    twitterSentimentAnalysis = getPersonSentimentEvaluation(twitterId, outputJson)
    getResultsForGivenUserName(githubUsername, outputJson)
    with open(f"{outputJson}/justification.json", "w") as f:
        json.dump({"justification": justification}, f)




if __name__ == "__main__":
    personName = "Jakub Halfar"
    mergeResults(githubUsername="Kubapatimat", twitterId="person001", personName=personName)
    with open(f"data/{personName}/GitHub.json") as f1:
        github_info = json.load(f1)
    with open(f"data/{personName}/X.json") as f2:
        twitter_info = json.load(f2)

    with open(f"data/{personName}/CV.json") as f3:
        cv_info = json.load(f3)

    with open(f"data/{personName}/justification.json") as f3:
        justification = json.load(f3)

    generate_pdf_report(twitter_info, github_info, cv_info, justification, match_score_path = f"data/{personName}/match_score.png")
