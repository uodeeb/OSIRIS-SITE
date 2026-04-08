import React, { useEffect, useState } from 'react';
import { getManifest } from '@/lib/assets';

interface AssetInfo {
  key: string;
  kind: string;
  url: string;
  mime?: string;
  bytes?: number;
}

export function AssetDebug() {
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manifestLoaded, setManifestLoaded] = useState(false);

  useEffect(() => {
    async function fetchAssets() {
      try {
        setLoading(true);
        
        // Wait for manifest to be available
        let attempts = 0;
        let manifest = getManifest();
        
        while (!manifest && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          manifest = getManifest();
          attempts++;
        }
        
        if (!manifest) {
          setError('Asset manifest not loaded after 5s. Check App.tsx initialization.');
          setLoading(false);
          return;
        }
        
        setManifestLoaded(true);
        
        // Convert manifest assets to display format
        const assetList: AssetInfo[] = Object.values(manifest.assets).map(asset => ({
          key: asset.key,
          kind: asset.category,
          url: asset.path,
          mime: asset.mime,
          bytes: asset.size,
        }));
        
        setAssets(assetList);
        console.log('[AssetDebug] Loaded', assetList.length, 'assets from manifest');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('[AssetDebug] Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Group assets by category
  const assetsByCategory = assets.reduce((acc, asset) => {
    acc[asset.kind] = (acc[asset.kind] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }
  }, [
    React.createElement('h3', {
      style: { margin: '0 0 10px 0', color: '#00ff00' }
    }, 'Asset Debug Panel (Manifest)'),
    
    loading ? React.createElement('div', null, 'Loading manifest...') : null,
    error ? React.createElement('div', {
      style: { color: '#ff6b6b' }
    }, `Error: ${error}`) : null,
    
    React.createElement('div', {
      style: { marginBottom: '10px' }
    }, [
      React.createElement('strong', null, 'Manifest Loaded: '),
      manifestLoaded ? '✅ Yes' : '❌ No'
    ]),
    
    React.createElement('div', {
      style: { marginBottom: '10px' }
    }, [
      React.createElement('strong', null, 'Total Assets: '),
      assets.length
    ]),

    // Category breakdown
    Object.entries(assetsByCategory).length > 0 && React.createElement('div', {
      style: { marginBottom: '10px', fontSize: '11px' }
    }, [
      React.createElement('strong', null, 'By Category:'),
      React.createElement('ul', {
        style: { margin: '5px 0', paddingLeft: '15px' }
      }, Object.entries(assetsByCategory).map(([cat, count]) =>
        React.createElement('li', { key: cat }, `${cat}: ${count}`)
      ))
    ]),

    // Sample assets (first 5)
    assets.length > 0 ? React.createElement('div', null, [
      React.createElement('strong', null, 'Sample Assets (first 5):'),
      React.createElement('ul', {
        style: { margin: '5px 0', paddingLeft: '20px' }
      }, assets.slice(0, 5).map((asset) =>
        React.createElement('li', {
          key: asset.key,
          style: { marginBottom: '5px' }
        }, [
          React.createElement('div', {
            style: { color: '#ffeb3b' }
          }, asset.key),
          React.createElement('div', {
            style: { fontSize: '10px', color: '#ccc' }
          }, `Type: ${asset.kind}${asset.bytes ? ` | Size: ${(asset.bytes / 1024 / 1024).toFixed(2)}MB` : ''}`),
          React.createElement('div', {
            style: { fontSize: '10px', color: '#888', wordBreak: 'break-all' }
          }, `Path: ${asset.url}`)
        ])
      ))
    ]) : null,

    React.createElement('div', {
      style: { marginTop: '15px', fontSize: '10px', color: '#888' }
    }, [
      React.createElement('div', null, '💡 Tips:'),
      React.createElement('div', null, '• Assets are loaded from /asset-manifest.json'),
      React.createElement('div', null, '• Check browser network tab for 404s'),
      React.createElement('div', null, '• Run: npx tsx scripts/build-assets.ts to rebuild manifest')
    ])
  ]);
}

export default AssetDebug;

