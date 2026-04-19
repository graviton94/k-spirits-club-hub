import os
import sys
import subprocess
from markitdown import MarkItDown

# Handle Windows console encoding issues for emojis
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# --- ⚙️ 설정 영역 ---
TARGET_REPO = r"C:\k-spirits-club-hub"
# GRAPHIFY_EXE 는 이제 sys.executable -m graphify 를 통해 실행되므로 제거되었습니다.
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")

# 무시할 디렉토리 및 파일 (점(.)으로 시작하는 폴더는 코드에서 자동 제외됨)
IGNORE_DIRS = {'node_modules', 'data', 'public', 'output', 'dist', 'build', 'out', '__pycache__'}
IGNORE_FILES = {'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'tsconfig.tsbuildinfo'}
ALLOWED_EXTENSIONS = ('.py', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.md', '.txt')

def get_graphify_context():
    print("[*] Graphify를 실행하여 지식 그래프를 업데이트합니다...")
    report_path = os.path.join(TARGET_REPO, "graphify-out", "GRAPH_REPORT.md")
    
    try:
        # 1. k-spirits-club-hub 폴더 내에서 graphify update 실행 (CLI에서 빌드를 수행하는 가장 확실한 방법)
        subprocess.run(
            [sys.executable, "-m", "graphify", "update", "."], 
            cwd=TARGET_REPO, 
            capture_output=True, # 에러가 나도 화면이 지저분해지지 않게 캡처
            text=True, 
            encoding='utf-8'
        )
        
        # 2. 실행 완료 후 graphify-out/GRAPH_REPORT.md 파일이 생성되었는지 확인
        if os.path.exists(report_path):
            with open(report_path, "r", encoding="utf-8") as f:
                content = f.read()
                print("    ✅ GRAPH_REPORT.md 파일을 성공적으로 읽어왔습니다.")
                return content
        else:
            # 파일이 없다면 stderr를 확인하여 실행 오류 파악
            return "Graphify 분석 결과가 없습니다. (graphify-out 폴더나 GRAPH_REPORT.md 파일이 생성되지 않았습니다.)"
            
    except Exception as e:
        return f"Graphify 실행 실패: {e}"

def collect_files_from_dir(directory_path, is_root_only=False):
    """특정 디렉토리 내의 코드를 수집합니다. (MarkItDown 연동)"""
    content = ""
    md = MarkItDown()
    
    # root_only가 True면 하위 폴더로 들어가지 않고 해당 폴더의 파일만 수집
    if is_root_only:
        items = []
        for item in os.listdir(directory_path):
            full_path = os.path.join(directory_path, item)
            if os.path.isfile(full_path):
                items.append((directory_path, [], [item]))
        walk_generator = items
    else:
        walk_generator = os.walk(directory_path)

    for root, dirs, files in walk_generator:
        if not is_root_only:
            # 하위 폴더 순회 시 제외할 폴더 필터링 (.폴더 및 IGNORE_DIRS)
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in IGNORE_DIRS]

        for file in files:
            if file in IGNORE_FILES:
                continue
            
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, TARGET_REPO)

            if file.endswith(ALLOWED_EXTENSIONS):
                # 100KB 초과 파일은 이름만 수집
                if os.path.getsize(file_path) > 100 * 1024:
                    content += f"### File: {rel_path}\n```\n[파일 용량 초과(100KB+)로 내용 생략됨]\n```\n\n"
                    continue

                try:
                    # 마크다운/텍스트는 MarkItDown으로 평탄화, 나머지는 코드 블록 처리
                    if file.endswith(('.md', '.txt')):
                        result = md.convert(file_path)
                        content += f"### File: {rel_path}\n{result.text_content}\n\n"
                    else:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            code = f.read()
                            content += f"### File: {rel_path}\n```\n{code}\n```\n\n"
                except Exception as e:
                    content += f"### File: {rel_path}\n[읽기/변환 실패: {e}]\n\n"
                    
    return content

def save_bundle(module_name, graph_data, content):
    if not content.strip():
        print(f"    ⚠️ '{module_name}' 모듈은 수집된 코드가 없어 생략합니다.")
        return

    output_file_path = os.path.join(OUTPUT_DIR, f"k_spirits_{module_name}.md")
    with open(output_file_path, "w", encoding="utf-8") as f:
        f.write(f"# [Project Context] k-spirits-club-hub - Module: {module_name}\n\n")
        f.write("## 1. Project Architecture (Graphify)\n")
        f.write(f"{graph_data}\n\n---\n\n")
        f.write("## 2. Source Code & Documents\n")
        f.write(f"{content}\n")

    size_mb = os.path.getsize(output_file_path) / (1024 * 1024)
    print(f"    ✅ 생성 완료: k_spirits_{module_name}.md (크기: {size_mb:.2f} MB)")

def compile_mega_prompt():
    print("=== 루트 폴더 자동 매핑 Context Compiler 시작 ===")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("[*] 공통 아키텍처(Graphify)를 수집 중 (한 번만 실행)...")
    graph_data = get_graphify_context()

    # 1. 최상위 디렉토리 스캔 및 유효한 폴더 필터링
    root_items = os.listdir(TARGET_REPO)
    target_folders = []
    
    for item in root_items:
        full_path = os.path.join(TARGET_REPO, item)
        if os.path.isdir(full_path):
            # .으로 시작하는 폴더와 명시적으로 무시할 폴더 제외
            if not item.startswith('.') and item not in IGNORE_DIRS:
                target_folders.append(item)

    print(f"\n[*] 대상 폴더 목록: {', '.join(target_folders)}")
    print("[*] 파일 생성을 시작합니다...\n")

    # 2. 루트 디렉토리의 단일 파일들 (package.json 등) 처리
    print("  - 'root_files' (루트 설정 파일들) 수집 중...")
    root_content = collect_files_from_dir(TARGET_REPO, is_root_only=True)
    save_bundle("root_files", graph_data, root_content)

    # 3. 대상 폴더들을 하나씩 순회하며 마크다운 파일 생성
    for folder in target_folders:
        print(f"  - '{folder}' 폴더 수집 중...")
        folder_path = os.path.join(TARGET_REPO, folder)
        folder_content = collect_files_from_dir(folder_path)
        save_bundle(folder, graph_data, folder_content)

    print("\n=== 모든 폴더 단위의 컨텍스트 번들 생성이 완료되었습니다! ===")

if __name__ == "__main__":
    compile_mega_prompt()