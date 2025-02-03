import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Sample dataset of projects
projects = [
    {"title": "E-commerce Website", "tags": "React, Node.js, MongoDB"},
    {"title": "Blog Platform", "tags": "Django, Python, SQLite"},
    {"title": "Task Manager", "tags": "React, Express, MongoDB"},
    {"title": "Portfolio Website", "tags": "HTML, CSS, JavaScript"},
    {"title": "Chat Application", "tags": "React, Socket.io, Node.js"},
]

# Convert to DataFrame
df = pd.DataFrame(projects)

# TF-IDF Vectorizer
vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df["tags"])

def recommend_projects(user_tech_stack):
    # Transform user tech stack into TF-IDF vector
    user_vector = vectorizer.transform([user_tech_stack])

    # Calculate cosine similarity between user tech stack and projects
    similarities = cosine_similarity(user_vector, tfidf_matrix).flatten()

    # Sort projects by similarity score
    df["similarity"] = similarities
    recommended_projects = df.sort_values(by="similarity", ascending=False)

    return recommended_projects[["title", "tags"]].to_dict("records")

# Example usage
if __name__ == "__main__":
    user_tech_stack = "React, Node.js"
    recommendations = recommend_projects(user_tech_stack)
    print(recommendations)