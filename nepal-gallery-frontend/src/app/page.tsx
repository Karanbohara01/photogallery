"use client";

import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AdBanner from '../components/AdBanner';
import VideoEmbed from '../components/VideoEmbed';
import { Gallery } from '../type'; // Ensure this matches your types file
import { FiCamera, FiVideo, FiEye, FiPlay } from 'react-icons/fi';

export default function Home() {
  return (
    <Suspense fallback={<main className="p-4 pt-20">Loading...</main>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  // Hooks for URL params and navigation
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. READ PARAMS (Page & Search)
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const [totalPages, setTotalPages] = useState(1);

  // Configuration: use internal Next.js API on same domain
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
  // const SERVER_URL = API_URL.replace('/api', '');
  const SERVER_URL = ''; // Relative path because we serve /uploads from Next.js now

  // 2. FETCH DATA
  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const query = `?page=${page}&limit=16&search=${encodeURIComponent(search)}`;
        const { data } = await axios.get(`${API_URL}/galleries${query}`);
        console.log("DEBUG: fetched data", data.data);

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

    // 1. Normalize slashes
    let cleanPath = path.replace(/\\/g, '/');

    // 2. Remove leading slash from path to prevent double slashes with SERVER_URL
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    // 3. SERVER_URL might be empty (relative) or absolute (http://...)
    // If empty, we want the result to start with / (e.g. /uploads/...)
    // If absolute, key is to join with single slash

    if (!SERVER_URL) {
      return `/${cleanPath}`;
    }

    return `${SERVER_URL}/${cleanPath}`;
  };

  return (
    <main className="p-4 md:p-6 pt-24 min-h-screen">

      {/* DYNAMIC HEADER */}
      <div className="flex items-center justify-between mb-8 px-4 border-l-4 border-[#cc0000] bg-[#1a1a1a] py-4 rounded-r-md shadow-sm">
        <h1 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tight">
          {search ? (
            <>Search Results: <span className="text-[#cc0000]">"{search}"</span></>
          ) : (
            <>Newest <span className="text-[#cc0000]">Updates</span></>
          )}
        </h1>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-[#0f0f0f] px-3 py-1 rounded-full border border-[#333]">Page {page}</span>
      </div>

      {/* TOP AD BANNER */}
      <div className="mb-10">
        <AdBanner size="banner" />
      </div>

      {/* LOADING STATE */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#cc0000]"></div>
        </div>
      ) : (
        // GRID LAYOUT
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleries.map((item, index) => (
            <React.Fragment key={item._id}>

              {/* NATIVE AD LOGIC: Show an ad every 8th item */}
              {index > 0 && index % 8 === 0 && (
                <div className="sm:col-span-2 lg:col-span-4 mb-6">
                  <AdBanner size="native" />
                </div>
              )}

              {/* CONTENT CARD */}
              <Link href={`/gallery/${item._id}`} className="group block bg-[#1a1a1a] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 ring-1 ring-[#2a2a2a] hover:ring-[#cc0000]/50">
                <div className="relative aspect-[16/10] overflow-hidden bg-black">

                  {/* --- CASE 1: HOSTED IMAGE GALLERY --- */}
                  {item.contentType === 'hosted' && item.images && item.images.length > 0 && (
                    <>
                      <img
                        src={getImageUrl(item.images[0].url)}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Camera Badge */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 rounded-sm border border-white/10">
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
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-[2px]">
                            <div className="w-14 h-14 bg-[#cc0000] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,0,0,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <FiPlay className="text-2xl text-white ml-1 fill-white" />
                            </div>
                          </div>
                          {/* Video Badge */}
                          <div className="absolute bottom-2 right-2 bg-[#cc0000] text-white text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 rounded-sm shadow-md">
                            VIDEO
                          </div>
                        </>
                      ) : (
                        // Sub-case B: No Thumbnail -> Show Fallback Icon
                        <div className="w-full h-full flex items-center justify-center bg-[#222] group-hover:bg-[#333] transition-colors">
                          <FiVideo className="text-5xl text-[#cc0000]" />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* CARD META INFO */}
                <div className="p-4">
                  <h2 className="text-sm font-bold text-gray-200 group-hover:text-[#cc0000] transition-colors line-clamp-2 leading-relaxed mb-3 h-11 tracking-tight">
                    {item.title}
                  </h2>

                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-gray-500">
                    <span className="flex items-center gap-1.5 bg-[#2a2a2a] px-2 py-1 rounded-sm text-gray-400 group-hover:text-white transition-colors">
                      <FiEye className="text-base" /> {item.views}
                    </span>
                    <span className="text-gray-600 group-hover:text-[#cc0000] transition-colors">{item.tags[0] || 'Model'}</span>
                  </div>
                </div>
              </Link>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && galleries.length === 0 && (
        <div className="text-center text-gray-500 mt-20 p-16 border border-[#2a2a2a] bg-[#1a1a1a] rounded-lg">
          <h3 className="text-2xl mb-2 font-bold text-gray-300">No content found.</h3>
          {search ? (
            <p className="text-sm">Try searching for something else.</p>
          ) : (
            <p className="text-sm">The gallery is empty.</p>
          )}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {!loading && galleries.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-16 mb-12">
          <button
            disabled={page === 1}
            onClick={() => {
              const query = search ? `?page=${page - 1}&search=${search}` : `?page=${page - 1}`;
              router.push(`/${query}`);
            }}
            className="px-5 py-2.5 bg-[#222] hover:bg-[#333] text-white text-xs font-bold disabled:opacity-30 disabled:hover:bg-[#222] transition-colors rounded-sm uppercase tracking-wider"
          >
            Prev
          </button>

          <div className="px-5 py-2.5 bg-[#cc0000] text-white text-sm font-bold rounded-sm shadow-md">
            {page}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => {
              const query = search ? `?page=${page + 1}&search=${search}` : `?page=${page + 1}`;
              router.push(`/${query}`);
            }}
            className="px-5 py-2.5 bg-[#222] hover:bg-[#333] text-white text-xs font-bold disabled:opacity-30 disabled:hover:bg-[#222] transition-colors rounded-sm uppercase tracking-wider"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}