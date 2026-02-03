
# 🛠️ The Great Migration Plan: Spirit Data Schema Overhaul
**Date:** 2026-02-04
**Objective:** Optimize data structure for performance (List View vs Detail View) and eliminate redundancy.

---

## 1. Schema Definition (New Standard)

### ✅ ROOT FIELDS (Optimization for List/Search)
These fields are stored at the **top-level** of the document for immediate access, indexing, and filtering.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique ID (e.g., `fsk-2024...`) |
| `name` | string | Product Name (Korean) |
| `name_en` | string | Product Name (English) |
| `category` | string | Standard Category (e.g., `takju`) |
| `subcategory`| string | Detailed Category |
| `abv` | number | Alcohol Strength |
| `volume` | number | Bottle Volume (ml) |
| `distillery` | string | Manufacturer |
| `country` | string | Origin Country |
| `region` | string | Origin Region |
| `imageUrl` | string | Main Image URL |
| `thumbnail` | string | Optimized Thumbnail URL |
| `status` | enum | `PUBLISHED`, `RAFT`, etc. |
| **`nose_tags`** | array | **[MOVED]** Key Aroma Tags (for Filtering) |
| **`palate_tags`**| array | **[MOVED]** Key Taste Tags (for Filtering) |
| **`finish_tags`**| array | **[MOVED]** Key Finish Tags (for Filtering) |
| **`tasting_note`**| string | **[MOVED]** One-line summary hashtags |
| `searchKeywords`| array | **[OPTIMIZED]** 2-gram+ keywords only |

### 📦 METADATA FIELDS (Heavy Content for Detail View)
These fields are stored inside the `metadata` map. They are loaded only when necessary (or ignored by list queries).

| Field Name | Type | Description |
| :--- | :--- | :--- |
| **`description_ko`** | string | **[MOVED]** Full product description (KR) |
| **`description_en`** | string | **[MOVED]** Full product description (EN) |
| **`pairing_guide_ko`** | string | **[MOVED]** Detailed food pairing guide (KR) |
| **`pairing_guide_en`** | string | **[MOVED]** Detailed food pairing guide (EN) |
| `enriched_at` | timestamp | Last AI Processing Time |
| `auditDate` | timestamp | Data Audit/Import Time |
| `Raw Data` | mixed | Original source data (preserve for audit) |

---

## 2. Migration Strategy (Script Logic)

We will execute `scripts/enrich-all-cleanup.ts` to enforce this schema on all `PUBLISHED` documents.

### STEP A: AI Enrichment (Logic Upgrade)
- Apply **[Matrix Logic]**: Character-based Analysis -> Ingredient/Style Selection.
- Apply **[Cultural Variance]**: Random D2 Roll (Western vs Eastern).
- Eliminate "Lazy Tropes" (Scallops, Yuzu, Spring Rolls, etc.).

### STEP B: Data Relocation & Cleanup (The "Move")
For every processed document:

1.  **COPY TO ROOT:**
    - `name_en`
    - `nose_tags`, `palate_tags`, `finish_tags`
    - `tasting_note`
2.  **COPY TO METADATA:**
    - `description_ko`, `description_en`
    - `pairing_guide_ko`, `pairing_guide_en`
3.  **DELETE (Redundancy Cleanup):**
    - `root.description`, `root.description_ko`, `root.description_en` ❌
    - `root.pairing_guide_ko`, `root.pairing_guide_en` ❌
    - `metadata.name_en`, `metadata.tasting_note` ❌
    - `metadata.nose_tags`, `metadata.palate_tags`, `metadata.finish_tags` ❌

### STEP C: Search Optimization
- Regenerate `searchKeywords` using only 2-gram strategies (min length 2).
- Remove 1-letter keywords to save storage.

---

## 3. Required Frontend Changes (Post-Migration)

⚠️ **CRITICAL:** Once migration is effectively applied, Frontend components MUST be updated to read from the new locations.

- **`SpiritCard.tsx`**:
    - Read DNA tags from `spirit.nose_tags` (NOT `spirit.metadata.nose_tags`).
- **`FlavorView.tsx`**:
    - Read DNA tags from `spirit.nose_tags` (NOT `spirit.metadata.nose_tags`).
- **`SpiritDetailModal.tsx`**:
    - Read Description/Pairing from `spirit.metadata.description_ko` (NOT `spirit.description_ko`).
