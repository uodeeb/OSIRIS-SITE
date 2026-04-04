-- CHARACTER ASSETS FIX - Complete character asset seeding
-- This script fixes the character loading issues by:
-- 1. Adding all missing character assets with correct file paths
-- 2. Mapping character keys to actual file names
-- 3. Ensuring proper MIME types

INSERT INTO assets (key, kind, url, mime, "createdAt", "updatedAt") VALUES
-- Narrator variants
('character.narrator', 'character', '/generated-assets/characters/الراوي الكوني-التجسيد البصري (Visual Representation).png', 'image/png', NOW(), NOW()),

-- Yahya variants  
('character.yahya', 'character', '/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpg', 'image/jpeg', NOW(), NOW()),
('character.yahya_breakdown', 'character', '/generated-assets/characters/يحيى الراشد-صورة الانهيار (Breakdown Scene).jpg', 'image/jpeg', NOW(), NOW()),
('character.yahya_confront', 'character', '/generated-assets/characters/يحيى الراشد-صورة المواجهة (Confrontation Scene).jpg', 'image/jpeg', NOW(), NOW()),
('character.yahya_dying', 'character', '/generated-assets/characters/يحيى الراشد-صورة الأساسية (Portrait).jpg', 'image/jpeg', NOW(), NOW()),
('character.yahya_main', 'character', '/generated-assets/characters/يحيى الراشد-الصورة الأساسية (Portrait).jpg', 'image/jpeg', NOW(), NOW()),

-- Laila variants
('character.laila', 'character', '/generated-assets/characters/ليلى حسنالصورة الأساسية (Portrait).jpeg', 'image/jpeg', NOW(), NOW()),
('character.laila_faith', 'character', '/generated-assets/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpg', 'image/jpeg', NOW(), NOW()),
('character.laila_witness', 'character', '/generated-assets/characters/ليلى حسن-صورة الشاهدة (Witness Scene — Final Chapter).jpg', 'image/jpeg', NOW(), NOW()),
('character.laila_crying', 'character', '/generated-assets/characters/ليلى حسن-صورة الإيمان (Faith Portrait).jpg', 'image/jpeg', NOW(), NOW()),

-- Tarek variants
('character.tarek', 'character', '/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpg', 'image/jpeg', NOW(), NOW()),
('character.tarek_ghost', 'character', '/generated-assets/characters/طارق الراشد-صورة التسجيل (Recording — Ghost Image).jpg', 'image/jpeg', NOW(), NOW()),
('character.tarek_dream', 'character', '/generated-assets/characters/طارق الراشد-صورة الحلم (Dream Sequence).jpg', 'image/jpeg', NOW(), NOW()),

-- First Engineer variants
('character.first_engineer', 'character', '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg', 'image/jpeg', NOW(), NOW()),
('character.first_engineer_2', 'character', '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait)02.jpeg', 'image/jpeg', NOW(), NOW()),
('character.first_engineer_confront', 'character', '/generated-assets/characters/المهندس الأول-صورة المواجهة (Confrontation).jpeg', 'image/jpeg', NOW(), NOW()),
('character.first_engineer_exposed', 'character', '/generated-assets/characters/المهندس الأول-صورة الانكشاف (Exposed — Final Scene).jpeg', 'image/jpeg', NOW(), NOW()),

-- Religious/Historical figures
('character.arius', 'character', '/generated-assets/characters/آريوس.jpeg', 'image/jpeg', NOW(), NOW()),
('character.athanasius', 'character', '/generated-assets/characters/أثناسيوس.jpeg', 'image/jpeg', NOW(), NOW()),
('character.samiri', 'character', '/generated-assets/characters/السامري-الصورة الأساسية (Portrait).jpeg', 'image/jpeg', NOW(), NOW()),
('character.samiri_calf', 'character', '/generated-assets/characters/السامري-اصورة صناعة العجل (The Golden Calf Scene).png', 'image/png', NOW(), NOW()),
('character.constantine', 'character', '/generated-assets/characters/قسطنطين-الصورة الأساسية (Portrait).jpg', 'image/jpeg', NOW(), NOW()),
('character.ramses', 'character', '/generated-assets/characters/RAMSIS.jpg', 'image/jpeg', NOW(), NOW()),

-- Other characters
('character.abu_abdullah', 'character', '/generated-assets/characters/طارق الراشد-الصورة الأساسية (Portrait).jpg', 'image/jpeg', NOW(), NOW()),
('character.dictator', 'character', '/generated-assets/characters/المهندس الأول-الصورة الأساسية (Portrait).jpeg', 'image/jpeg', NOW(), NOW())

ON CONFLICT (key) DO UPDATE SET
  url = EXCLUDED.url,
  mime = EXCLUDED.mime,
  "updatedAt" = NOW();
