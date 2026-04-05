import React, { useEffect, useState } from 'react';
import { initAssetOverrides } from '../lib/assetOverrides';

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

  useEffect(() => {
    async function fetchAssets() {
      try {
        setLoading(true);
        const response = await fetch('/api/trpc/system.debug');
        const data = await response.json();
        console.log('Debug endpoint response:', data);
        
        if (data?.result?.data?.sampleAssets) {
          setAssets(data.result.data.sampleAssets);
        }
        
        // Also try to initialize asset overrides
        await initAssetOverrides({ timeoutMs: 5000 });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Asset debug error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

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
    }, 'Asset Debug Panel'),
    
    loading ? React.createElement('div', null, 'Loading...') : null,
    error ? React.createElement('div', {
      style: { color: '#ff6b6b' }
    }, `Error: ${error}`) : null,
    
    React.createElement('div', {
      style: { marginBottom: '10px' }
    }, [
      React.createElement('strong', null, 'Database Connected: '),
      assets.length > 0 ? '✅ Yes' : '❌ No'
    ]),
    
    React.createElement('div', {
      style: { marginBottom: '10px' }
    }, [
      React.createElement('strong', null, 'Asset Count: '),
      assets.length
    ]),

    assets.length > 0 ? React.createElement('div', null, [
      React.createElement('strong', null, 'Sample Assets:'),
      React.createElement('ul', {
        style: { margin: '5px 0', paddingLeft: '20px' }
      }, assets.map((asset) =>
        React.createElement('li', {
          key: asset.key,
          style: { marginBottom: '5px' }
        }, [
          React.createElement('div', {
            style: { color: '#ffeb3b' }
          }, asset.key),
          React.createElement('div', {
            style: { fontSize: '10px', color: '#ccc' }
          }, `Type: ${asset.kind} | Size: ${asset.bytes ? `${(asset.bytes / 1024 / 1024).toFixed(2)}MB` : 'Unknown'}`),
          React.createElement('div', {
            style: { fontSize: '10px', color: '#ccc', wordBreak: 'break-all' }
          }, `URL: ${asset.url.substring(0, 60)}...`)
        ])
      ))
    ]) : null,

    React.createElement('div', {
      style: { marginTop: '15px', fontSize: '10px', color: '#888' }
    }, [
      React.createElement('div', null, '💡 Tips:'),
      React.createElement('div', null, '• If no assets, run: /api/trpc/system.seedAssets'),
      React.createElement('div', null, '• Check browser network tab for failed requests'),
      React.createElement('div', null, '• Asset overrides load from database first, then fallback to local JSON')
    ])
  ]);
}
