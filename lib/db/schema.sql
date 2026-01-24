-- Spirits Table (Main)
CREATE TABLE IF NOT EXISTS spirits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  distillery TEXT NOT NULL,
  bottler TEXT,
  abv REAL,
  volume REAL,
  category TEXT NOT NULL,
  subcategory TEXT,
  country TEXT NOT NULL,
  region TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  
  -- Data source tracking
  source TEXT,
  external_id TEXT,
  
  -- Publish Status
  status TEXT DEFAULT 'RAW', -- RAW, ENRICHED, PUBLISHED, ERROR
  is_published BOOLEAN DEFAULT 0,
  is_reviewed BOOLEAN DEFAULT 0,
  reviewed_by TEXT,
  reviewed_at TEXT, -- ISO8601 String
  
  -- Metadata (Stored as JSON for flexibility)
  metadata TEXT, -- JSON string
  
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_spirits_status ON spirits(status);
CREATE INDEX IF NOT EXISTS idx_spirits_category ON spirits(category);
CREATE INDEX IF NOT EXISTS idx_spirits_subcategory ON spirits(subcategory);
CREATE INDEX IF NOT EXISTS idx_spirits_is_published ON spirits(is_published);
