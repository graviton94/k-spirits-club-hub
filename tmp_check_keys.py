
import json
import os

with open('data/processed_batches/batch_imported_과실주_0_20_1769337806.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    if data:
        print(f"Keys: {list(data[0].keys())}")
        print(f"Metadata Keys: {list(data[0].get('metadata', {}).keys())}")
