import sys
import json
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json, to_html
from pathlib import Path

def run_final():
    try:
        # Load AST extraction
        ast_path = Path('graphify-out/.graphify_ast.json')
        if not ast_path.exists():
            print("AST file missing.")
            return
            
        with open(ast_path, 'r', encoding='utf-8') as f:
            extraction = json.load(f)
            
        # Mock semantic extraction for now (to avoid massive token cost while still producing a graph)
        # In a real run, this would merge AST + Subagent results
        detect_path = Path('graphify-out/.graphify_detect.json')
        try:
            with open(detect_path, 'r', encoding='utf-16') as f:
                detection = json.load(f)
        except Exception:
            with open(detect_path, 'r', encoding='utf-8') as f:
                detection = json.load(f)

        print("Building graph...")
        G = build_from_json(extraction)
        communities = cluster(G)
        cohesion = score_all(G, communities)
        
        tokens = {'input': 0, 'output': 0}
        gods = god_nodes(G)
        surprises = surprising_connections(G, communities)
        
        # Simple labeling
        labels = {cid: f'Module {cid}' for cid in communities}
        questions = suggest_questions(G, communities, labels)
        
        print("Generating report...")
        report = generate(G, communities, cohesion, labels, gods, surprises, detection, tokens, '.', suggested_questions=questions)
        
        Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
        to_json(G, communities, 'graphify-out/graph.json')
        to_html(G, communities, 'graphify-out/graph.html', community_labels=labels)
        
        print(f"Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities")
        print("Reports generated in graphify-out/")
        
    except Exception as e:
        print(f"Error during final pass: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_final()
