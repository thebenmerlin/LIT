import os
import re

# Directories
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
RAW_CASES_DIR = os.path.join(BASE_DIR, 'data', 'raw_cases')
CLEANED_CASES_DIR = os.path.join(BASE_DIR, 'data', 'cleaned_cases')

os.makedirs(CLEANED_CASES_DIR, exist_ok=True)

def clean_text(text: str) -> str:
    # 1. Normalize encoding issues (assuming basic utf-8 errors handles it, but we replace common bad chars)
    # 2. Remove excessive whitespace
    text = re.sub(r' +', ' ', text)  # multiple spaces to single
    # 3. Remove formatting artifacts like row of hyphens or asterisks
    text = re.sub(r'-{3,}', '', text)
    text = re.sub(r'\*{3,}.*\*{3,}', '', text) # remove *** END OF DOCUMENT ***
    # Remove dots used for padding
    text = re.sub(r'\.{3,}', '', text)
    
    # Optional: strip leading/trailing whitespace per line
    lines = [line.strip() for line in text.split('\n')]
    # Remove excessive blank lines
    cleaned_lines = []
    blank_count = 0
    for line in lines:
        if not line:
            blank_count += 1
            if blank_count <= 1:
                cleaned_lines.append(line)
        else:
            blank_count = 0
            cleaned_lines.append(line)
            
    return '\n'.join(cleaned_lines).strip()

def main():
    print(f"Cleaning cases from {RAW_CASES_DIR}...")
    
    if not os.path.exists(RAW_CASES_DIR):
        print(f"Error: {RAW_CASES_DIR} does not exist.")
        return
        
    for filename in os.listdir(RAW_CASES_DIR):
        if not filename.endswith('.txt'):
            continue
            
        raw_filepath = os.path.join(RAW_CASES_DIR, filename)
        cleaned_filepath = os.path.join(CLEANED_CASES_DIR, filename)
        
        with open(raw_filepath, 'r', encoding='utf-8') as f:
            raw_content = f.read()
            
        cleaned_content = clean_text(raw_content)
        
        with open(cleaned_filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
            
    print(f"Finished cleaning cases. Saved to {CLEANED_CASES_DIR}.")

if __name__ == "__main__":
    main()
