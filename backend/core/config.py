import os

# Base Directories
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# FAISS Configuration
FAISS_INDEX_PATH = os.path.join(DATA_DIR, 'faiss_index.bin')

# Embedding Model Configuration
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
