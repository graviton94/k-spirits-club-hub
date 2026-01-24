
try:
    with open('.env', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(f"Total lines: {len(lines)}")
        for i, line in enumerate(lines):
            if i >= 13 and i <= 22:  # Print lines 14-23 (0-indexed 13-22)
                print(f"Line {i+1}: {repr(line)}")
except Exception as e:
    print(f"Error: {e}")
