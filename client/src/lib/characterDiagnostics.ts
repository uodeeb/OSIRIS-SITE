/**
 * Character Asset Diagnostics Tool
 * 
 * This script helps diagnose and fix character asset loading issues
 */

import { getAssetUrl, getAssetsByKind, getAllAssets } from './assetUrls';

interface DiagnosticResult {
  characterKey: string;
  status: 'success' | 'error' | 'missing';
  url?: string;
  error?: string;
  fix?: string;
}

export class CharacterAssetDiagnostics {
  private static readonly CHARACTER_KEYS = [
    'character.narrator',
    'character.yahya',
    'character.yahya_breakdown', 
    'character.yahya_confront',
    'character.laila',
    'character.laila_faith',
    'character.laila_witness',
    'character.tarek',
    'character.tarek_ghost',
    'character.tarek_dream',
    'character.first_engineer',
    'character.first_engineer_2',
    'character.first_engineer_confront',
    'character.first_engineer_exposed',
    'character.arius',
    'character.athanasius',
    'character.samiri',
    'character.samiri_calf',
    'character.constantine',
    'character.ramses',
    'character.abu_abdullah',
    'character.dictator'
  ];

  /**
   * Run comprehensive diagnostics on all character assets
   */
  static async runDiagnostics(): Promise<DiagnosticResult[]> {
    console.log('[CharacterDiagnostics] Starting character asset diagnostics...');
    
    const results: DiagnosticResult[] = [];
    
    for (const characterKey of this.CHARACTER_KEYS) {
      try {
        const url = await getAssetUrl(characterKey);
        results.push({
          characterKey,
          status: 'success',
          url,
          fix: 'None - asset loads correctly'
        });
        console.log(`[CharacterDiagnostics] ✅ ${characterKey}: ${url}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const fix = this.suggestFix(characterKey, errorMessage);
        
        results.push({
          characterKey,
          status: 'error',
          error: errorMessage,
          fix
        });
        console.log(`[CharacterDiagnostics] ❌ ${characterKey}: ${errorMessage}`);
        console.log(`[CharacterDiagnostics] 💡 Fix: ${fix}`);
      }
    }
    
    return results;
  }

  /**
   * Suggest fixes for common character asset issues
   */
  private static suggestFix(characterKey: string, error: string): string {
    if (error.includes('not found') || error.includes('404')) {
      return `Run fix-character-assets.sql to add missing character assets to database`;
    }
    
    if (error.includes('database') || error.includes('500')) {
      return `Check database connection and run insert-basic-assets.sql first`;
    }
    
    if (error.includes('file not found') || error.includes('404')) {
      return `Verify file exists at expected path in /generated-assets/characters/`;
    }
    
    return `Check asset key format and database seeding`;
  }

  /**
   * Test character assets by kind
   */
  static async testCharacterKind(): Promise<void> {
    console.log('[CharacterDiagnostics] Testing character assets by kind...');
    
    try {
      const characterAssets = await getAssetsByKind('character');
      console.log(`[CharacterDiagnostics] Found ${characterAssets.length} character assets in database:`);
      
      characterAssets.forEach((asset, index) => {
        console.log(`  ${index + 1}. ${asset.key} -> ${asset.url}`);
      });
      
      if (characterAssets.length === 0) {
        console.log('[CharacterDiagnostics] ❌ No character assets found in database');
        console.log('[CharacterDiagnostics] 💡 Run fix-character-assets.sql to seed character assets');
      }
      
    } catch (error) {
      console.error('[CharacterDiagnostics] Error testing character kind:', error);
    }
  }

  /**
   * Generate comprehensive report
   */
  static async generateReport(): Promise<void> {
    console.log('\n' + '='.repeat(60));
    console.log('CHARACTER ASSET DIAGNOSTICS REPORT');
    console.log('='.repeat(60));
    
    const results = await this.runDiagnostics();
    
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    console.log(`\nSUMMARY:`);
    console.log(`✅ Successful: ${successCount}/${results.length} characters`);
    console.log(`❌ Failed: ${errorCount}/${results.length} characters`);
    
    if (errorCount > 0) {
      console.log(`\nFAILED ASSETS:`);
      results.filter(r => r.status === 'error').forEach(result => {
        console.log(`  ❌ ${result.characterKey}: ${result.error}`);
        console.log(`     💡 Fix: ${result.fix}`);
      });
      
      console.log(`\nRECOMMENDED ACTIONS:`);
      console.log(`1. Run fix-character-assets.sql to seed missing assets`);
      console.log(`2. Verify all character files exist in /generated-assets/characters/`);
      console.log(`3. Test with AssetManager component at /asset-demo`);
    }
    
    await this.testCharacterKind();
    console.log('\n' + '='.repeat(60));
  }

  /**
   * Quick test for specific character
   */
  static async testCharacter(characterKey: string): Promise<void> {
    console.log(`[CharacterDiagnostics] Testing ${characterKey}...`);
    
    try {
      const url = await getAssetUrl(characterKey);
      console.log(`✅ ${characterKey} loads successfully: ${url}`);
      
      // Test if URL is accessible
      const response = await fetch(url);
      if (response.ok) {
        console.log(`✅ File is accessible at URL`);
      } else {
        console.log(`❌ File not accessible (HTTP ${response.status})`);
      }
      
    } catch (error) {
      console.log(`❌ ${characterKey} failed: ${error}`);
    }
  }
}

// Auto-run diagnostics if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment - run diagnostics
  CharacterAssetDiagnostics.generateReport().catch(console.error);
}

export default CharacterAssetDiagnostics;
