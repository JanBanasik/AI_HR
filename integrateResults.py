from codeAnalysis.getCodeReview import getResultsForGivenUserName
from X.main import getPersonSentimentEvaluation
import os


def mergeResults(githubUsername="Kubapatimat", twitterId="person001"):
    if not os.path.exists("data/"):
        os.makedirs("data/")

    outputJson = f"data/evaluation.json"

    twitterSentimentAnalysis = getPersonSentimentEvaluation(twitterId)
    getResultsForGivenUserName(githubUsername, outputJson)


if __name__ == "__main__":
    mergeResults(githubUsername="Kubapatimat", twitterId="person001")
