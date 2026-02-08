import json

with open('lib/constants/spirits-metadata.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

distilleries = data['distilleries']
print(f'Total distilleries: {len(distilleries)}')
print(f'\nFirst 30 examples:')
for i, d in enumerate(distilleries[:30]):
    print(f'{i+1:2d}. {d}')

print(f'\nLast 10 examples:')
for i, d in enumerate(distilleries[-10:], len(distilleries)-10):
    print(f'{i+1:4d}. {d}')

# Check for specific normalization examples
print(f'\nChecking normalization:')
ardmore_variants = [d for d in distilleries if 'ardmore' in d.lower()]
print(f'Ardmore variants: {ardmore_variants}')

print(f'\nDistilleries with "and":')
and_examples = [d for d in distilleries if ' and ' in d.lower()]
print(f'Found {len(and_examples)} examples with "and"')
if and_examples:
    for d in and_examples[:5]:
        print(f'  - {d}')
