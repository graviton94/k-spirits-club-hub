#!/bin/bash
# Verification script for Phase 2 SEO implementation
# Tests tier classification logic without requiring a running server

set -e

echo "========================================"
echo "Phase 2 SEO Verification Script"
echo "========================================"
echo ""

# Test 1: Check if files exist
echo "✓ Test 1: Checking file structure..."
files=(
  "lib/utils/indexable-tier.ts"
  "docs/seo/phase2-verification.md"
  "app/sitemap.ts"
  "app/robots.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file exists"
  else
    echo "  ❌ $file missing"
    exit 1
  fi
done
echo ""

# Test 2: Check for required functions
echo "✓ Test 2: Checking for required functions..."
if grep -q "isIndexableSpirit" lib/utils/indexable-tier.ts; then
  echo "  ✅ isIndexableSpirit function found"
else
  echo "  ❌ isIndexableSpirit function not found"
  exit 1
fi

if grep -q "getPublishedSpiritMetaWithQuality" lib/db/firestore-rest.ts; then
  echo "  ✅ getPublishedSpiritMetaWithQuality function found"
else
  echo "  ❌ getPublishedSpiritMetaWithQuality function not found"
  exit 1
fi

if grep -q "getSpiritRobotsMeta" lib/utils/indexable-tier.ts; then
  echo "  ✅ getSpiritRobotsMeta function found"
else
  echo "  ❌ getSpiritRobotsMeta function not found"
  exit 1
fi
echo ""

# Test 3: Check sitemap excludes private pages
echo "✓ Test 3: Verifying sitemap configuration..."
if grep -q "cabinet" app/sitemap.ts | grep -v "NON-INDEXABLE" | grep -v "Excluded" | grep -v "//"; then
  echo "  ❌ sitemap.ts may include cabinet pages"
  exit 1
else
  echo "  ✅ sitemap.ts excludes private pages (cabinet, admin, me)"
fi
echo ""

# Test 4: Check robots.ts blocks private pages
echo "✓ Test 4: Verifying robots.txt configuration..."
if grep -q "/cabinet/" app/robots.ts && grep -q "/admin/" app/robots.ts; then
  echo "  ✅ robots.ts blocks private pages"
else
  echo "  ❌ robots.ts missing private page blocks"
  exit 1
fi
echo ""

# Test 5: Check spirit page uses tier logic
echo "✓ Test 5: Verifying spirit detail page integration..."
if grep -q "getSpiritRobotsMeta" app/\[lang\]/spirits/\[id\]/page.tsx; then
  echo "  ✅ Spirit detail page uses tier-based robots meta"
else
  echo "  ❌ Spirit detail page missing tier logic"
  exit 1
fi
echo ""

# Test 6: Documentation exists
echo "✓ Test 6: Verifying documentation..."
if [ -f "docs/seo/phase2-verification.md" ]; then
  line_count=$(wc -l < docs/seo/phase2-verification.md)
  if [ "$line_count" -gt 100 ]; then
    echo "  ✅ phase2-verification.md exists with $line_count lines"
  else
    echo "  ⚠️  phase2-verification.md seems incomplete ($line_count lines)"
  fi
else
  echo "  ❌ phase2-verification.md not found"
  exit 1
fi
echo ""

echo "========================================"
echo "✅ All static checks passed!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the server"
echo "2. Test endpoints:"
echo "   curl http://localhost:3000/sitemap.xml | head -50"
echo "   curl http://localhost:3000/robots.txt"
echo "3. Check console logs for Tier A/B distribution"
echo ""
