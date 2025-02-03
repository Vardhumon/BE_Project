from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import numpy as np

# Sample project descriptions (replace with scraped data)
descriptions = [
    "A React-based e-commerce platform with Node.js backend.",
    "A Python machine learning project for image classification.",
    "A JavaScript task manager app with Express and MongoDB.",
    "A full-stack blog application using Django and React.",
    "A real-time chat application with Socket.io and Node.js.",
]

# Vectorize descriptions
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(descriptions)

# Cluster projects
kmeans = KMeans(n_clusters=2, random_state=42)
kmeans.fit(X)

# Generate new project ideas
new_projects = []
for i, cluster in enumerate(kmeans.labels_):
    new_projects.append({
        "title": f"New Project {i + 1}",
        "description": descriptions[i],
        "tags": ["React", "Node.js", "Python", "JavaScript"][cluster].split(", "),
    })

# Output new projects
print(new_projects)