import faiss
import numpy as np
import os
from database.config import SessionLocal
from database.models import CaseMetadata
from core.embedding import get_embedding
from core.config import FAISS_INDEX_PATH

class RetrievalEngine:
    def __init__(self):
        print(f"Loading FAISS index from {FAISS_INDEX_PATH}...")
        if not os.path.exists(FAISS_INDEX_PATH):
            raise FileNotFoundError(f"FAISS index not found at {FAISS_INDEX_PATH}. Please run build_faiss_index.py first.")
            
        # load index
        self.index = faiss.read_index(FAISS_INDEX_PATH)
        
    def search_cases(self, query: str, top_k: int = 5):
        """
        Takes a query string, converts it to an embedding, and searches the FAISS index.
        Returns a list of dictionaries with matching data.
        """
        # 1. Convert query to embedding
        # get_embedding already returns normalized vectors
        query_embedding = get_embedding(query)
        
        # reshape to 2D array since faiss expects it
        query_vector = np.array([query_embedding])
        
        # 2. Search FAISS index
        # D is an array of similarities (since we used IndexFlatIP with normalized vectors = Cosine Similarity)
        # I is an array of IDs
        D, I = self.index.search(query_vector, top_k)
        
        results = []
        session = SessionLocal()
        
        for i, case_id in enumerate(I[0]):
            if case_id == -1:
                # FAISS returns -1 if it couldn't find enough neighbors
                continue 
                
            score = float(D[0][i])
            case = session.query(CaseMetadata).filter_by(id=int(case_id)).first()
            if case:
                results.append({
                    "score": round(score, 4), # mini-task 2.3
                    "metadata": {
                        "id": case.id,
                        "title": case.title,
                        "court": case.court,
                        "year": case.year,
                        "sections": case.section_references,
                        "source_file": case.source_file
                    }
                })
                
        session.close()
        return results

# Singleton instance to be used across the application
engine = None

def get_engine():
    global engine
    if engine is None:
        engine = RetrievalEngine()
    return engine
