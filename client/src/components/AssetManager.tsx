/**
 * Asset Manager Component - Demonstrates database-driven asset presentation
 * 
 * This component shows how to properly fetch and display assets from the database
 * with Cloudflare CDN URLs and fallback handling.
 */

import React, { useState, useEffect } from 'react';
import { loadAssetManifest, getAllAssets, getAssetsByCategory, getAsset } from '@/lib/assets';
import type { AssetEntry } from '@/lib/assets';

interface AssetManagerProps {
  kind?: 'audio' | 'video' | 'background' | 'character' | 'document' | 'ui';
  showAll?: boolean;
}

export function AssetManager({ kind, showAll = false }: AssetManagerProps) {
  const [assets, setAssets] = useState<AssetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssets() {
      try {
        setLoading(true);
        setError(null);

        let loadedAssets: AssetEntry[] = [];

        if (showAll) {
          // Load all assets from manifest
          const allAssets = getAllAssets();
          loadedAssets = Object.values(allAssets).map((a: any) => ({
            key: a.key || a,
            category: a.category || 'unknown',
            path: a.path || a,
            mime: a.mime || 'unknown',
            originalName: a.originalName || '',
            size: a.size,
          }));
        } else if (kind) {
          // Load assets by kind from manifest
          loadedAssets = getAssetsByCategory(kind);
        }

        setAssets(loadedAssets);
        console.log(`[AssetManager] Loaded ${loadedAssets.length} assets from manifest`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('[AssetManager] Failed to load assets:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, [kind, showAll]);

  // Test individual asset loading
  const testAsset = async (key: string) => {
    try {
      const url = getAsset(key);
      console.log(`[AssetManager] Test loaded ${key}:`, url);
      alert(`Asset loaded successfully: ${key}\nURL: ${url.substring(0, 100)}...`);
    } catch (err) {
      console.error(`[AssetManager] Test failed for ${key}:`, err);
      alert(`Failed to load asset: ${key}\nError: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } }, [
      React.createElement('div', null, 'Loading assets from manifest...')
    ]);
  }

  if (error) {
    return React.createElement('div', { style: { padding: '20px', color: 'red' } }, [
      React.createElement('h3', null, 'Asset Loading Error'),
      React.createElement('p', null, error),
      React.createElement('p', null, 'Check that asset-manifest.json exists and is valid.')
    ]);
  }

  return React.createElement('div', { style: { padding: '20px' } }, [
    React.createElement('h2', null, [
      showAll ? 'All Assets' : `${kind?.toUpperCase() || ''} Assets`,
      React.createElement('span', { 
        style: { fontSize: '14px', color: '#666', marginLeft: '10px' } 
      }, `(${assets.length} items)`)
    ]),
    
    assets.length === 0 ? 
      React.createElement('p', null, 'No assets found. Run: npx tsx scripts/build-assets.ts') :
      React.createElement('div', { style: { display: 'grid', gap: '10px' } }, 
        assets.map((asset) => 
          React.createElement('div', {
            key: asset.key,
            style: {
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9'
            }
          }, [
            React.createElement('div', { 
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } 
            }, [
              React.createElement('div', null, [
                React.createElement('strong', null, asset.key),
                React.createElement('span', { 
                  style: { 
                    marginLeft: '10px', 
                    padding: '2px 8px', 
                    backgroundColor: '#007acc', 
                    color: 'white', 
                    borderRadius: '4px',
                    fontSize: '12px'
                  } 
                }, asset.category),
                asset.mime && React.createElement('span', { 
                  style: { marginLeft: '10px', color: '#666', fontSize: '12px' } 
                }, asset.mime)
              ]),
              React.createElement('button', {
                onClick: () => testAsset(asset.key),
                style: {
                  padding: '5px 10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }
              }, 'Test Load')
            ]),
            
            React.createElement('div', { style: { marginTop: '10px', fontSize: '12px', color: '#666' } }, [
              React.createElement('div', null, `Path: ${asset.path.substring(0, 100)}...`),
              asset.size && React.createElement('div', null, `Size: ${(asset.size / 1024 / 1024).toFixed(2)} MB`)
            ]),

            // Preview for images
            asset.mime?.startsWith('image/') && React.createElement('div', { style: { marginTop: '10px' } }, [
              React.createElement('img', {
                src: asset.path,
                alt: asset.key,
                style: { 
                  maxWidth: '200px', 
                  maxHeight: '150px', 
                  objectFit: 'cover',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                },
                onError: (e) => {
                  console.error(`[AssetManager] Failed to load image:`, asset.path);
                  (e.target as HTMLImageElement).style.display = 'none';
                },
                onLoad: () => {
                  console.log(`[AssetManager] Successfully loaded image:`, asset.key);
                }
              })
            ]),

            // Preview for audio
            asset.mime?.startsWith('audio/') && React.createElement('div', { style: { marginTop: '10px' } }, [
              React.createElement('audio', { controls: true, style: { width: '100%' } }, [
                React.createElement('source', { src: asset.path, type: asset.mime }),
                'Your browser does not support the audio element.'
              ])
            ]),

            // Preview for video
            asset.mime?.startsWith('video/') && React.createElement('div', { style: { marginTop: '10px' } }, [
              React.createElement('video', { 
                controls: true, 
                style: { maxWidth: '300px', maxHeight: '200px' },
                onError: (e) => {
                  console.error(`[AssetManager] Failed to load video:`, asset.path);
                  (e.target as HTMLVideoElement).style.display = 'none';
                },
                onLoad: () => {
                  console.log(`[AssetManager] Successfully loaded video:`, asset.key);
                }
              }, [
                React.createElement('source', { src: asset.path, type: asset.mime }),
                'Your browser does not support the video element.'
              ])
            ])
          ])
        )
      )
  ]);
}

export default AssetManager;
