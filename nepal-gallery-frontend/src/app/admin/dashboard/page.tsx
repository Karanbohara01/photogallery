// "use client";

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { Gallery } from '../../../type'; // Ensure this path is correct

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [galleries, setGalleries] = useState<Gallery[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // Form State
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [title, setTitle] = useState('');
//   const [tags, setTags] = useState('');
//   const [contentType, setContentType] = useState<'embed' | 'hosted'>('embed');
//   const [embedCode, setEmbedCode] = useState('');
//   const [thumbnailUrl, setThumbnailUrl] = useState(''); // <--- Fixed placement
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

//   // Auth & Role Check
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     const role = localStorage.getItem('userRole');

//     if (!token) {
//         router.push('/admin/login');
//     } else if (role !== 'admin') {
//         alert("Access Denied: Admins Only");
//         router.push('/'); 
//     } else {
//         fetchGalleries();
//     }
//   }, [router]);

//   const fetchGalleries = async () => {
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const { data } = await axios.get(`${apiUrl}/galleries`);
//       setGalleries(data.data);
//     } catch (error) {
//       console.error("Failed to fetch galleries");
//     }
//   };

//   // 1. POPULATE FORM FOR EDITING
//   const handleEdit = (item: Gallery) => {
//     setEditingId(item._id);
//     setTitle(item.title);
//     setTags(item.tags.join(', '));
//     setContentType(item.contentType);
//     setEmbedCode(item.embedCode || '');
//     // Note: We cannot pre-fill thumbnail URL if it was uploaded, 
//     // but if it was saved as a string, we could. For now, keep simple.
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // 2. CANCEL EDITING
//   const resetForm = () => {
//     setEditingId(null);
//     setTitle('');
//     setTags('');
//     setEmbedCode('');
//     setThumbnailUrl('');
//     setSelectedFiles(null);
//     setContentType('embed');
//   };

//   // 3. DELETE FUNCTION
//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this?')) return;

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const token = localStorage.getItem('authToken');
      
//       await axios.delete(`${apiUrl}/galleries/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setGalleries(galleries.filter(g => g._id !== id));
//     } catch (error) {
//       alert('Failed to delete');
//     }
//   };

//   // 4. SUBMIT (CREATE OR UPDATE)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const token = localStorage.getItem('authToken');

//       if (editingId) {
//         // --- UPDATE MODE (PUT) ---
//         await axios.put(`${apiUrl}/galleries/${editingId}`, {
//           title,
//           tags: tags, 
//           contentType,
//           embedCode,
//           thumbnail: thumbnailUrl // Update thumbnail if provided
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         alert('Updated Successfully!');
//       } else {
//         // --- CREATE MODE (POST) ---
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('tags', tags);
//         formData.append('contentType', contentType);
        
//         if (contentType === 'embed') {
//           formData.append('embedCode', embedCode);
//           formData.append('thumbnail', thumbnailUrl); // Send manual thumbnail URL
//         } else if (selectedFiles) {
//           for (let i = 0; i < selectedFiles.length; i++) {
//             formData.append('images', selectedFiles[i]);
//           }
//         }

//         await axios.post(`${apiUrl}/galleries`, formData, {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data' 
//           }
//         });
//         alert('Created Successfully!');
//       }

//       resetForm();
//       fetchGalleries();
      
//     } catch (error: any) {
//       alert('Error: ' + (error.response?.data?.error || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userRole');
//     router.push('/admin/login');
//   };

//   return (
//     <div className="min-h-screen bg-[#0f0f0f] text-gray-100 p-8">
//       <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
//         <h1 className="text-3xl font-bold text-[#e62e04]">Admin Dashboard</h1>
//         <div className="flex gap-4">
//           <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white transition-colors">
//             View Site &rarr;
//           </button>
//           <button 
//             onClick={handleLogout}
//             className="bg-[#333] hover:bg-[#444] px-4 py-2 rounded text-sm transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* FORM SECTION */}
//         <div className="lg:col-span-1 bg-[#1a1a1a] p-6 rounded-lg h-fit sticky top-4 border border-[#333]">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className={`text-xl font-bold ${editingId ? 'text-yellow-500' : 'text-blue-500'}`}>
//               {editingId ? 'Edit Content' : 'Add New Content'}
//             </h2>
//             {editingId && (
//               <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white underline">
//                 Cancel
//               </button>
//             )}
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Title Input */}
//             <div>
//               <label className="block text-sm mb-1 text-gray-400">Title</label>
//               <input 
//                 type="text" 
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] outline-none transition-colors"
//                 required
//               />
//             </div>

//             {/* Tags Input */}
//             <div>
//               <label className="block text-sm mb-1 text-gray-400">Tags</label>
//               <input 
//                 type="text" 
//                 value={tags}
//                 onChange={(e) => setTags(e.target.value)}
//                 placeholder="blonde, outdoor, 4k"
//                 className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] outline-none transition-colors"
//               />
//             </div>

//             {/* Type Selector */}
//             {!editingId && (
//               <div>
//                 <label className="block text-sm mb-1 text-gray-400">Type</label>
//                 <div className="flex space-x-4 mt-1">
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input 
//                       type="radio" 
//                       checked={contentType === 'embed'} 
//                       onChange={() => setContentType('embed')}
//                       className="accent-[#e62e04]"
//                     />
//                     <span>Embed</span>
//                   </label>
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input 
//                       type="radio" 
//                       checked={contentType === 'hosted'} 
//                       onChange={() => setContentType('hosted')}
//                       className="accent-[#e62e04]"
//                     />
//                     <span>Upload</span>
//                   </label>
//                 </div>
//               </div>
//             )}

//             {/* CONDITIONAL INPUTS */}
//             {contentType === 'embed' ? (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm mb-1 text-gray-400">Embed Code</label>
//                   <textarea 
//                     value={embedCode}
//                     onChange={(e) => setEmbedCode(e.target.value)}
//                     className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] h-32 text-xs font-mono outline-none transition-colors"
//                     placeholder="<iframe src=...>"
//                   />
//                 </div>
                
//                 {/* Thumbnail Input for Embeds */}
//                 <div>
//                    <label className="block text-sm mb-1 text-gray-400">Thumbnail URL (Optional)</label>
//                    <input 
//                     type="text" 
//                     value={thumbnailUrl}
//                     onChange={(e) => setThumbnailUrl(e.target.value)}
//                     className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] outline-none transition-colors text-sm"
//                     placeholder="https://example.com/image.jpg"
//                   />
//                 </div>
//               </div>
//             ) : (
//               !editingId && (
//                 <div>
//                   <label className="block text-sm mb-1 text-gray-400">Select Images</label>
//                   <input 
//                     type="file" 
//                     multiple
//                     accept="image/*"
//                     onChange={(e) => setSelectedFiles(e.target.files)}
//                     className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-white hover:file:bg-[#444]"
//                   />
//                 </div>
//               )
//             )}

//             <button 
//               type="submit" 
//               disabled={loading}
//               className={`w-full font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#e62e04] hover:bg-red-700'}`}
//             >
//               {loading ? 'Processing...' : (editingId ? 'Update Content' : 'Create Post')}
//             </button>
//           </form>
//         </div>

//         {/* LIST SECTION */}
//         <div className="lg:col-span-2">
//           <h2 className="text-xl font-bold mb-4 text-green-500">Content Library ({galleries.length})</h2>
          
//           <div className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-xl border border-[#333]">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-[#222] text-gray-400 uppercase text-xs font-bold">
//                 <tr>
//                   <th className="px-4 py-3">Title</th>
//                   <th className="px-4 py-3">Type</th>
//                   <th className="px-4 py-3">Views</th>
//                   <th className="px-4 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#333]">
//                 {galleries.map((item) => (
//                   <tr key={item._id} className="hover:bg-[#252525] transition-colors">
//                     <td className="px-4 py-3 font-medium text-gray-200">{item.title}</td>
//                     <td className="px-4 py-3 text-sm">
//                       <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.contentType === 'embed' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'}`}>
//                         {item.contentType}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-500">{item.views}</td>
//                     <td className="px-4 py-3 text-right space-x-3">
//                       <button 
//                         onClick={() => handleEdit(item)}
//                         className="text-yellow-500 hover:text-yellow-400 text-sm font-bold uppercase"
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(item._id)}
//                         className="text-red-500 hover:text-red-400 text-sm font-bold uppercase"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {galleries.length === 0 && (
//               <div className="p-12 text-center text-gray-500">
//                 <p className="text-lg">Library is empty.</p>
//                 <p className="text-sm mt-2">Use the form on the left to add your first content.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Gallery } from '../../../type';

export default function AdminDashboard() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [contentType, setContentType] = useState<'embed' | 'hosted'>('embed');
  const [embedCode, setEmbedCode] = useState('');
  
  // FILES STATE
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // Single file for Embed
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Multiple for Gallery

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchGalleries();
    }
  }, [router]);

  const fetchGalleries = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const { data } = await axios.get(`${apiUrl}/galleries`);
      setGalleries(data.data);
    } catch (error) {
      console.error("Failed to fetch galleries");
    }
  };

  const handleEdit = (item: Gallery) => {
    setEditingId(item._id);
    setTitle(item.title);
    setTags(item.tags.join(', '));
    setContentType(item.contentType);
    setEmbedCode(item.embedCode || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setTags('');
    setEmbedCode('');
    setThumbnailFile(null);
    setSelectedFiles(null);
    setContentType('embed');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');
      
      await axios.delete(`${apiUrl}/galleries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setGalleries(galleries.filter(g => g._id !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('authToken');

      if (editingId) {
        // UPDATE logic (kept simple for now, updates usually don't re-upload files in basic MVPs)
        await axios.put(`${apiUrl}/galleries/${editingId}`, {
          title, tags: tags, contentType, embedCode
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Updated Successfully!');
      } else {
        // --- CREATE LOGIC ---
        const formData = new FormData();
        formData.append('title', title);
        formData.append('tags', tags);
        formData.append('contentType', contentType);
        
        if (contentType === 'embed') {
          formData.append('embedCode', embedCode);
          if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile); // <--- Send Single File
          }
        } else if (selectedFiles) {
          for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('images', selectedFiles[i]); // <--- Send Multiple Files
          }
        }

        await axios.post(`${apiUrl}/galleries`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        });
        alert('Created Successfully!');
      }

      resetForm();
      fetchGalleries();
      
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 p-8">
      <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
        <h1 className="text-3xl font-bold text-[#e62e04]">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white transition-colors">View Site &rarr;</button>
          <button onClick={handleLogout} className="bg-[#333] hover:bg-[#444] px-4 py-2 rounded text-sm transition-colors">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-[#1a1a1a] p-6 rounded-lg h-fit sticky top-4 border border-[#333]">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${editingId ? 'text-yellow-500' : 'text-blue-500'}`}>
              {editingId ? 'Edit Content' : 'Add New Content'}
            </h2>
            {editingId && <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white underline">Cancel</button>}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] outline-none transition-colors" required />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Tags</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="blonde, outdoor" className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] outline-none transition-colors" />
            </div>

            {!editingId && (
              <div>
                <label className="block text-sm mb-1 text-gray-400">Type</label>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={contentType === 'embed'} onChange={() => setContentType('embed')} className="accent-[#e62e04]" />
                    <span>Embed</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={contentType === 'hosted'} onChange={() => setContentType('hosted')} className="accent-[#e62e04]" />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
            )}

            {contentType === 'embed' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Embed Code</label>
                  <textarea value={embedCode} onChange={(e) => setEmbedCode(e.target.value)} className="w-full p-2 bg-[#222] rounded border border-[#333] focus:border-[#e62e04] h-32 text-xs font-mono outline-none transition-colors" placeholder="<iframe src=...>" />
                </div>
                {/* UPLOAD THUMBNAIL FILE */}
                <div>
                   <label className="block text-sm mb-1 text-gray-400">Upload Thumbnail</label>
                   <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-white hover:file:bg-[#444]"
                  />
                </div>
              </div>
            ) : (
              !editingId && (
                <div>
                  <label className="block text-sm mb-1 text-gray-400">Select Images</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => setSelectedFiles(e.target.files)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#333] file:text-white hover:file:bg-[#444]" />
                </div>
              )
            )}

            <button type="submit" disabled={loading} className={`w-full font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 ${editingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#e62e04] hover:bg-red-700'}`}>
              {loading ? 'Processing...' : (editingId ? 'Update Content' : 'Create Post')}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-green-500">Content Library ({galleries.length})</h2>
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-xl border border-[#333]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#222] text-gray-400 uppercase text-xs font-bold">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {galleries.map((item) => (
                  <tr key={item._id} className="hover:bg-[#252525] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-200">{item.title}</td>
                    <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.contentType === 'embed' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'}`}>{item.contentType}</span></td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button onClick={() => handleEdit(item)} className="text-yellow-500 hover:text-yellow-400 text-sm font-bold uppercase">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-400 text-sm font-bold uppercase">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}