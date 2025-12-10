"use client";

import { useEffect, useRef, useState } from 'react';

type AdSize = 'banner' | 'square' | 'native';

interface AdBannerProps {
  size: AdSize;
}

const zoneConfig: Record<AdSize, { width: number; height: number; envKey: string }> = {
  banner: { width: 728, height: 90, envKey: 'NEXT_PUBLIC_EXOCLICK_ZONE_BANNER' },
  square: { width: 300, height: 250, envKey: 'NEXT_PUBLIC_EXOCLICK_ZONE_SQUARE' },
  native: { width: 300, height: 250, envKey: 'NEXT_PUBLIC_EXOCLICK_ZONE_NATIVE' }
};

const AdBanner = ({ size }: AdBannerProps) => {
  const config = zoneConfig[size];
  // Fallback to hardcoded ID if env is missing (fixes 'undefined' issue)
  const fallbackIds: Record<string, string> = {
    banner: '5796032',
    square: '5795068',
    native: '5794992'
  };
  const envZoneId = process.env[config.envKey] || fallbackIds[size] || '';
  const [zoneId, setZoneId] = useState('');

  // Hydration fix: only set ID on client
  useEffect(() => {
    // Debug logging
    console.log(`[AdBanner] Loading ${size} | Key: ${config.envKey} | ID: ${envZoneId}`);
    setZoneId(envZoneId);
  }, [envZoneId, config.envKey, size]);

  if (!zoneId) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`my-6 flex justify-center items-center bg-gray-800 border-2 border-dashed border-gray-700 text-gray-500 text-xs uppercase tracking-widest text-center ${size === 'banner' ? 'w-full max-w-[728px] mx-auto' : 'w-[300px] mx-auto'}`} style={{ height: config.height }}>
          Set {config.envKey} in .env
          <br />
          (Current value: {envZoneId ? envZoneId : 'undefined'})
        </div>
      )
    }
    return null;
  }

  // Construct the HTML to show inside the iframe (MagSRV format)
  const adHtml = `
    <!DOCTYPE html>
    <html style="margin:0;padding:0;overflow:hidden;">
    <head>
      <meta charset="utf-8">
      <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
    </head>
    <body>
      <script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"></script> 
      <ins class="eas6a97888e2" data-zoneid="${zoneId}"></ins> 
      <script>(AdProvider = window.AdProvider || []).push({"serve": {}});</script>
    </body>
    </html>
  `;

  return (
    <div className={`flex justify-center my-6 overflow-hidden ${size === 'banner' ? 'w-full' : ''}`}>
      <iframe
        title={`Ad-${size}`}
        srcDoc={adHtml}
        width={config.width}
        height={config.height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
};

export default AdBanner;