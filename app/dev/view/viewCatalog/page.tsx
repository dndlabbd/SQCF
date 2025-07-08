// "use client";

// import React, { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import "/public/styles/home.css";
// import useAuth from "@/hooks/useAuth";
// import { Login } from "@/components/login";
// import Link from "next/link";

// interface CatalogItem {
//   id: string;
//   title: string;
//   description: string;
//   pdfUrl: string; // This will be the Google Drive PDF link
//   pages?: string[];
//   createdAt?: string;
//   status?: string; // Add status field
// }

// const ViewCatalog: NextPage = () => {
//   const { isAuthenticated, login, logout } = useAuth();
//   const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCatalogItems();
//     }
//   }, [isAuthenticated]);

//   const fetchCatalogItems = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/catalog/getCatalog");
//       if (!response.ok) {
//         throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setCatalogItems(data);
//     } catch (error: any) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this catalog item?")) {
//       return;
//     }

//     try {
//       setDeleteLoading(id);
//       const response = await fetch(`/api/catalog/deleteCatalog/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete catalog item: ${response.statusText}`);
//       }

//       // Remove the deleted item from the state
//       setCatalogItems(catalogItems.filter(item => item.id !== id));
//       alert("Catalog item deleted successfully");
//     } catch (error: any) {
//       alert(`Error deleting catalog item: ${error.message}`);
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handleStatusToggle = async (item: CatalogItem) => {
//     try {
//       const newStatus = item.status === 'live' ? 'draft' : 'live';
//       const response = await fetch('/api/catalog/updateCatalogStatus', {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           id: item.id, 
//           status: newStatus
//         })
//       });
      
//       if (response.ok) {
//         // Refresh the catalog to show updated status
//         fetchCatalogItems();
//         alert(`Item ${item.status === 'live' ? 'removed from' : 'made'} live!`);
//       } else {
//         throw new Error('Failed to update status');
//       }
//     } catch (error) {
//       alert('Error updating status');
//     }
//   };

//   const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     logout();
//   };

//   const openPDF = (pdfUrl: string) => {
//     // Convert Google Drive sharing link to direct view link
//     const fileId = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
//     if (fileId) {
//       const directLink = `https://drive.google.com/file/d/${fileId}/view`;
//       window.open(directLink, '_blank');
//     } else {
//       // If it's already a direct link or different format, open as is
//       window.open(pdfUrl, '_blank');
//     }
//   };

//   const renderAuthenticatedContent = () => (
//     <div className="max-w-7xl mx-auto p-8 text-white min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 lg:text-6xl text-4xl font-bold animate-fade-in">
//           Catalog Items
//         </h1>
//         <Link 
//           href="/dev/insertCatalog"
//           className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Back to Insert
//         </Link>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
//         </div>
//       ) : error ? (
//         <div className="backdrop-blur-md bg-red-500/20 rounded-3xl p-8 shadow-2xl border border-red-500/30 text-center">
//           <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading Catalog</h2>
//           <p className="text-red-200">{error}</p>
//           <button 
//             onClick={fetchCatalogItems}
//             className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-[1.02] transition-transform"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : catalogItems.length === 0 ? (
//         <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
//           <h2 className="text-2xl font-bold text-gray-300 mb-4">No Catalog Items Found</h2>
//           <p className="text-gray-400">Upload some catalog items to see them here.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {catalogItems.map((item, index) => (
//             <div 
//               key={item.id || index}
//               className="backdrop-blur-md bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30"
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//                 {/* Item Info */}
//                 <div className="lg:col-span-8">
//                   <h3 className="text-2xl font-bold text-cyan-300 mb-2">{item.title}</h3>
//                   <p className="text-gray-300 mb-4 line-clamp-3">{item.description}</p>

//                   {/* Status Badge */}
//                   <div className="flex items-center space-x-2 mt-2">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       item.status === 'live' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
//                       item.status === 'archived' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' :
//                       'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
//                     }`}>
//                       {item.status?.toUpperCase() || 'DRAFT'}
//                     </span>
//                   </div>

//                   {item.pages && item.pages.length > 0 && (
//                     <div className="text-sm text-gray-400 mt-3">
//                       <span className="font-semibold">Pages:</span> {item.pages.join(", ")}
//                     </div>
//                   )}
//                   {item.createdAt && (
//                     <div className="text-sm text-gray-500 mt-2">
//                       Added: {new Date(item.createdAt).toLocaleDateString()}
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
//                   {/* View PDF Button */}
//                   <button
//                     onClick={() => openPDF(item.pdfUrl)}
//                     className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <span>View PDF</span>
//                   </button>

//                   {/* Live Toggle Button */}
//                   <button
//                     onClick={() => handleStatusToggle(item)}
//                     className={`flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ${
//                       item.status === 'live' 
//                         ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-orange-500/50' 
//                         : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-blue-500/50'
//                     } hover:scale-[1.02] active:scale-[0.98]`}
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
//                     </svg>
//                     <span>{item.status === 'live' ? 'Remove Live' : 'Make Live'}</span>
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     disabled={deleteLoading === item.id}
//                     className={`flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ${
//                       deleteLoading === item.id
//                         ? 'bg-gray-600 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]'
//                     }`}
//                   >
//                     {deleteLoading === item.id ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         <span>Deleting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <span>Delete</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Refresh Button */}
//       <div className="mt-8 text-center">
//         <button
//           onClick={fetchCatalogItems}
//           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Refresh Catalog
//         </button>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
//       >
//         Logout
//       </button>
//     </div>
//   );

//   return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
// };

// export default ViewCatalog;




// "use client";

// import React, { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import "/public/styles/home.css";
// import useAuth from "@/hooks/useAuth";
// import { Login } from "@/components/login";
// import Link from "next/link";

// interface CatalogItem {
//   id: number;
//   serial: string;
//   pdfFileName: string;
//   pdfLocation: string;
//   title: string;
//   uploadedAt: string;
//   uploadedFile?: string;
//   status: string;
// }

// const ViewCatalog: NextPage = () => {
//   const { isAuthenticated, login, logout } = useAuth();
//   const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCatalogItems();
//     }
//   }, [isAuthenticated]);

//   const fetchCatalogItems = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/catalog/getCatalog");
//       if (!response.ok) {
//         throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setCatalogItems(data);
//       setError(null);
//     } catch (error: any) {
//       console.error('Error fetching catalog items:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this catalog item?")) {
//       return;
//     }

//     try {
//       setDeleteLoading(id);
//       const response = await fetch(`/api/catalog/deleteCatalog/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete catalog item: ${response.statusText}`);
//       }

//       // Remove the deleted item from the state
//       setCatalogItems(catalogItems.filter(item => item.id !== id));
//       alert("Catalog item deleted successfully");
//     } catch (error: any) {
//       alert(`Error deleting catalog item: ${error.message}`);
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     logout();
//   };

//   const openPDF = (pdfLocation: string, title: string) => {
//     if (pdfLocation) {
//       // Convert Google Drive share link to direct view link if needed
//       let viewLink = pdfLocation;
//       if (pdfLocation.includes('drive.google.com')) {
//         const fileId = pdfLocation.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
//         if (fileId) {
//           viewLink = `https://drive.google.com/file/d/${fileId}/preview`;
//         }
//       }
//       window.open(viewLink, '_blank');
//     }
//   };

//   const renderAuthenticatedContent = () => (
//     <div className="max-w-7xl mx-auto p-8 text-white min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 lg:text-6xl text-4xl font-bold animate-fade-in">
//           Catalog Items
//         </h1>
//         <Link 
//           href="/dev/insertCatalog"
//           className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Back to Insert
//         </Link>
//       </div>

//       {/* Statistics Panel */}
//       {catalogItems.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="backdrop-blur-md bg-blue-500/20 rounded-2xl p-4 border border-blue-500/30">
//             <div className="text-sm text-blue-300">Total Items</div>
//             <div className="text-2xl font-bold text-blue-100">
//               {catalogItems.length}
//             </div>
//           </div>
//           <div className="backdrop-blur-md bg-green-500/20 rounded-2xl p-4 border border-green-500/30">
//             <div className="text-sm text-green-300">Active Items</div>
//             <div className="text-2xl font-bold text-green-100">
//               {catalogItems.filter(item => item.status === 'active').length}
//             </div>
//           </div>
//           <div className="backdrop-blur-md bg-purple-500/20 rounded-2xl p-4 border border-purple-500/30">
//             <div className="text-sm text-purple-300">Unique Files</div>
//             <div className="text-2xl font-bold text-purple-100">
//               {new Set(catalogItems.map(item => item.uploadedFile)).size}
//             </div>
//           </div>
//           <div className="backdrop-blur-md bg-orange-500/20 rounded-2xl p-4 border border-orange-500/30">
//             <div className="text-sm text-orange-300">Last Upload</div>
//             <div className="text-sm font-medium text-orange-100">
//               {catalogItems.length > 0 
//                 ? new Date(Math.max(...catalogItems.map(item => new Date(item.uploadedAt).getTime()))).toLocaleDateString()
//                 : 'No uploads'
//               }
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
//         </div>
//       ) : error ? (
//         <div className="backdrop-blur-md bg-red-500/20 rounded-3xl p-8 shadow-2xl border border-red-500/30 text-center">
//           <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading Catalog</h2>
//           <p className="text-red-200">{error}</p>
//           <button 
//             onClick={fetchCatalogItems}
//             className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-[1.02] transition-transform"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : catalogItems.length === 0 ? (
//         <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
//           <h2 className="text-2xl font-bold text-gray-300 mb-4">No Catalog Items Found</h2>
//           <p className="text-gray-400">Upload some catalog items to see them here.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {catalogItems.map((item) => (
//             <div 
//               key={item.id}
//               className="backdrop-blur-md bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30"
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//                 {/* Item Info */}
//                 <div className="lg:col-span-8">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <h3 className="text-2xl font-bold text-cyan-300">{item.title}</h3>
//                     <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
//                       #{item.serial}
//                     </span>
//                   </div>
                  
//                   <div className="text-gray-300 mb-4">
//                     <p className="font-medium">PDF File: {item.pdfFileName}</p>
//                   </div>

//                   {/* Status Badge */}
//                   <div className="flex items-center space-x-2 mt-2">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       item.status === 'active' 
//                         ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                         : 'bg-red-500/20 text-red-300 border border-red-500/30'
//                     }`}>
//                       {item.status.toUpperCase()}
//                     </span>
//                   </div>

//                   {/* Upload Info */}
//                   <div className="text-sm text-gray-400 mt-3 space-y-1">
//                     {item.uploadedFile && (
//                       <div>
//                         <span className="font-semibold">Source File:</span> {item.uploadedFile}
//                       </div>
//                     )}
//                     <div>
//                       <span className="font-semibold">Uploaded:</span> {new Date(item.uploadedAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
//                   {/* View PDF Button */}
//                   <button
//                     onClick={() => openPDF(item.pdfLocation, item.title)}
//                     className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <span>View PDF</span>
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     disabled={deleteLoading === item.id}
//                     className={`flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ${
//                       deleteLoading === item.id
//                         ? 'bg-gray-600 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]'
//                     }`}
//                   >
//                     {deleteLoading === item.id ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         <span>Deleting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <span>Delete</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Refresh Button */}
//       <div className="mt-8 text-center">
//         <button
//           onClick={fetchCatalogItems}
//           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Refresh Catalog
//         </button>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
//       >
//         Logout
//       </button>
//     </div>
//   );

//   return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
// };

// export default ViewCatalog;




// "use client";

// import React, { useState, useEffect } from "react";
// import type { NextPage } from "next";
// import "/public/styles/home.css";
// import useAuth from "@/hooks/useAuth";
// import { Login } from "@/components/login";
// import Link from "next/link";

// interface CatalogItem {
//   id: number;
//   serial: string;
//   pdfFileName: string;
//   pdfLocation: string;
//   title: string;
//   uploadedAt: string;
//   uploadedFile?: string;
//   status: string;
// }

// const ViewCatalog: NextPage = () => {
//   const { isAuthenticated, login, logout } = useAuth();
//   const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCatalogItems();
//     }
//   }, [isAuthenticated]);

//   const fetchCatalogItems = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/catalog/getCatalog");
//       if (!response.ok) {
//         throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setCatalogItems(data);
//       setError(null);
//     } catch (error: any) {
//       console.error('Error fetching catalog items:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this catalog item?")) {
//       return;
//     }

//     try {
//       setDeleteLoading(id);
//       const response = await fetch(`/api/catalog/deleteCatalog/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete catalog item: ${response.statusText}`);
//       }

//       // Remove the deleted item from the state
//       setCatalogItems(catalogItems.filter(item => item.id !== id));
//       alert("Catalog item deleted successfully");
//     } catch (error: any) {
//       alert(`Error deleting catalog item: ${error.message}`);
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     logout();
//   };

//   const openPDF = async (pdfLocation: string, title: string, itemId: number) => {
//     if (pdfLocation) {
//       // Check if PDF is already extracted (local path)
//       if (pdfLocation.startsWith('/pdfs/')) {
//         // Open local PDF directly
//         window.open(pdfLocation, '_blank');
//         return;
//       }

//       // If it's still a Google Drive link, try to extract it first
//       if (pdfLocation.includes('drive.google.com')) {
//         try {
//           // Show loading indicator
//           const loadingToast = alert('Extracting PDF... Please wait.');
          
//           // Call extraction API
//           const response = await fetch('/api/catalog/extractPdfs', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ catalogId: itemId })
//           });

//           if (response.ok) {
//             const result = await response.json();
//             // Refresh catalog to get updated PDF path
//             await fetchCatalogItems();
//             // Open the extracted PDF
//             window.open(result.pdfPath, '_blank');
//           } else {
//             throw new Error('Failed to extract PDF');
//           }
//         } catch (error) {
//           console.error('Error extracting PDF:', error);
//           // Fallback to Google Drive link
//           const fileId = pdfLocation.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
//           if (fileId) {
//             const viewLink = `https://drive.google.com/file/d/${fileId}/preview`;
//             window.open(viewLink, '_blank');
//           }
//         }
//       } else {
//         // Direct link, open as is
//         window.open(pdfLocation, '_blank');
//       }
//     }
//   };

//   const renderAuthenticatedContent = () => (
//     <div className="max-w-7xl mx-auto p-8 text-white min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 lg:text-6xl text-4xl font-bold animate-fade-in">
//           Catalog Items
//         </h1>
//         <Link 
//           href="/dev/insertCatalog"
//           className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Back to Insert
//         </Link>
//       </div>

//       {/* Statistics Panel */}
//       {catalogItems.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="backdrop-blur-md bg-blue-500/20 rounded-2xl p-4 border border-blue-500/30">
//             <div className="text-sm text-blue-300">Total Items</div>
//             <div className="text-2xl font-bold text-blue-100">
//               {catalogItems.length}
//             </div>
//           </div>
//           <div className="backdrop-blur-md bg-green-500/20 rounded-2xl p-4 border border-green-500/30">
//             <div className="text-sm text-green-300">Active Items</div>
//             <div className="text-2xl font-bold text-green-100">
//               {catalogItems.filter(item => item.status === 'active').length}
//             </div>
//           </div>
//           <div className="backdrop-blur-md bg-purple-500/20 rounded-2xl p-4 border border-purple-500/30">
//             <div className="text-sm text-purple-300">Unique Files</div>
//             <div className="text-2xl font-bold text-purple-100">
//               {new Set(catalogItems.map(item => item.uploadedFile)).size}
//             </div>
//           </div>
//           <div className="backdrop-blur-md bg-orange-500/20 rounded-2xl p-4 border border-orange-500/30">
//             <div className="text-sm text-orange-300">Last Upload</div>
//             <div className="text-sm font-medium text-orange-100">
//               {catalogItems.length > 0 
//                 ? new Date(Math.max(...catalogItems.map(item => new Date(item.uploadedAt).getTime()))).toLocaleDateString()
//                 : 'No uploads'
//               }
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
//         </div>
//       ) : error ? (
//         <div className="backdrop-blur-md bg-red-500/20 rounded-3xl p-8 shadow-2xl border border-red-500/30 text-center">
//           <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading Catalog</h2>
//           <p className="text-red-200">{error}</p>
//           <button 
//             onClick={fetchCatalogItems}
//             className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-[1.02] transition-transform"
//           >
//             Try Again
//           </button>
//         </div>
//       ) : catalogItems.length === 0 ? (
//         <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
//           <h2 className="text-2xl font-bold text-gray-300 mb-4">No Catalog Items Found</h2>
//           <p className="text-gray-400">Upload some catalog items to see them here.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {catalogItems.map((item) => (
//             <div 
//               key={item.id}
//               className="backdrop-blur-md bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30"
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
//                 {/* Item Info */}
//                 <div className="lg:col-span-8">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <h3 className="text-2xl font-bold text-cyan-300">{item.title}</h3>
//                     <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
//                       #{item.serial}
//                     </span>
//                   </div>
                  
//                   <div className="text-gray-300 mb-4">
//                     <p className="font-medium">PDF File: {item.pdfFileName}</p>
//                   </div>

//                   {/* Status Badge */}
//                   <div className="flex items-center space-x-2 mt-2">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       item.status === 'active' 
//                         ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
//                         : 'bg-red-500/20 text-red-300 border border-red-500/30'
//                     }`}>
//                       {item.status.toUpperCase()}
//                     </span>
//                   </div>

//                   {/* Upload Info */}
//                   <div className="text-sm text-gray-400 mt-3 space-y-1">
//                     {item.uploadedFile && (
//                       <div>
//                         <span className="font-semibold">Source File:</span> {item.uploadedFile}
//                       </div>
//                     )}
//                     <div>
//                       <span className="font-semibold">Uploaded:</span> {new Date(item.uploadedAt).toLocaleDateString()}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
//                   {/* View PDF Button */}
//                   <button
//                     onClick={() => openPDF(item.pdfLocation, item.title, item.id)}
//                     className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                     </svg>
//                     <span>{item.pdfLocation?.startsWith('/pdfs/') ? 'View PDF' : 'Extract & View PDF'}</span>
//                   </button>

//                   {/* Delete Button */}
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     disabled={deleteLoading === item.id}
//                     className={`flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ${
//                       deleteLoading === item.id
//                         ? 'bg-gray-600 cursor-not-allowed'
//                         : 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]'
//                     }`}
//                   >
//                     {deleteLoading === item.id ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         <span>Deleting...</span>
//                       </>
//                     ) : (
//                       <>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         <span>Delete</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Refresh Button */}
//       <div className="mt-8 text-center">
//         <button
//           onClick={fetchCatalogItems}
//           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
//         >
//           Refresh Catalog
//         </button>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
//       >
//         Logout
//       </button>
//     </div>
//   );

//   return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
// };
// export default ViewCatalog;


"use client";

import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Link from "next/link";

interface CatalogItem {
  id: number;
  serial: string;
  pdfFileName: string;
  pdfLocation: string;
  originalPdfLocation?: string;
  title: string;
  uploadedAt: string;
  uploadedFile?: string;
  status: string;
  extractionStatus?: 'original' | 'extracted' | 'failed';
}

const ViewCatalog: NextPage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCatalogItems();
    }
  }, [isAuthenticated]);

  const fetchCatalogItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/catalog/getCatalog");
      if (!response.ok) {
        throw new Error(`Failed to fetch catalog items: ${response.statusText}`);
      }
      const data = await response.json();
      setCatalogItems(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching catalog items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this catalog item?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/catalog/deleteCatalog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete catalog item: ${response.statusText}`);
      }

      // Remove the deleted item from the state
      setCatalogItems(catalogItems.filter(item => item.id !== id));
      alert("Catalog item deleted successfully");
    } catch (error: any) {
      alert(`Error deleting catalog item: ${error.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  const openPDF = (item: CatalogItem) => {
    // If PDF is already extracted and stored locally, open it directly
    if (item.pdfLocation.startsWith('/pdfs/')) {
      window.open(item.pdfLocation, '_blank');
      return;
    }

    // If extraction failed, try to open original URL
    if (item.extractionStatus === 'failed' && item.originalPdfLocation) {
      const fileId = item.originalPdfLocation.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        const viewLink = `https://drive.google.com/file/d/${fileId}/preview`;
        window.open(viewLink, '_blank');
      } else {
        window.open(item.originalPdfLocation, '_blank');
      }
      return;
    }

    // For any other case, try to open the pdfLocation directly
    window.open(item.pdfLocation, '_blank');
  };

  const getExtractionStatusBadge = (status?: string) => {
    switch (status) {
      case 'extracted':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
            📄 EXTRACTED
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            ⚠️ EXTRACTION FAILED
          </span>
        );
      case 'original':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            🔗 ORIGINAL LINK
          </span>
        );
      default:
        return null;
    }
  };

  const renderAuthenticatedContent = () => (
    <div className="max-w-7xl mx-auto p-8 text-white min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 lg:text-6xl text-4xl font-bold animate-fade-in">
          Catalog Items
        </h1>
        <Link 
          href="/dev/insertCatalog"
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to Insert
        </Link>
      </div>

      {/* Statistics Panel */}
      {catalogItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="backdrop-blur-md bg-blue-500/20 rounded-2xl p-4 border border-blue-500/30">
            <div className="text-sm text-blue-300">Total Items</div>
            <div className="text-2xl font-bold text-blue-100">
              {catalogItems.length}
            </div>
          </div>
          <div className="backdrop-blur-md bg-green-500/20 rounded-2xl p-4 border border-green-500/30">
            <div className="text-sm text-green-300">Extracted PDFs</div>
            <div className="text-2xl font-bold text-green-100">
              {catalogItems.filter(item => item.extractionStatus === 'extracted').length}
            </div>
          </div>
          <div className="backdrop-blur-md bg-yellow-500/20 rounded-2xl p-4 border border-yellow-500/30">
            <div className="text-sm text-yellow-300">Failed Extractions</div>
            <div className="text-2xl font-bold text-yellow-100">
              {catalogItems.filter(item => item.extractionStatus === 'failed').length}
            </div>
          </div>
          <div className="backdrop-blur-md bg-purple-500/20 rounded-2xl p-4 border border-purple-500/30">
            <div className="text-sm text-purple-300">Active Items</div>
            <div className="text-2xl font-bold text-purple-100">
              {catalogItems.filter(item => item.status === 'active').length}
            </div>
          </div>
          <div className="backdrop-blur-md bg-orange-500/20 rounded-2xl p-4 border border-orange-500/30">
            <div className="text-sm text-orange-300">Last Upload</div>
            <div className="text-sm font-medium text-orange-100">
              {catalogItems.length > 0 
                ? new Date(Math.max(...catalogItems.map(item => new Date(item.uploadedAt).getTime()))).toLocaleDateString()
                : 'No uploads'
              }
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
        </div>
      ) : error ? (
        <div className="backdrop-blur-md bg-red-500/20 rounded-3xl p-8 shadow-2xl border border-red-500/30 text-center">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading Catalog</h2>
          <p className="text-red-200">{error}</p>
          <button 
            onClick={fetchCatalogItems}
            className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:scale-[1.02] transition-transform"
          >
            Try Again
          </button>
        </div>
      ) : catalogItems.length === 0 ? (
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 text-center">
          <h2 className="text-2xl font-bold text-gray-300 mb-4">No Catalog Items Found</h2>
          <p className="text-gray-400">Upload some catalog items to see them here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {catalogItems.map((item) => (
            <div 
              key={item.id}
              className="backdrop-blur-md bg-white/10 rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Item Info */}
                <div className="lg:col-span-8">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-cyan-300">{item.title}</h3>
                    <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      #{item.serial}
                    </span>
                  </div>
                  
                  <div className="text-gray-300 mb-4">
                    <p className="font-medium">PDF File: {item.pdfFileName}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'active' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                    {getExtractionStatusBadge(item.extractionStatus)}
                  </div>

                  {/* Upload Info */}
                  <div className="text-sm text-gray-400 mt-3 space-y-1">
                    {item.uploadedFile && (
                      <div>
                        <span className="font-semibold">Source File:</span> {item.uploadedFile}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Uploaded:</span> {new Date(item.uploadedAt).toLocaleDateString()}
                    </div>
                    {item.extractionStatus === 'failed' && (
                      <div className="text-yellow-300">
                        <span className="font-semibold">Note:</span> PDF extraction failed, will open original link
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                  {/* View PDF Button */}
                  <button
                    onClick={() => openPDF(item)}
                    className={`flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      item.pdfLocation.startsWith('/pdfs/')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-blue-500/50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>
                      {item.pdfLocation.startsWith('/pdfs/') ? 'Open PDF' : 'View PDF'}
                    </span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteLoading === item.id}
                    className={`flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 ${
                      deleteLoading === item.id
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {deleteLoading === item.id ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchCatalogItems}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          Refresh Catalog
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
      >
        Logout
      </button>
    </div>
  );

  return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
};

export default ViewCatalog;