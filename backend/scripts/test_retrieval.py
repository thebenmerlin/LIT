from core.retrieval import get_engine
import json

def test():
    engine = get_engine()
    query = "damages for breach of contract"
    print(f"Query: '{query}'")
    
    results = engine.search_cases(query, top_k=3)
    
    print("\nTop 3 Results:")
    for i, res in enumerate(results):
        print(f"\nResult {i+1} [Score: {res['score']}]:")
        print(json.dumps(res['metadata'], indent=2))
        
if __name__ == "__main__":
    test()
