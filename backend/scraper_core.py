# backend/scraper_core.py
import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def scrape_amazon():
    urls = [
        "https://www.geeksforgeeks.org/amazon-interview-questions/",
        "https://www.geeksforgeeks.org/tag/amazon-interview-experience/",
        "https://www.geeksforgeeks.org/amazon-sde-1-interview-experience/",
        "https://leetcode.com/discuss/interview-question/488887/amazon-interview-questions-list"
    ]
    questions = extract_multiple_gfg(urls, "Amazon")
    # Fallback questions if scraping fails
    fallback = [
        "Implement LRU Cache",
        "Design a parking lot system",
        "Find the maximum subarray sum",
        "Implement a rate limiter",
        "Design Amazon's shopping cart system",
        "Implement thread-safe singleton pattern",
        "Design a notification service",
        "Implement merge k sorted lists",
        "Design a distributed cache",
        "Find median from data stream"
    ]
    questions.extend(fallback)
    return list(set(questions))


def scrape_tcs():
    urls = [
        "https://www.geeksforgeeks.org/tcs-interview-questions/",
        "https://www.geeksforgeeks.org/tag/tcs-interview-experience/",
        "https://www.geeksforgeeks.org/tcs-digital-interview-experience/",
        "https://www.geeksforgeeks.org/tcs-nqt-interview-experience/"
    ]
    questions = extract_multiple_gfg(urls, "TCS")
    # Fallback questions if scraping fails
    fallback = [
        "Write a program to find factorial of a number",
        "Implement a function to check if a string is palindrome",
        "Write a program to find the nth Fibonacci number",
        "Design a simple banking system with account operations",
        "Implement stack using arrays/linked list",
        "Write a program to find GCD of two numbers",
        "Implement binary search algorithm",
        "Write a program to reverse a linked list",
        "Implement queue using stacks",
        "Write a program to check if a number is prime"
    ]
    questions.extend(fallback)
    return list(set(questions))


def scrape_infosys():
    urls = [
        "https://www.geeksforgeeks.org/python/python-interview-questions/",
        "https://prepinsta.com/infosys-interview/",
        "https://www.glassdoor.co.in/Interview/Infosys-Interview-Questions-E7927.htm",
        "https://leetcode.com/discuss/interview-question/1978400/infosys-interview-questions"
    ]
    questions = extract_multiple_gfg(urls, "Infosys")
    # Fallback questions if scraping fails
    fallback = [
        "Implement a binary tree and its traversals",
        "Design a student management system",
        "Write a program to detect cycle in a linked list",
        "Implement sorting algorithms (bubble, quick, merge)",
        "Design a file management system",
        "Write a program to find all pairs with given sum",
        "Implement producer-consumer problem",
        "Design a library management system",
        "Write a program for matrix operations",
        "Implement a basic calculator"
    ]
    questions.extend(fallback)
    return list(set(questions))


def scrape_hexaware():
    urls = [
        "https://prepinsta.com/hexaware/technical-interview-questions/",
        "https://prepinsta.com/hexaware/coding/",
        "https://www.geeksforgeeks.org/hexaware-interview-experience/",
        "https://prepinsta.com/hexaware/graduate-engineer-trainee/interview-questions/"
    ]
    questions = extract_multiple_gfg(urls, "Hexaware")
    # Fallback questions if scraping fails
    fallback = [
        "Implement a REST API for user management",
        "Write a program to implement quicksort",
        "Design a caching mechanism",
        "Implement dependency injection container",
        "Write a program for binary search tree operations",
        "Design a message queue system",
        "Implement a thread pool",
        "Write a program for database connection pooling",
        "Design a logging system",
        "Implement a rate limiting mechanism"
    ]
    questions.extend(fallback)
    return list(set(questions))


# ---------------------------------------------------------------

def extract_multiple_gfg(urls, company):
    """Scrape from multiple URLs and merge questions."""
    all_questions = []
    for url in urls:
        print(f"🔍 Scraping {company} from {url}")
        qs = extract_gfg(url, company)
        all_questions.extend(qs)
    all_questions = list(set(all_questions))
    print(f"✅ {company}: {len(all_questions)} questions found\n")
    return all_questions


def extract_gfg(url, company):
    """Scrape one page and extract possible questions."""
    questions = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        # Extract from question tags and paragraphs
        for tag in soup.select("p, li, h2, h3"):
            text = tag.get_text(" ", strip=True)
            if not text:
                continue
            text_lower = text.lower()
            if any(k in text_lower for k in ["question", "round", "asked", "interview", "experience"]):
                if 20 < len(text) < 400:
                    questions.append(text)

    except Exception as e:
        print(f"⚠️ {company} scraping failed for {url}: {e}")

    return questions


def fetch_all_sources():
    """Fetch questions for all companies."""
    data = {
        "Amazon": scrape_amazon(),
        "TCS": scrape_tcs(),
        "Infosys": scrape_infosys(),
        "Hexaware": scrape_hexaware()
    }
    
    # Ensure each company has at least some questions by adding duplicates if needed
    for company, questions in data.items():
        if not questions:
            # If a company has no questions, copy some from other companies
            all_other_questions = []
            for other_company, other_questions in data.items():
                if other_company != company and other_questions:
                    all_other_questions.extend(other_questions)
            
            if all_other_questions:
                # Add 10 random questions from other companies
                import random
                data[company] = random.sample(all_other_questions, min(10, len(all_other_questions)))
    
    return data


def display_questions():
    """Display questions for all companies in a formatted way."""
    data = fetch_all_sources()
    
    for company, questions in data.items():
        print(f"\n{'='*80}")
        print(f"{company} Interview Questions ({len(questions)} questions)")
        print(f"{'='*80}")
        
        for i, q in enumerate(questions, 1):
            print(f"\n{i}. {q}")
