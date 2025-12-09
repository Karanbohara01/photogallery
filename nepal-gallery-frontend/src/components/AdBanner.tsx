
interface AdBannerProps {
  size: 'banner' | 'square' | 'native'; // Different sizes for different spots
}

const AdBanner = ({ size }: AdBannerProps) => {
  // SIZES GUIDE:
  // banner = 728x90 (Top of page or inside header)
  // square = 300x250 (Sidebar or below video content)
  // native = Looks like a gallery card (blends into the grid)
  
  // NOTE: When you get approved by ExoClick/JuicyAds, 
  // you will replace the <div> elements below with their <script> tags.

  // 1. Native Ad (Looks like a grid item)
  if (size === 'native') {
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full">
        {/* Fake Image Placeholder */}
        <div className="bg-gray-700 h-48 flex items-center justify-center text-gray-500 text-sm font-mono border-b border-gray-600">
          SPONSORED
        </div>
        {/* Fake Text Placeholder */}
        <div className="p-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // 2. Standard Banners (728x90 or 300x250)
  return (
    <div className={`my-6 flex justify-center items-center bg-gray-800 border-2 border-dashed border-gray-700 text-gray-500 font-bold tracking-widest uppercase ${
      size === 'banner' 
        ? 'w-full h-[90px] max-w-[728px] mx-auto' // Banner Size
        : 'w-[300px] h-[250px] mx-auto'            // Square Size
    }`}>
      Ad Space ({size})
    </div>
  );
};

export default AdBanner;