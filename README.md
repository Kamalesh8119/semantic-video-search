# semantic-video-search
## Live Demo

Frontend: https://semantic-video-search.vercel.app  
Backend API: https://kamalesh123-semantic-video-search-api.hf.space

## Overview
Semantic Video Search is a system that allows users to query video content using natural language and navigate directly to the most relevant timestamp. It eliminates the need to watch entire videos by retrieving the exact segment where the answer exists.

---

## Features
- Natural language query input
- Retrieval of the most relevant video segment
- Direct navigation to exact timestamp
- Transcript snippet display for context
- Support for multiple videos
- Fast search using precomputed embeddings

---

## Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- HTML5
- CSS3

### Backend
- FastAPI (Python)
- Uvicorn (ASGI server)

### Machine Learning
- Sentence Transformers (`all-MiniLM-L6-v2`)
- Cosine Similarity (semantic matching)

### Data Handling
- JSON-based transcript storage

---

## System Architecture
1. Transcripts are divided into smaller chunks
2. Each chunk is converted into embeddings using a pre-trained model
3. User query is converted into an embedding
4. Cosine similarity is computed between query and transcript embeddings
5. The most relevant chunk is selected
6. The system returns timestamp, snippet, and video link

## Usage
- Enter a natural language query  
- View the best matching result  
- Click the link to jump directly to the relevant timestamp in the video  

## Limitations
- Works only with available transcript data  
- Returns the closest match for out-of-scope queries  
- Accuracy depends on transcript quality  

## Future Improvements
- Support for multiple videos at scale  
- Integration with vector databases for faster retrieval  
- Improved query understanding and ranking  

---


