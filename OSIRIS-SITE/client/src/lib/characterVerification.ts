/**
 * Character Asset Verification Script
 * 
 * This script verifies that the character asset fix worked correctly
 * and tests the loading system.
 */

import { getAssetUrl, getAssetsByKind, getAllAssets } from './assetUrls';

interface VerificationResult {
  characterKey: string;
  status: 'success' | 'error';
  url?: string;
  error?: string;
  fileAccessible?: boolean;
}

export class CharacterAssetVerification {
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
   * Verify all character assets load correctly after database fix
   */
  static async verifyAllCharacters(): Promise<VerificationResult[]> {
    console.log('[CharacterVerification] 🔍 Verifying character assets after database fix...');
    
    const results: VerificationResult[] = [];
    
    for (const characterKey of this.CHARACTER_KEYS) {
      try {
        const url = await getAssetUrl(characterKey);
        
        // Test if the file is actually accessible
        let fileAccessible = false;
        try {
          const response = await fetch(url, { method: 'HEAD' });
          fileAccessible = response.ok;
        } catch (fetchError) {
          console.warn(`[CharacterVerification] ⚠️  Could not test file accessibility for ${characterKey}`);
        }
        
        results.push({
          characterKey,
          status: 'success',
          url,
          fileAccessible
        });
        
        console.log(`[CharacterVerification] ✅ ${characterKey}`);
        console.log(`    URL: ${url}`);
        console.log(`    Accessible: ${fileAccessible ? 'Yes' : 'No'}`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          characterKey,
          status: 'error',
          error: errorMessage,
          fileAccessible: false
        });
        
        console.log(`[CharacterVerification] ❌ ${characterKey}: ${errorMessage}`);
      }
    }
    
    return results;
  }

  /**
   * Verify character assets by kind from database
   */
  static async verifyCharacterKind(): Promise<void> {
    console.log('[CharacterVerification] 🔍 Verifying character assets by kind...');
    
    try {
      const characterAssets = await getAssetsByKind('character');
      console.log(`[CharacterVerification] 📊 Found ${characterAssets.length} character assets in database:`);
      
      characterAssets.forEach((asset, index) => {
        console.log(`  ${index + 1}. ${asset.key}`);
        console.log(`     URL: ${asset.url}`);
        console.log(`     MIME: ${asset.mime || 'Not specified'}`);
        console.log(`     Size: ${asset.bytes ? `${(asset.bytes / 1024).toFixed(1)}KB` : 'Unknown'}`);
      });
      
      if (characterAssets.length === 0) {
        console.log('[CharacterVerification] ❌ No character assets found in database');
        console.log('[CharacterVerification] 💡 Ensure fix-character-assets.sql was executed successfully');
      } else {
        console.log(`[CharacterVerification] ✅ Database contains ${characterAssets.length} character assets`);
      }
      
    } catch (error) {
      console.error('[CharacterVerification] ❌ Error verifying character kind:', error);
    }
  }

  /**
   * Generate comprehensive verification report
   */
  static async generateVerificationReport(): Promise<void> {
    console.log('\n' + '='.repeat(70));
    console.log('🔍 CHARACTER ASSET VERIFICATION REPORT (POST-DATABASE FIX)');
    console.log('='.repeat(70));
    
    const results = await this.verifyAllCharacters();
    
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const accessibleCount = results.filter(r => r.fileAccessible === true).length;
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`✅ Database Loading: ${successCount}/${results.length} (${((successCount/results.length)*100).toFixed(1)}%)`);
    console.log(`🌐 File Accessible: ${accessibleCount}/${successCount} (${successCount > 0 ? ((accessibleCount/successCount)*100).toFixed(1) : '0'}%)`);
    console.log(`❌ Failed: ${errorCount}/${results.length} (${((errorCount/results.length)*100).toFixed(1)}%)`);
    
    if (errorCount > 0) {
      console.log(`\n❌ FAILED ASSETS:`);
      results.filter(r => r.status === 'error').forEach(result => {
        console.log(`  ❌ ${result.characterKey}: ${result.error}`);
      });
      
      console.log(`\n🔧 RECOMMENDED ACTIONS:`);
      console.log(`1. Verify fix-character-assets.sql executed without errors`);
      console.log(`2. Check database connection and permissions`);
      console.log(`3. Ensure all character files exist in /generated-assets/characters/`);
    }
    
    if (accessibleCount < successCount) {
      console.log(`\n⚠️  INACCESSIBLE FILES:`);
      results.filter(r => r.status === 'success' && r.fileAccessible === false).forEach(result => {
        console.log(`  ⚠️  ${result.characterKey}: File not accessible at URL`);
        console.log(`     URL: ${result.url}`);
      });
      
      console.log(`\n🔧 FILE FIX ACTIONS:`);
      console.log(`1. Verify files exist at expected paths`);
      console.log(`2. Check file permissions and server configuration`);
      console.log(`3. Ensure UTF-8 encoding for Arabic file names`);
    }
    
    await this.verifyCharacterKind();
    
    console.log('\n' + '='.repeat(70));
    
    if (successCount === results.length && accessibleCount === successCount) {
      console.log('🎉 ALL CHARACTER ASSETS WORKING CORRECTLY!');
    } else {
      console.log('⚠️  SOME ISSUES REMAIN - SEE ACTIONS ABOVE');
    }
    console.log('='.repeat(70));
  }

  /**
   * Quick test for specific character
   */
  static async testCharacter(characterKey: string): Promise<void> {
    console.log(`[CharacterVerification] 🔍 Testing ${characterKey}...`);
    
    try {
      const url = await getAssetUrl(characterKey);
      console.log(`✅ Database loading successful: ${url}`);
      
      // Test file accessibility
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          console.log(`✅ File accessible (HTTP ${response.status})`);
          console.log(`📏 Content-Length: ${response.headers.get('content-length') || 'Unknown'}`);
          console.log(`📄 Content-Type: ${response.headers.get('content-type') || 'Unknown'}`);
        } else {
          console.log(`❌ File not accessible (HTTP ${response.status})`);
        }
      } catch (fetchError) {
        console.log(`❌ File test failed: ${fetchError}`);
      }
      
    } catch (error) {
      console.log(`❌ Database loading failed: ${error}`);
    }
  }

  /**
   * Test a few critical characters quickly
   */
  static async quickHealthCheck(): Promise<void> {
    console.log('[CharacterVerification] ⚡ Quick health check...');
    
    const criticalCharacters = [
      'character.narrator',
      'character.yahya', 
      'character.laila',
      'character.first_engineer'
    ];
    
    let successCount = 0;
    
    for (const characterKey of criticalCharacters) {
      try {
        const url = await getAssetUrl(characterKey);
        const response = await fetch(url, { method: 'HEAD' });
        
        if (response.ok) {
          successCount++;
          console.log(`✅ ${characterKey}`);
        } else {
          console.log(`⚠️  ${characterKey} (HTTP ${response.status})`);
        }
      } catch (error) {
        console.log(`❌ ${characterKey}: ${error}`);
      }
    }
    
    console.log(`\nHealth Check: ${successCount}/${criticalCharacters.length} critical characters working`);
    
    if (successCount === criticalCharacters.length) {
      console.log('🎉 Character system is healthy!');
    } else {
      console.log('⚠️  Some issues detected - run full verification for details');
    }
  }
}

// Auto-run verification if this file is executed directly
if (typeof window === 'undefined') {
  CharacterAssetVerification.generateVerificationReport().catch(console.error);
}

export default CharacterAssetVerification;
