import subprocess
import sys
import os

python_exe = sys.executable
script_path = "scripts/run_pipeline.py"

# Fix encoding for Windows console
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

tasks = [
    {"source": "data/raw_imported/imported_위스키.json", "name": "Whisky"},
    {"source": "data/raw_imported/imported_과실주.json", "name": "Fruit Wine"},
    # For Soju and General Spirits, check which file exists as per previous logic
    # Assuming user meant raw_imported based on filename pattern seen in directory list
    {"source": "data/raw_imported/imported_소주.json", "name": "Soju"}, 
    {"source": "data/raw_imported/imported_일반증류주.json", "name": "General Spirits"}
]

# Override for specific 'spirits_' files if they exist and were requested, 
# but based on directory listing `spirits_소주.json` exists in `data/`.
# However, pipeline usually runs on RAW data to produce SPIRITS data.
# The user said "spirits_소주", which exists in data/. 
# Let's check existence physically in the loop.

print("🚀 Starting Sequential Pipeline Run (Python Orchestrator)...")

for task in tasks:
    source = task["source"]
    
    # Special handling for Soju/General if user meant the processed ones in data/
    # The user said "spirits_소주". Let's check if that exists and prefer it if the raw one is what we mapped default.
    # Actually, let's map exactly what user might have meant or fallback.
    if task["name"] == "Soju":
        if os.path.exists("data/spirits_소주.json"):
            source = "data/spirits_소주.json"
        elif os.path.exists("data/raw_imported/imported_소주.json"):
             source = "data/raw_imported/imported_소주.json"
             
    if task["name"] == "General Spirits":
        if os.path.exists("data/spirits_일반증류주.json"):
            source = "data/spirits_일반증류주.json"
        elif os.path.exists("data/raw_imported/imported_일반증류주.json"):
             source = "data/raw_imported/imported_일반증류주.json"

    print(f"\n👉 Processing {task['name']} (Source: {source})...")
    
    if not os.path.exists(source):
        print(f"❌ Source file not found: {source}")
        continue

    cmd = [python_exe, script_path, "--source", source, "--limit", "100"]
    
    try:
        # Check output is visible
        ret = subprocess.call(cmd)
        if ret != 0:
            print(f"⚠️ Task {task['name']} finished with error code {ret}")
        else:
            print(f"✅ Task {task['name']} Completed.")
    except Exception as e:
        print(f"❌ Execution failed: {e}")

print("\n🎉 Sequence Completed.")
