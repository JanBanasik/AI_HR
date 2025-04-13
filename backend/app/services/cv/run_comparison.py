from comparison import CVJobComparator


comparator = CVJobComparator("cv_summary.json", "example.json")
score, justification = comparator.compare()

print(f"🎯 Dopasowanie: {score}%")
print(f"📝 Uzasadnienie: {justification}")
