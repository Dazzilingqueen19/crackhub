import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def log_code_execution(language, code, test_cases, results=None, error=None):
    """Log code execution attempts and results."""
    logger.info(f"Code execution attempt - Language: {language}")
    logger.info(f"Test cases: {json.dumps(test_cases)}")
    if error:
        logger.error(f"Execution failed: {error}")
    if results:
        logger.info(f"Execution results: {json.dumps(results)}")

def validate_test_cases(test_cases):
    """Validate test case format."""
    if not isinstance(test_cases, list):
        raise ValueError("Test cases must be a list")
        
    for test_case in test_cases:
        if not isinstance(test_case, dict):
            raise ValueError("Each test case must be a dictionary")
        if 'input' not in test_case or 'output' not in test_case:
            raise ValueError("Test cases must contain 'input' and 'output' keys")
            
def create_wrapper_code(language, code):
    """Create language-specific wrapper code."""
    if language == 'python':
        return f'''
try:
    {code}
except Exception as e:
    import sys
    print(f"Runtime Error: {{str(e)}}", file=sys.stderr)
'''
    elif language == 'javascript':
        return f'''
try {{
    {code}
}} catch (e) {{
    console.error(`Runtime Error: ${{e.message}}`);
}}
'''
    elif language == 'java':
        # Java wrapper is more complex, handled in run_java_code
        return code
    else:
        raise ValueError(f"Unsupported language: {language}")

def sanitize_code(code, language):
    """Basic code sanitization."""
    # List of forbidden operations
    forbidden = {
        'python': ['os.system', 'subprocess', '__import__', 'eval', 'exec'],
        'javascript': ['require', 'process.', 'child_process'],
        'java': ['Runtime.getRuntime()', 'ProcessBuilder', 'System.exit']
    }
    
    for term in forbidden.get(language, []):
        if term in code:
            raise ValueError(f"Forbidden operation detected: {term}")
            
    return code