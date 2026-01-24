import os
import argparse
import subprocess
import sys
import json
import time
from pathlib import Path

# Debug


def run_step(description, command):
    print(f"\n   ⚙️  [STEP] {description}...", flush=True)
    try:
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Error during {description}: {e}", flush=True)
        return False
    return True

def main():
    parser = argparse.ArgumentParser(description='K-Spirits Data Pipeline (Batch Stream)')
    parser.add_argument('--source', required=True, help='Source Raw JSON file path')
    parser.add_argument('--batch-size', type=int, default=10, help='Items per batch')
    parser.add_argument('--limit', type=int, default=100, help='Max items to process in this run (default: 100)')
    parser.add_argument('--skip-upload', action='store_true', help='Skip upload step and save locally (for quota limits)')
    args = parser.parse_args()

    base_dir = Path(__file__).parent.parent
    scripts_dir = base_dir / 'scripts'
    data_dir = base_dir / 'data'
    
    source_path = Path(args.source)
    if not source_path.exists():
        print(f"❌ Source file not found: {source_path}")
        return

    # Temp files for processing
    temp_dir = data_dir / 'temp_pipeline'
    temp_dir.mkdir(exist_ok=True)

    # Local Processed Storage (for offline mode)
    processed_dir = data_dir / 'processed_batches'
    processed_dir.mkdir(exist_ok=True)
    
    # State File for Resume Capability
    state_file = temp_dir / 'pipeline_state.json'
    start_index = 0
    
    if state_file.exists():
        try:
            with open(state_file, 'r', encoding='utf-8') as f:
                state = json.load(f)
                if state.get('source_file') == str(source_path):
                    start_index = state.get('next_index', 0)
                    print(f"RESUME: Found previous state. Resuming from index {start_index}...")
        except Exception as e:
            print(f"⚠️ Failed to load state file: {e}")

    f_input = temp_dir / 'batch_input.json'
    f_enriched = temp_dir / 'batch_enriched.json'
    f_ready = temp_dir / 'batch_ready.json'

    # Load Full Data
    with open(source_path, 'r', encoding='utf-8') as f:
        full_data = json.load(f)
    
    total_items = len(full_data)
    
    if start_index >= total_items:
        print("✅ All items in this file have been processed!")
        return

    # Calculate End Index for this run
    end_run_index = min(start_index + args.limit, total_items)
    
    print(f"\n🚀 Starting Batch Pipeline")
    print(f"   - File: {source_path.name}")
    print(f"   - Range: {start_index} to {end_run_index} (Limit: {args.limit})")
    print(f"   - Batch Size: {args.batch_size}")
    if args.skip_upload:
        print("   - MODE: 💾 OFFLINE (Local Save Only, No Upload)")
    print("")
    
    processed_in_this_run = 0

    # Process in chunks
    for i in range(start_index, end_run_index, args.batch_size):
        # Determine batch range
        batch_end = min(i + args.batch_size, end_run_index)
        batch = full_data[i : batch_end]
        
        current_range_str = f"{i+1}-{batch_end}"
        
        print(f"==================================================")
        print(f"🔄 Processing Batch {current_range_str} / {total_items}")
        print(f"==================================================")

        # 1. Write Batch Input
        with open(f_input, 'w', encoding='utf-8') as f:
            json.dump(batch, f, ensure_ascii=False)

        # 2. Enrich
        if not run_step("Enrichment (Gemini)", f'python "{scripts_dir / "enrich_with_gemini.py"}" --input "{f_input}" --output "{f_enriched}"'):
            print("⚠️ Skipping batch due to error.")
            continue

        # 3. Image Search
        if not run_step("Image Search (Google)", f'python "{scripts_dir / "fetch_images_advanced.py"}" --input "{f_enriched}" --output "{f_ready}"'):
             print("⚠️ Skipping batch due to error.")
             continue

        # 4. Upload OR Save Locally
        if args.skip_upload:
            # Save to permanent file
            safe_source_name = source_path.stem
            timestamp = int(time.time())
            save_path = processed_dir / f"batch_{safe_source_name}_{start_index}_{batch_end}_{timestamp}.json"
            
            # Copy ready file to save path
            with open(f_ready, 'r', encoding='utf-8') as fin, open(save_path, 'w', encoding='utf-8') as fout:
                fout.write(fin.read())
            
            print(f"💾 [OFFLINE] Saved batch to: {save_path.name}")
        else:
            if not run_step("Upload to Firestore", f'node "{scripts_dir / "migrate_to_firestore.js"}" --file "{f_ready}"'):
                 print("⚠️ Skipping batch due to error (Upload Failed). State NOT updated.")
                 continue
             
        processed_in_this_run += (batch_end - i)
        
        # Save State
        next_start_index = batch_end
        with open(state_file, 'w', encoding='utf-8') as f:
            json.dump({
                'source_file': str(source_path),
                'next_index': next_start_index,
                'last_updated': time.time()
            }, f, indent=2)
            
        print(f"✅ Batch {current_range_str} Completed (Next: {next_start_index}).\n")
        
        # Rate limit between batches (safety)
        if next_start_index < end_run_index:
            time.sleep(2)

    print(f"\n🎉 Run Finished! Processed {processed_in_this_run} items.")
    
    # Final Summary
    print("\n" + "="*50)
    print(" 📊 [SUMMARY] Batch Pipeline Orchestrator")
    print("-" * 50)
    print(f"  • Source File        : {source_path.name}")
    print(f"  • Mode               : {'💾 OFFLINE (Skip Upload)' if args.skip_upload else '🌐 ONLINE (Upload to DB)'}")
    print(f"  • Processed (Run)    : {processed_in_this_run}")
    print(f"  • Next Start Index   : {end_run_index if end_run_index < total_items else 'DONE'}")
    print(f"  • Total Progress     : {min(end_run_index, total_items)} / {total_items} ({int(min(end_run_index, total_items)/total_items*100)}%)")
    print("=" * 50 + "\n")

    if end_run_index < total_items:
        print(f"👉 Next run will resume from index {end_run_index}. Run the script again to continue.")
    else:
        print("✨ File completely processed.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Pipeline Stopped by User.")
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {e}")
        import traceback
        traceback.print_exc()
