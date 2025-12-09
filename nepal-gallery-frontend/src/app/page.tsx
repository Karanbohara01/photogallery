"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AdBanner from '../components/AdBanner';
import VideoEmbed from '../components/VideoEmbed';
import { Gallery } from '../type'; // Ensure this matches your types file
import { FiCamera, FiVideo, FiEye } from 'react-icons/fi';

export default function Home() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hooks for URL params and navigation
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 1. READ PARAMS (Page & Search)
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || ''; 

  const [totalPages, setTotalPages] = useState(1);
  
  // Configuration
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const SERVER_URL = API_URL.replace('/api', '');

  // 2. FETCH DATA
  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const query = `?page=${page}&limit=16&search=${encodeURIComponent(search)}`;
        const { data } = await axios.get(`${API_URL}/galleries${query}`);
        
        setGalleries(data.data);
        setTotalPages(data.pagination.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchGalleries();
  }, [API_URL, page, search]);

  // Helper: Construct Image URL
  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/');
    return `${SERVER_URL}/${cleanPath}`;
  };

  return (
    <main className="p-4">
      
      {/* DYNAMIC HEADER */}
      <div className="flex items-center justify-between mb-6 px-2 border-l-4 border-[#e62e04]">
        <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
          {search ? (
            <>Search Results: <span className="text-[#e62e04]">"{search}"</span></>
          ) : (
            <>Newest <span className="text-[#e62e04]">Updates</span></>
          )}
        </h1>
        <span className="text-xs text-gray-500">Page {page}</span>
      </div>

      {/* TOP AD BANNER */}
      <div className="mb-8">
        <AdBanner size="banner" />
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e62e04]"></div>
        </div>
      ) : (
        // GRID LAYOUT
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleries.map((item, index) => (
            <React.Fragment key={item._id}>
              
              {/* NATIVE AD LOGIC: Show an ad every 8th item */}
              {index > 0 && index % 8 === 0 && (
                <div className="sm:col-span-2 lg:col-span-4">
                   <AdBanner size="native" />
                </div>
              )}

              {/* CONTENT CARD */}
              <Link href={`/gallery/${item._id}`} className="group block bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  
                  {/* --- CASE 1: HOSTED IMAGE GALLERY --- */}
                  {item.contentType === 'hosted' && item.images && item.images.length > 0 && (
                    <>
                      <img 
                        src={getImageUrl(item.images[0].url)} 
                        alt={item.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        loading="lazy"
                      />
                      {/* Camera Badge */}
                      <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                        <FiCamera /> {item.images.length}
                      </div>
                    </>
                  )}

                  {/* --- CASE 2: VIDEO EMBED --- */}
                  {item.contentType === 'embed' && (
                    <>
                      {item.thumbnail && item.thumbnail !== 'no-photo.jpg' ? (
                        // Sub-case A: Has Thumbnail URL -> Show Image
                        <>
                          <img 
                            src={getImageUrl(item.thumbnail)} 
                            alt={item.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                            loading="lazy"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                             <div className="w-12 h-12 bg-[#e62e04] rounded-full flex items-center justify-center shadow-lg">
                                <FiVideo className="text-xl text-white ml-1" />
                             </div>
                          </div>
                          {/* Video Badge */}
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                             VIDEO
                          </div>
                        </>
                      ) : (
                        // Sub-case B: No Thumbnail -> Show Fallback Icon
                        <div className="w-full h-full flex items-center justify-center bg-[#222] group-hover:bg-[#333]">
                          <FiVideo className="text-4xl text-[#e62e04]" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* CARD META INFO */}
                <div className="p-3">
                  <h2 className="text-sm font-bold text-gray-200 group-hover:text-[#e62e04] transition-colors line-clamp-2 leading-snug mb-2 h-10">
                    {item.title}
                  </h2>
                  
                  <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <FiEye /> {item.views}
                    </span>
                    <span className="uppercase">{item.tags[0] || 'Model'}</span>
                  </div>
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && galleries.length === 0 && (
        <div className="text-center text-gray-500 mt-20 p-10 border border-[#333] bg-[#111]">
          <h3 className="text-xl mb-2">No content found.</h3>
          {search ? (
            <p className="text-sm">Try searching for something else.</p>
          ) : (
            <p className="text-sm">The gallery is empty.</p>
          )}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!loading && galleries.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-12 mb-8">
          <button
            disabled={page === 1}
            onClick={() => {
              const query = search ? `?page=${page - 1}&search=${search}` : `?page=${page - 1}`;
              router.push(`/${query}`);
            }}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-bold disabled:opacity-30 disabled:hover:bg-[#222] transition-colors"
          >
            PREV
          </button>

          <div className="px-4 py-2 bg-[#e62e04] text-white text-sm font-bold">
            {page}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => {
              const query = search ? `?page=${page + 1}&search=${search}` : `?page=${page + 1}`;
              router.push(`/${query}`);
            }}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-sm font-bold disabled:opacity-30 disabled:hover:bg-[#222] transition-colors"
          >
            NEXT
          </button>
        </div>
      )}
    </main>
  );
}