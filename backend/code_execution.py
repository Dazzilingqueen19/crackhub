import subprocess
import tempfile
import os
import json
import uuid
import logging
from flask import jsonify, request
from code_execution_utils import (
    log_code_execution,
    validate_test_cases,
    create_wrapper_code,
    sanitize_code,
    logger
)

from code_execution_utils import (
    log_code_execution,
    validate_test_cases,
    create_wrapper_code,
    sanitize_code,
    logger
)

def init_code_execution_api(app):
    @app.route('/api/execute_code', methods=['POST'])
    def execute_code():
        """Execute code in a sandboxed environment and return results."""
        try:
            # Log headers and raw body to help diagnose client/server mismatches
            raw = request.get_data(as_text=True)
            logger.info(f"Execute /api/execute_code headers: {dict(request.headers)}")
            logger.info(f"Execute /api/execute_code raw body: {raw}")

            # Prefer the safe JSON parser; fall back to parsing raw body if Content-Type
            # was omitted or incorrect on the client side.
            data = request.get_json(silent=True)
            if data is None:
                try:
                    data = json.loads(raw) if raw else {}
                except Exception:
                    data = {}

            if not data:
                # Return a clearer error with a hint so frontend can be adjusted.
                return jsonify({'success': False, 'error': 'No JSON payload received or invalid JSON'}), 400

            # Validate required fields
            required_fields = ['code', 'language', 'testCases']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({
                    'success': False,
                    'error': f'Missing required fields: {", ".join(missing_fields)}',
                    'hint': 'Payload keys must be code, language, testCases (case-sensitive) and JSON body.'
                }), 400
                
            code = data['code']
            language = data['language'].lower()
            test_cases = data['testCases']
            
            # Validate test cases format
            try:
                validate_test_cases(test_cases)
            except ValueError as e:
                return jsonify({'success': False, 'error': str(e)}), 400

            # Sanitize and wrap code
            try:
                code = sanitize_code(code, language)
                code = create_wrapper_code(language, code)
            except ValueError as e:
                return jsonify({'success': False, 'error': str(e)}), 400
                
            # Execute code and log results
            try:
                results = run_code_with_test_cases(code, language, test_cases)
                log_code_execution(language, code, test_cases, results=results)
                return jsonify({
                    'success': True,
                    'results': results
                })
            except Exception as e:
                error_msg = str(e)
                log_code_execution(language, code, test_cases, error=error_msg)
                return jsonify({
                    'success': False,
                    'error': error_msg
                }), 500
                
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'Internal server error'
            }), 500
        
        return jsonify({
            'success': False,
            'error': 'Unknown error occurred'
        }), 500
        
        try:
            results = run_code_with_test_cases(code, language, test_cases)
            return jsonify({
                'success': True,
                'results': results
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500

def run_code_with_test_cases(code, language, test_cases):
    """Run code against test cases in appropriate environment."""
    results = []
    
    # Create a temporary directory for code execution
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = None
        
        try:
            if language == 'python':
                file_path = os.path.join(tmpdir, 'solution.py')
                results = run_python_code(code, test_cases, file_path)
            elif language == 'javascript':
                file_path = os.path.join(tmpdir, 'solution.js')
                results = run_javascript_code(code, test_cases, file_path)
            elif language == 'java':
                file_path = os.path.join(tmpdir, 'Solution.java')
                results = run_java_code(code, test_cases, file_path)
            else:
                raise ValueError(f'Unsupported language: {language}')
                
        except Exception as e:
            raise Exception(f'Code execution failed: {str(e)}')
            
    return results

def run_python_code(code, test_cases, file_path):
    """Execute Python code with test cases."""
    results = []
    
    # Write the code to a temporary file
    with open(file_path, 'w') as f:
        f.write(code)
        
    for test_case in test_cases:
        input_data = test_case.get('input', '')
        expected_output = test_case.get('output', '')
        
        try:
            # Run the code with test input
            process = subprocess.run(
                ['python', file_path],
                input=str(input_data).encode(),
                capture_output=True,
                timeout=5
            )
            
            output = process.stdout.decode().strip()
            error = process.stderr.decode().strip()
            
            results.append({
                'passed': output == str(expected_output).strip(),
                'input': input_data,
                'expected': expected_output,
                'actual': output,
                'error': error if error else None
            })
            
        except subprocess.TimeoutExpired:
            results.append({
                'passed': False,
                'input': input_data,
                'error': 'Code execution timed out'
            })
        except Exception as e:
            results.append({
                'passed': False,
                'input': input_data,
                'error': str(e)
            })
            
    return results

def run_javascript_code(code, test_cases, file_path):
    """Execute JavaScript code with test cases."""
    results = []
    
    # Write the code to a temporary file
    with open(file_path, 'w') as f:
        f.write(code)
        
    for test_case in test_cases:
        input_data = test_case.get('input', '')
        expected_output = test_case.get('output', '')
        
        try:
            # Run the code with test input
            process = subprocess.run(
                ['node', file_path],
                input=str(input_data).encode(),
                capture_output=True,
                timeout=5
            )
            
            output = process.stdout.decode().strip()
            error = process.stderr.decode().strip()
            
            results.append({
                'passed': output == str(expected_output).strip(),
                'input': input_data,
                'expected': expected_output,
                'actual': output,
                'error': error if error else None
            })
            
        except subprocess.TimeoutExpired:
            results.append({
                'passed': False,
                'input': input_data,
                'error': 'Code execution timed out'
            })
        except Exception as e:
            results.append({
                'passed': False,
                'input': input_data,
                'error': str(e)
            })
            
    return results

def run_java_code(code, test_cases, file_path):
    """Execute Java code with test cases."""
    results = []
    
    # Write the code to a temporary file
    with open(file_path, 'w') as f:
        f.write(code)
        
    # Compile Java code
    try:
        compile_process = subprocess.run(
            ['javac', file_path],
            capture_output=True,
            timeout=10
        )
        
        if compile_process.returncode != 0:
            return [{
                'passed': False,
                'error': f'Compilation error: {compile_process.stderr.decode()}'
            }]
            
    except Exception as e:
        return [{
            'passed': False,
            'error': f'Compilation failed: {str(e)}'
        }]
    
    # Run compiled code with test cases
    for test_case in test_cases:
        input_data = test_case.get('input', '')
        expected_output = test_case.get('output', '')
        
        try:
            # Run the code with test input
            process = subprocess.run(
                ['java', '-cp', os.path.dirname(file_path), 'Solution'],
                input=str(input_data).encode(),
                capture_output=True,
                timeout=5
            )
            
            output = process.stdout.decode().strip()
            error = process.stderr.decode().strip()
            
            results.append({
                'passed': output == str(expected_output).strip(),
                'input': input_data,
                'expected': expected_output,
                'actual': output,
                'error': error if error else None
            })
            
        except subprocess.TimeoutExpired:
            results.append({
                'passed': False,
                'input': input_data,
                'error': 'Code execution timed out'
            })
        except Exception as e:
            results.append({
                'passed': False,
                'input': input_data,
                'error': str(e)
            })
            
    return results