import sys
import json
from graphify.extract import extract
from pathlib import Path

def run_ast():
    try:
        # Read detection result (handling UTF-16LE from PowerShell)
        detect_path = Path('graphify-out/.graphify_detect.json')
        try:
            with open(detect_path, 'r', encoding='utf-16') as f:
                d = json.load(f)
        except Exception:
            with open(detect_path, 'r', encoding='utf-8') as f:
                d = json.load(f)

        code_files = [Path(f) for f in d.get('files', {}).get('code', [])]
        
        if not code_files:
            print("No code files found.")
            return

        print(f"Extracting AST from {len(code_files)} files...")
        result = extract(code_files)
        
        output_path = Path('graphify-out/.graphify_ast.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2)
            
        print(f"AST: {len(result['nodes'])} nodes, {len(result['edges'])} edges")
        
    except Exception as e:
        print(f"Error during AST extraction: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_ast()
