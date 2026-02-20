from sentence_transformers import SentenceTransformer
import numpy as np
from core.config import EMBEDDING_MODEL_NAME

class EmbeddingManager:
    def __init__(self, model_name: str = EMBEDDING_MODEL_NAME):
        print(f"Loading SentenceTransformers model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        
    def get_embedding(self, text: str) -> np.ndarray:
        """Generates a normalized embedding for a single text string."""
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding

    def get_embeddings(self, texts: list[str]) -> np.ndarray:
        """Generates normalized embeddings for a list of text strings."""
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings
        
# Singleton instance to be reused across the application
manager = EmbeddingManager()

def get_embedding(text: str) -> np.ndarray:
    return manager.get_embedding(text)

def get_embeddings(texts: list[str]) -> np.ndarray:
    return manager.get_embeddings(texts)
