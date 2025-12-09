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
  const containerRef = useRef<HTMLDivElement>(null);
  const config = zoneConfig[size];
  const envZoneId = process.env[config.envKey] || '';
  const [zoneId, setZoneId] = useState('');

  // Set zoneId only on client to keep server and client markup consistent (avoids hydration mismatch)
  useEffect(() => {
    setZoneId(envZoneId);
  }, [envZoneId]);

  useEffect(() => {
    if (!zoneId || typeof window === 'undefined' || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = '';

    const settingsScript = document.createElement('script');
    settingsScript.type = 'text/javascript';
    settingsScript.innerHTML = `
      var ad_idzone = "${zoneId}";
      var ad_width = ${config.width};
      var ad_height = ${config.height};
    `;

    const tagScript = document.createElement('script');
    tagScript.type = 'text/javascript';
    tagScript.async = true;
    tagScript.src = `https://a.exoclick.com/tag.php?zoneid=${zoneId}&async=1`;

    container.appendChild(settingsScript);
    container.appendChild(tagScript);

    return () => {
      container.innerHTML = '';
    };
  }, [zoneId, config.width, config.height]);

  return (
    <div
      ref={containerRef}
      className={`my-6 flex justify-center items-center ${
        zoneId ? '' : 'bg-gray-800 border-2 border-dashed border-gray-700 text-gray-500 text-xs uppercase tracking-widest text-center'
      } ${size === 'banner' ? 'w-full max-w-[728px] mx-auto' : 'w-[300px] mx-auto'}`}
      style={{ minHeight: size === 'banner' ? 90 : 250 }}
    >
      {!zoneId && `Set ${config.envKey} in .env to enable this ad slot (${size})`}
    </div>
  );
};

export default AdBanner;