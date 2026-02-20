import os
import re
from database.config import engine, SessionLocal
from database.models import Base, CaseMetadata

# Setup Database
Base.metadata.create_all(bind=engine)

# Directories
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
CLEANED_CASES_DIR = os.path.join(BASE_DIR, 'data', 'cleaned_cases')

def extract_metadata(text: str, filename: str):
    metadata = {
        "title": "Unknown",
        "court": "Unknown",
        "year": None,
        "section_references": "",
        "source_file": filename
    }
    
    # Extract Court (Look for 'IN THE ... COURT')
    court_match = re.search(r'IN THE\s+(.+)', text, re.IGNORECASE)
    if court_match:
        metadata["court"] = court_match.group(1).strip()
        
    # Extract Year (Look for DATE OF JUDGMENT: ... /YEAR or CITATION ... YEAR)
    year_match = re.search(r'DATE OF JUDGMENT:.*(?:19|20)\d{2}', text, re.IGNORECASE)
    if year_match:
         # Find 4 digits in the matched string
         digits = re.findall(r'\b(19\d{2}|20\d{2})\b', year_match.group(0))
         if digits:
             metadata["year"] = int(digits[-1])
    else:
        year_match = re.search(r'CITATION:\s*(19\d{2}|20\d{2})', text, re.IGNORECASE)
        if year_match:
             metadata["year"] = int(year_match.group(1))
             
    # Extract Title (BETWEEN: <Plaintiff> ... AND ... <Defendant>)
    plaintiff_match = re.search(r'BETWEEN:\s*(.+?)\s+(?:APPELLANT|PETITIONER)', text, re.IGNORECASE | re.DOTALL)
    defendant_match = re.search(r'AND\s*(.+?)\s+RESPONDENT', text, re.IGNORECASE | re.DOTALL)
    
    if plaintiff_match and defendant_match:
        p = plaintiff_match.group(1).strip()
        d = defendant_match.group(1).strip()
        metadata["title"] = f"{p} vs {d}"
        
    # Extract Section references (Look for "Section \d+" "Act")
    # Finding Section 73 of the Indian Contract Act
    sections = set(re.findall(r'Section\s+\d+\s+of\s+the\s+[A-Za-z\s]+Act', text, re.IGNORECASE))
    if sections:
        metadata["section_references"] = ", ".join(sections)
        
    return metadata

def main():
    print(f"Extracting metadata from {CLEANED_CASES_DIR}...")
    session = SessionLocal()
    
    if not os.path.exists(CLEANED_CASES_DIR):
        print(f"Error: {CLEANED_CASES_DIR} does not exist.")
        return
        
    for filename in os.listdir(CLEANED_CASES_DIR):
        if not filename.endswith('.txt'):
            continue
            
        filepath = os.path.join(CLEANED_CASES_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        extracted = extract_metadata(content, filename)
        
        # Insert or update in database
        existing = session.query(CaseMetadata).filter_by(source_file=filename).first()
        if existing:
            existing.title = extracted["title"]
            existing.court = extracted["court"]
            existing.year = extracted["year"]
            existing.section_references = extracted["section_references"]
        else:
            new_case = CaseMetadata(**extracted)
            session.add(new_case)
            
    session.commit()
    print("Finished extracting metadata and stored to database.")
    
if __name__ == "__main__":
    main()
