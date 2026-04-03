/**
 * Scene Data Extraction Script
 * Extracts scene data from sceneSystem.ts into modular JSON files
 * 
 * Usage: node scripts/extract-scenes.js
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../client/src/lib/sceneSystem.ts');
const OUTPUT_DIR = path.join(__dirname, '../client/src/data/scenes');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read the source file
const source = fs.readFileSync(INPUT_FILE, 'utf-8');

// Extract interfaces for type reference
const interfacesMatch = source.match(/export interface\s+\w+\s*\{[^}]+\}/gs);
console.log('Found interfaces:', interfacesMatch ? interfacesMatch.length : 0);

// Find all PART_X constants
const partRegex = /const\s+PART_(\w+)\s*:\s*Record<string,\s*Scene>\s*=\s*\{/g;
const parts = [];
let match;

while ((match = partRegex.exec(source)) !== null) {
  parts.push({
    name: `PART_${match[1]}`,
    index: match.index,
    partKey: match[1].toLowerCase()
  });
}

console.log(`Found ${parts.length} narrative parts`);

// Extract each part's content
parts.forEach((part, index) => {
  const startIdx = part.index;
  const endIdx = index < parts.length - 1 ? parts[index + 1].index : source.indexOf('export const SCENES');
  
  let partContent = source.substring(startIdx, endIdx).trim();
  
  // Extract the part number from the comment
  const partNumberMatch = source.substring(Math.max(0, startIdx - 500), startIdx).match(/PART\s+(\w+)[^\n]*\n/);
  const partTitle = partNumberMatch ? partNumberMatch[1] : part.partKey;
  
  // Parse scenes from this part
  const scenes = parseScenes(partContent, part.partKey);
  
  // Create JSON structure
  const jsonData = {
    part: getPartNumber(part.partKey),
    title: {
      en: getPartTitleEn(part.partKey),
      ar: getPartTitleAr(part.partKey)
    },
    scenes: scenes
  };
  
  // Write JSON file
  const outputFile = path.join(OUTPUT_DIR, `part-${getPartNumber(part.partKey)}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(jsonData, null, 2), 'utf-8');
  
  console.log(`✓ Extracted ${Object.keys(scenes).length} scenes to ${path.basename(outputFile)}`);
});

console.log('\nScene extraction complete!');
console.log(`Output directory: ${OUTPUT_DIR}`);

// Helper functions
function parseScenes(content, partKey) {
  const scenes = {};
  
  // Find scene definitions: 'scene-id': {
  const sceneRegex = /['"]([\w-]+)['"]\s*:\s*\{/g;
  let sceneMatch;
  
  while ((sceneMatch = sceneRegex.exec(content)) !== null) {
    const sceneId = sceneMatch[1];
    const sceneStart = sceneMatch.index + sceneMatch[0].length;
    
    // Find the matching closing brace
    let braceCount = 1;
    let sceneEnd = sceneStart;
    
    while (braceCount > 0 && sceneEnd < content.length) {
      if (content[sceneEnd] === '{') braceCount++;
      if (content[sceneEnd] === '}') braceCount--;
      sceneEnd++;
    }
    
    const sceneContent = content.substring(sceneStart, sceneEnd - 1);
    const scene = parseSceneObject(sceneContent, sceneId);
    
    if (scene) {
      scenes[sceneId] = scene;
    }
  }
  
  return scenes;
}

function parseSceneObject(content, sceneId) {
  const scene = {
    id: sceneId,
    title: extractString(content, 'title'),
    arabicTitle: extractString(content, 'arabicTitle'),
    part: extractNumber(content, 'part'),
    backgroundVideo: extractString(content, 'backgroundVideo'),
    backgroundVideoAudioDescEn: extractString(content, 'backgroundVideoAudioDescEn'),
    backgroundVideoAudioDescAr: extractString(content, 'backgroundVideoAudioDescAr'),
    backgroundImage: extractString(content, 'backgroundImage'),
    visualEffect: extractString(content, 'visualEffect'),
    musicKey: extractString(content, 'musicKey'),
    ambientKeys: extractStringArray(content, 'ambientKeys'),
    enterSfxKeys: extractStringArray(content, 'enterSfxKeys'),
    audioUrl: extractString(content, 'audioUrl'),
    dialogue: extractDialogue(content),
    choices: extractChoices(content),
    defaultNextScene: extractString(content, 'defaultNextScene'),
    autoAdvance: extractBoolean(content, 'autoAdvance'),
    transitionType: extractString(content, 'transitionType'),
    transitionDuration: extractNumber(content, 'transitionDuration'),
    emotionalTone: extractString(content, 'emotionalTone'),
    historicalContext: extractString(content, 'historicalContext')
  };
  
  // Remove undefined/null values
  Object.keys(scene).forEach(key => {
    if (scene[key] === undefined || scene[key] === null) {
      delete scene[key];
    }
  });
  
  return scene;
}

function extractString(content, key) {
  const regex = new RegExp(`${key}:\s*['"]([^'"]*)['"]`, 'i');
  const match = content.match(regex);
  return match ? match[1] : undefined;
}

function extractNumber(content, key) {
  const regex = new RegExp(`${key}:\s*(\d+)`, 'i');
  const match = content.match(regex);
  return match ? parseInt(match[1], 10) : undefined;
}

function extractBoolean(content, key) {
  const regex = new RegExp(`${key}:\s*(true|false)`, 'i');
  const match = content.match(regex);
  return match ? match[1] === 'true' : undefined;
}

function extractStringArray(content, key) {
  const regex = new RegExp(`${key}:\s*\[([^\]]*)\]`, 'i');
  const match = content.match(regex);
  if (!match) return undefined;
  
  const items = match[1].match(/['"]([^'"]*)['"]/g);
  return items ? items.map(item => item.replace(/['"]/g, '')) : [];
}

function extractDialogue(content) {
  const dialogue = [];
  const dialogueRegex = /\{\s*character:\s*['"]([^'"]*)['"]\s*,\s*text:\s*['"]([^'"]*)['"]\s*,\s*arabicText:\s*['"]([^'"]*)['"]\s*,\s*duration:\s*(\d+)\s*\}/g;
  
  let match;
  while ((match = dialogueRegex.exec(content)) !== null) {
    dialogue.push({
      character: match[1],
      text: match[2],
      arabicText: match[3],
      duration: parseInt(match[4], 10)
    });
  }
  
  // Also try simpler pattern without character
  const simpleDialogueRegex = /\{\s*text:\s*['"]([^'"]*)['"]\s*,\s*arabicText:\s*['"]([^'"]*)['"]\s*,\s*duration:\s*(\d+)\s*\}/g;
  while ((match = simpleDialogueRegex.exec(content)) !== null) {
    dialogue.push({
      text: match[1],
      arabicText: match[2],
      duration: parseInt(match[3], 10)
    });
  }
  
  return dialogue.length > 0 ? dialogue : undefined;
}

function extractChoices(content) {
  const choices = [];
  const choiceRegex = /\{\s*id:\s*['"]([^'"]*)['"]\s*,\s*text:\s*['"]([^'"]*)['"]\s*,\s*arabicText:\s*['"]([^'"]*)['"]\s*,\s*nextSceneId:\s*['"]([^'"]*)['"](?:\s*,\s*consequence:\s*['"]([^'"]*)['"])?(?:\s*,\s*timer:\s*(\d+))?\s*\}/g;
  
  let match;
  while ((match = choiceRegex.exec(content)) !== null) {
    const choice = {
      id: match[1],
      text: match[2],
      arabicText: match[3],
      nextSceneId: match[4]
    };
    if (match[5]) choice.consequence = match[5];
    if (match[6]) choice.timer = parseInt(match[6], 10);
    choices.push(choice);
  }
  
  return choices.length > 0 ? choices : undefined;
}

function getPartNumber(partKey) {
  const mapping = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7
  };
  return mapping[partKey] || 0;
}

function getPartTitleEn(partKey) {
  const titles = {
    'zero': 'The Cosmic Courtroom',
    'one': 'The First Murder',
    'two': 'The Golden Calf',
    'three': 'The Deified Emperor',
    'four': 'The Cover-up of the Ages',
    'five': 'The Trial of Faith',
    'six': 'The Final Verdict',
    'seven': 'Epilogue'
  };
  return titles[partKey] || 'Unknown Part';
}

function getPartTitleAr(partKey) {
  const titles = {
    'zero': 'غرفة المحاكمة الكونية',
    'one': 'أول جريمة قتل',
    'two': 'العجل الذهبي',
    'three': 'الإمبراطور المتأله',
    'four': 'التستر عبر العصور',
    'five': 'محاكمة الإيمان',
    'six': 'الحكم النهائي',
    'seven': 'خاتمة'
  };
  return titles[partKey] || 'جزء غير معروف';
}
