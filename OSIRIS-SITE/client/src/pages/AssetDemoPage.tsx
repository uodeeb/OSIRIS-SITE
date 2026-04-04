/**
 * Asset Demo Page - Shows revised asset presentation system
 * 
 * This page demonstrates the database-driven asset loading with Cloudflare CDN URLs
 * and proper fallback handling.
 */

import React, { useState } from 'react';
import AssetManager from '@/components/AssetManager';

export default function AssetDemoPage() {
  const [viewMode, setViewMode] = useState<'all' | 'video' | 'audio' | 'character' | 'background'>('all');

  return React.createElement('div', { style: { padding: '20px', fontFamily: 'Arial, sans-serif' } }, [
    React.createElement('header', { style: { marginBottom: '30px', textAlign: 'center' } }, [
      React.createElement('h1', { style: { color: '#333', marginBottom: '10px' } }, 'OSIRIS Asset Management System'),
      React.createElement('p', { style: { color: '#666', fontSize: '16px', lineHeight: '1.5' } }, 'Demonstrating database-driven asset loading with Cloudflare CDN URLs and fallback handling.')
    ]),

    React.createElement('nav', { 
      style: { 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        textAlign: 'center'
      } 
    }, [
      React.createElement('h3', { style: { marginBottom: '15px', color: '#333' } }, 'View Mode:'),
      React.createElement('div', { style: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' } }, 
        [
          { mode: 'all', label: 'All Assets', color: '#007acc' },
          { mode: 'video', label: 'Videos', color: '#28a745' },
          { mode: 'audio', label: 'Audio', color: '#dc3545' },
          { mode: 'character', label: 'Characters', color: '#ffc107' },
          { mode: 'background', label: 'Backgrounds', color: '#6f42c1' }
        ].map(({ mode, label, color }) => 
          React.createElement('button', {
            key: mode,
            onClick: () => setViewMode(mode as any),
            style: {
              padding: '10px 20px',
              backgroundColor: viewMode === mode ? color : '#e9ecef',
              color: viewMode === mode ? 'white' : '#333',
              border: `2px solid ${color}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: viewMode === mode ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }
          }, label)
        )
      )
    ]),

    React.createElement('main', null, 
      viewMode === 'all' ? 
        React.createElement(AssetManager, { showAll: true }) :
        React.createElement(AssetManager, { kind: viewMode as any })
    ),

    React.createElement('footer', { 
      style: { 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      } 
    }, [
      React.createElement('h3', { style: { marginBottom: '10px', color: '#333' } }, 'System Information'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } }, [
        React.createElement('div', null, [
          React.createElement('h4', { style: { color: '#007acc', marginBottom: '5px' } }, 'Primary Method'),
          React.createElement('p', null, 'Database-driven asset loading via tRPC API')
        ]),
        React.createElement('div', null, [
          React.createElement('h4', { style: { color: '#28a745', marginBottom: '5px' } }, 'CDN Integration'),
          React.createElement('p', null, 'Cloudflare CDN URLs stored in database')
        ]),
        React.createElement('div', null, [
          React.createElement('h4', { style: { color: '#dc3545', marginBottom: '5px' } }, 'Fallback System'),
          React.createElement('p', null, 'Local assets when database unavailable')
        ]),
        React.createElement('div', null, [
          React.createElement('h4', { style: { color: '#ffc107', marginBottom: '5px' } }, 'Caching'),
          React.createElement('p', null, 'In-memory cache for performance')
        ])
      ]),
      
      React.createElement('div', { style: { marginTop: '15px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '6px' } }, [
        React.createElement('strong', null, '🚀 Features:'),
        React.createElement('ul', { style: { marginTop: '10px', paddingLeft: '20px' } }, [
          React.createElement('li', null, 'Real-time asset loading from database'),
          React.createElement('li', null, 'Automatic fallback to local assets'),
          React.createElement('li', null, 'Asset preview and testing'),
          React.createElement('li', null, 'Performance caching'),
          React.createElement('li', null, 'Error handling and logging')
        ])
      ])
    ])
  ]);
}
