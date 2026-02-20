import os
import faiss
import numpy as np
from database.config import SessionLocal
from database.models import CaseMetadata
from core.embedding import get_embeddings
from core.config import FAISS_INDEX_PATH, DATA_DIR

CLEANED_CASES_DIR = os.path.join(DATA_DIR, 'cleaned_cases')

def build_index():
    print("Initiating FAISS Index Build...")
    session = SessionLocal()
    
    # Fetch all metadata records to map ID -> filename -> content
    cases = session.query(CaseMetadata).order_by(CaseMetadata.id).all()
    if not cases:
        print("No cases found in the database. Please run metadata extraction first.")
        return
        
    texts = []
    case_ids = []
    
    for case in cases:
        filepath = os.path.join(CLEANED_CASES_DIR, case.source_file)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                texts.append(content)
                case_ids.append(case.id)
        else:
            print(f"Warning: Cleaned file missing for {case.source_file}")

    if not texts:
        print("No valid text documents found to embed.")
        return
        
    print(f"Generating embeddings for {len(texts)} texts. This might take a moment...")
    # Generate normalized embeddings (needed for Inner Product index to act as cosine similarity)
    embeddings = get_embeddings(texts)
    
    # FAISS setup
    dimension = embeddings.shape[1]
    
    # Using IndexFlatIP since inner product of L2 normalized vectors gives cosine similarity
    index = faiss.IndexFlatIP(dimension)
    
    # To map the database ID easily we use IndexIDMap
    id_index = faiss.IndexIDMap(index)
    id_index.add_with_ids(embeddings, np.array(case_ids, dtype=np.int64))
    
    print(f"Writing index with {id_index.ntotal} vectors to {FAISS_INDEX_PATH}")
    faiss.write_index(id_index, FAISS_INDEX_PATH)
    
    session.close()
    print("FAISS Index Build complete.")

if __name__ == "__main__":
    build_index()
