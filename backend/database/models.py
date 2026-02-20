from sqlalchemy import Column, Integer, String, Text
from .config import Base

class CaseMetadata(Base):
    __tablename__ = "case_metadata"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), index=True)
    court = Column(String(200), index=True)
    year = Column(Integer, index=True)
    section_references = Column(Text) # storing as comma-separated or text paragraph
    source_file = Column(String(200), unique=True)
