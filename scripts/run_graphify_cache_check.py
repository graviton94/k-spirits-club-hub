import json
import sys
from graphify.cache import check_semantic_cache
from pathlib import Path

def run_cache_check():
    try:
        detect_path = Path('graphify-out/.graphify_detect.json')
        try:
            with open(detect_path, 'r', encoding='utf-16') as f:
                detect = json.load(f)
        except Exception:
            with open(detect_path, 'r', encoding='utf-8') as f:
                detect = json.load(f)

        all_files = [f for files in detect['files'].values() for f in files]
        
        # Only non-code files need semantic extraction (Step 3B Rule)
        non_code_files = []
        code_exts = {'.py','.ts','.js','.jsx','.tsx','.mjs','.go','.rs','.java','.c','.cpp','.rb','.cs','.kt','.scala','.php','.swift','.lua','.zig','.ps1','.ex','.exs','.m','.mm','.jl','.vue','.svelte'}
        for f in all_files:
            if Path(f).suffix.lower() not in code_exts:
                non_code_files.append(f)

        if not non_code_files:
            print("No non-code files found. Skipping semantic pass.")
            Path('graphify-out/.graphify_uncached.txt').write_text('')
            return

        cached_nodes, cached_edges, cached_hyperedges, uncached = check_semantic_cache(non_code_files)
        
        if cached_nodes or cached_edges or cached_hyperedges:
            Path('graphify-out/.graphify_cached.json').write_text(json.dumps({
                'nodes': cached_nodes, 
                'edges': cached_edges, 
                'hyperedges': cached_hyperedges
            }))
            
        Path('graphify-out/.graphify_uncached.txt').write_text('\n'.join(uncached))
        print(f"Cache: {len(non_code_files)-len(uncached)} files hit, {len(uncached)} files need extraction")
        
    except Exception as e:
        print(f"Error checking cache: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_cache_check()
