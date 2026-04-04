-- Insert basic assets to fix 400 errors
-- Run this with: psql "postgresql://postgres.lvvnkamimetwfbhqiydb:PwxHOEym25rrruTw@aws-0-eu-west-1.pooler.supabase.com:6543/postgres" < insert-basic-assets.sql

INSERT INTO assets (key, kind, url, mime, "createdAt", "updatedAt") VALUES
('videoBg.yahya_room', 'video', '/generated-assets/video-bg/yehya-office-vid.mp4', 'video/mp4', NOW(), NOW()),
('videoBg.sinai_desert', 'video', '/generated-assets/video-bg/desert.mp4', 'video/mp4', NOW(), NOW()),
('videoBg.andalusia', 'video', '/generated-assets/video-bg/andalus.mp4', 'video/mp4', NOW(), NOW()),
('videoBg.karbala', 'video', '/generated-assets/video-bg/karblaa.mp4', 'video/mp4', NOW(), NOW()),
('character.narrator', 'character', '/generated-assets/characters/narrator.png', 'image/png', NOW(), NOW()),
('character.yahya', 'character', '/generated-assets/characters/yahya.png', 'image/png', NOW(), NOW()),
('character.laila', 'character', '/generated-assets/characters/laila.png', 'image/png', NOW(), NOW()),
('audio.main_theme', 'audio', '/generated-assets/music-tracks/TRACK-01.mp3', 'audio/mpeg', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET
  kind = EXCLUDED.kind,
  url = EXCLUDED.url,
  mime = EXCLUDED.mime,
  "updatedAt" = NOW();
