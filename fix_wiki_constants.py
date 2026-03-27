import os
import re

wiki_dir = r'c:\k-spirits-club-hub\lib\constants\wiki'
files = [f for f in os.listdir(wiki_dir) if f.endswith('.ts') and f != 'types.ts']

for filename in files:
    path = os.path.join(wiki_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find dbCategories in sections or sectionsEn
    # Pattern: dbCategories: \[[^\]]*\]
    db_cats_matches = re.findall(r'dbCategories:\s*(\[[^\]]*\])', content)
    
    if not db_cats_matches:
        print(f"No dbCategories found in {filename}")
        continue

    # Take the first one found (they should be identical)
    db_cats_value = db_cats_matches[0]
    
    # Remove all instances of dbCategories: [...] within the object
    # We should be careful to only remove them followed by a newline or comma inside braces
    # But for these specific files, they are usually at the end of sections.
    new_content = re.sub(r',\s*dbCategories:\s*\[[^\]]*\]', '', content)
    new_content = re.sub(r'dbCategories:\s*\[[^\]]*\]\s*,?', '', new_content)

    # Insert it at the root of the export
    # Usually right after slug or before sections
    if 'slug:' in new_content:
        new_content = re.sub(r'(slug:\s*\'[^\']*\',)', rf'\1\n    dbCategories: {db_cats_value},', new_content, count=1)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Fixed {filename}")
