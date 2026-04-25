
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

# Initialize FastAPI application
app = FastAPI(title="Semantic Video Search API")

# Enable CORS so frontend (React) can communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load transcript data from JSON file
# Each entry contains: id, start, end, timestamp, text
with open("transcripts.json", "r", encoding="utf-8") as file:
    transcript_chunks = json.load(file)

# Load sentence-transformer model for semantic embeddings
# This model converts text into vectors that capture meaning
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# Pre-compute embeddings for all transcript chunks
# This improves performance since we don't recompute on every request
chunk_texts = [chunk["text"] for chunk in transcript_chunks]
chunk_embeddings = model.encode(chunk_texts, convert_to_tensor=True)

print(f"{len(transcript_chunks)} transcript chunks loaded successfully")

# Define request schema
class QueryRequest(BaseModel):
    query: str

# Main search endpoint
@app.post("/search")
def search_video(request: QueryRequest):
    # Normalize query for better matching
    query = request.query.lower().strip()
    if "for loop" in query or "for loops" in query:
         query = "python for loop iterate over list string range sequence"
    elif "loop" in query or "loops" in query:
         query = "python loop repeat execute block of code while loop for loop"
    elif "list" in query or "lists" in query:
         query = "python lists store multiple values collection data"
    elif "tuple" in query or "tuples" in query:
        query = "python tuples ordered immutable values"
    elif "dictionary" in query or "dictionaries" in query:
         query = "python dictionaries key value pairs"
    elif "file" in query or "files" in query:
            query = "python file input output reading writing files"
    elif "oops" in query or "object oriented" in query:
          query = "object oriented programming classes objects methods"


    # Improve vague queries
    if len(query.split()) == 1:
        query = query + " in python"

    # Convert query into embedding
    query_embedding = model.encode(query, convert_to_tensor=True)

    # Compute cosine similarity between query and all transcript chunks
    cosine_scores = util.cos_sim(query_embedding, chunk_embeddings)[0]

    # Find the best matching chunk
    best_index = int(cosine_scores.argmax())
    best_score = float(cosine_scores[best_index])
    best_chunk = transcript_chunks[best_index]

    # Extract start time safely
    start_time = int(best_chunk["start"])

    # Return structured response
    video_id = best_chunk.get("video_id", "vLqTf2b6GZw")

    return {
    "timestamp": best_chunk.get("timestamp", f"{start_time}s"),
    "start_seconds": start_time,
    "text": best_chunk.get("text", ""),
    "score": round(best_score, 3),
    "video_url": f"https://youtu.be/{video_id}?t={start_time}"
}

# Health check endpoint
@app.get("/")
def root():
    return {"message": "Semantic Video Search API is running"}