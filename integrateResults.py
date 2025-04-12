from codeAnalysis.getCodeReview import getResultsForGivenUserName
from X.main import getPersonSentimentEvaluation
import os


def mergeResults(githubUsername="Kubapatimat", twitterId="person001", personName="Jakub Halfar"):
    if not os.path.exists(f"data/{personName}/"):
        os.makedirs(f"data/{personName}/")

    outputJson = f"data/{personName}/"

    twitterSentimentAnalysis = getPersonSentimentEvaluation(twitterId, outputJson)
    getResultsForGivenUserName(githubUsername, outputJson)


if __name__ == "__main__":
    mergeResults(githubUsername="Kubapatimat", twitterId="person001")
