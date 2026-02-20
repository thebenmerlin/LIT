import os
import random

# Base directories
RAW_CASES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'raw_cases')

# Ensure directory exists
os.makedirs(RAW_CASES_DIR, exist_ok=True)

# Sample data for synthetic cases
courts = ["Supreme Court of India", "High Court of Delhi", "High Court of Bombay", "High Court of Madras", "High Court of Karnataka", "High Court of Calcutta"]
plaintiffs = ["M/s. ABC Industries Ltd.", "Ramakrishna & Sons", "XYZ Logistics Pvt. Ltd.", "Global Trade Corp", "Sunrise Enterprises", "Dynamic Builders"]
defendants = ["Union of India", "State of Maharashtra", "PQR Transports", "LMN Infrastructures Ltd.", "City Municipal Corporation", "Omega Supplies"]
years = list(range(1995, 2024))
outcomes = ["dismissed", "allowed", "partly allowed", "remanded"]

def generate_case_content(case_id):
    court = random.choice(courts)
    plaintiff = random.choice(plaintiffs)
    defendant = random.choice(defendants)
    year = random.choice(years)
    outcome = random.choice(outcomes)
    
    # Introduce some formatting artifacts to simulate raw OCR text
    content = f"""IN THE {court.upper()}
    
CITATION: {year} {court[:4].upper()} {random.randint(100, 999)}
    
                                  CASE NO: {random.randint(1000, 9999)} OF {year}
                                  
BETWEEN:
{plaintiff} .............................. APPELLANT / PETITIONER
AND
{defendant} ............................ RESPONDENT

DATE OF JUDGMENT: {random.randint(1,28)}/{random.randint(1,12)}/{year}

JUDGMENT
----------

1. This appeal is directed against the judgment of the lower court arising out of a dispute over a commercial contract.
2. The core issue revolves around the claim for unliquidated damages under Section 73 of the Indian Contract Act, 1872. The appellant contends that due to the respondent's failure to deliver the goods on time, they suffered a loss of profit.
3.   It is a well-settled principle of law that under Section 73 of the Indian Contract Act, compensation is not to be given for any remote and indirect loss or damage sustained by reason of the breach.  
4. The respondent argued that the damages claimed are speculative and not in the contemplation of the parties at the time of forming the contract. Reference was made to the landmark case of Hadley v. Baxendale.
5. Upon examining the evidence on record, we find that the breach was indeed committed by the respondent. However, the appellant has failed to adduce sufficient evidence to prove the exact quantum of damages naturally arising in the usual course of things from such breach.
6. Therefore, nominal damages are awarded. The appeal is {outcome}.

No costs.

*** END OF DOCUMENT ***
"""
    return content

def main():
    print(f"Generating 20 mock cases in {RAW_CASES_DIR}...")
    for i in range(1, 21):
        filename = f"case_judgment_{str(i).zfill(3)}.txt"
        filepath = os.path.join(RAW_CASES_DIR, filename)
        content = generate_case_content(i)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print("Completed mock case generation.")

if __name__ == "__main__":
    main()
