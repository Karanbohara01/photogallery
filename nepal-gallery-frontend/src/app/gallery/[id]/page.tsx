"use client";

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdBanner from '../../../components/AdBanner';
import VideoEmbed from '../../../components/VideoEmbed';
import { Gallery } from '../../../type'; // Fixed import (types instead of type)

export default function SingleGalleryPage() {
  // 1. Get the ID from the URL
  const { id } = useParams();
  const router = useRouter();
  
  const [item, setItem] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper: Get Image URL (Robust Version)
  const getImageUrl = (path: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const SERVER_URL = API_URL.replace('/api', '');
    
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    
    // Fix Windows paths and append server URL
    let cleanPath = path.replace(/\\/g, '/');
    return `${SERVER_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchSingleGallery = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        // We fetch the specific ID using the route we created in the Backend
        const { data } = await axios.get(`${apiUrl}/galleries/${id}`);
        
        setItem(data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gallery", error);
        setLoading(false);
      }
    };

    if (id) fetchSingleGallery();
  }, [id]);

  if (loading) return <div className="text-white text-center mt-20">Loading Content...</div>;
  if (!item) return <div className="text-white text-center mt-20">Content Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="mb-6 text-gray-400 hover:text-white flex items-center"
      >
        &larr; Back to Gallery
      </button>

      <article className="max-w-4xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          
          {/* Top Ad Banner inside the card */}
          <div className="mb-6">
            <AdBanner size="banner" />
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-red-500 mb-2">{item.title}</h1>
          
          <div className="flex flex-wrap gap-2 text-sm text-gray-400">
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{item.views} Views</span>
            <span>•</span>
            {item.tags.map(tag => (
              <span key={tag} className="bg-gray-700 px-2 py-0.5 rounded text-gray-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 bg-black">
          {/* If it's a VIDEO */}
          {item.contentType === 'embed' && item.embedCode && (
             <VideoEmbed embedCode={item.embedCode} title={item.title} />
          )}

          {/* If it's an IMAGE GALLERY */}
          {item.contentType === 'hosted' && item.images && (
            <div className="space-y-8">
              {item.images.map((img, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img 
                    src={getImageUrl(img.url)} 
                    alt={`${item.title} - ${index + 1}`}
                    className="max-w-full h-auto rounded-lg shadow-lg border border-gray-800"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description / Footer */}
        <div className="p-6 bg-gray-800 text-gray-300">
          <h3 className="font-bold text-white mb-2">Description</h3>
          <p className="mb-8">{item.description || "No description available for this content."}</p>
          
          {/* Bottom Ad Square */}
          <div className="flex justify-center border-t border-gray-700 pt-6">
             <AdBanner size="square" />
          </div>
        </div>

      </article>
    </div>
  );
}