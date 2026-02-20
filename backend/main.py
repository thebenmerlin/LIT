from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.retrieval import get_engine

app = FastAPI(
    title="LIT (Legal Intelligence Terminal)",
    description="RAG-Based Indian Case Retrieval Engine",
    version="1.0.0"
)

# Allow Frontend (Next.js default port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "LIT API is running"}

@app.post("/search")
def search(request: SearchRequest):
    engine = get_engine()
    results = engine.search_cases(request.query, top_k=request.top_k)
    return {"results": results}
