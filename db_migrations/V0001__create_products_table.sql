
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  price       NUMERIC(12,2) NOT NULL,
  category    TEXT NOT NULL,
  game        TEXT NOT NULL,
  seller      TEXT NOT NULL,
  image       TEXT DEFAULT '',
  images      JSONB DEFAULT '[]',
  video_url   TEXT DEFAULT '',
  views       INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
