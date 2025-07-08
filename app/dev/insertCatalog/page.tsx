// "use client";

// import React, { ChangeEvent, useState } from "react";
// import type { NextPage } from "next";
// import "/public/styles/home.css";
// import useAuth from "@/hooks/useAuth";
// import { Login } from "@/components/login";
// import Papa from "papaparse";
// import Link from "next/link";

// const InsertCatalog: NextPage = () => {
//   const { isAuthenticated, login, logout } = useAuth();

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [fileName, setFileName] = useState<string>("");
//   const [isUploading, setIsUploading] = useState(false);

//   // CSV columns: Title, Description, PDF, Pages (optional, comma-separated)
//   interface CsvRow {
//     Title: string;
//     Description: string;
//     PDF: string;
//     Pages?: string;
//     [key: string]: string | undefined;
//   }

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       setSelectedFile(file);
//       setFileName(file.name);
//     } else {
//       setSelectedFile(null);
//       setFileName("No Supported File Uploaded");
//     }
//   };

//   const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     logout();
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       alert("Please upload a file first.");
//       return;
//     }
//     setIsUploading(true);

//     try {
//       const readFile = (file: File): Promise<string | ArrayBuffer> =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = (e: ProgressEvent<FileReader>) => {
//             const result = e.target?.result;
//             resolve(result ?? "");
//           };
//           reader.onerror = (e) => reject(e);
//           reader.readAsText(file);
//         });

//       const text = await readFile(selectedFile);
//       let errorOccurred = false;

//       if (typeof text === "string") {
//         Papa.parse<CsvRow>(text, {
//           header: true,
//           skipEmptyLines: true,
//           complete: async (result) => {
//             const transformedData = result.data
//               .map((row) => ({
//                 title: row["Title"]?.trim() ?? "",
//                 description: row["Description"]?.trim() ?? "",
//                 pdfUrl: row["PDF"]?.trim() ?? "",
//                 pages: row["Pages"]
//                   ? row["Pages"].split(",").map((url) => url.trim()).filter(Boolean)
//                   : [],
//               }))
//               .filter(item => item.title && item.description); // Only keep valid rows

//             console.log("Transformed Data:", transformedData);

//             for (const data of transformedData) {
//               try {
//                 const response = await fetch("/api/catalog/addCatalog", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify(data),
//                 });

//                 if (!response.ok) {
//                   errorOccurred = true;
//                   const errorText = await response.text();
//                   throw new Error(
//                     `Failed to add catalog item: ${response.statusText} - ${errorText}`
//                   );
//                 }
//               } catch (error: any) {
//                 alert(`Error adding catalog item: ${error.message}`);
//                 return;
//               }
//             }

//             if (!errorOccurred) {
//               alert("All catalog items uploaded successfully");
//             }
//           },
//         });
//       }
//     } catch (error: any) {
//       alert(`Error reading file: ${error.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const renderAuthenticatedContent = () => (
//     <div className="max-w-6xl mx-auto p-8 text-white min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 lg:text-6xl text-4xl font-bold text-center mb-16 animate-fade-in">
//         Upload Catalog Items
//       </h1>

//       <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-orange-500/10">
//         <div className="flex flex-col space-y-8">
//           <div className="relative group">
//             <label
//               htmlFor="file-upload"
//               className="flex items-center justify-center space-x-4 cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//               </svg>
//               <span>Select Catalog CSV File</span>
//               <input
//                 id="file-upload"
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//             {fileName && (
//               <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20">
//                 <p className="text-lg text-gray-200 truncate">{fileName}</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={isUploading || !selectedFile}
//             className={`flex items-center justify-center space-x-2 py-4 px-8 rounded-xl font-semibold shadow-lg transition-all duration-300
//               ${isUploading || !selectedFile 
//                 ? 'bg-gray-600 cursor-not-allowed' 
//                 : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]'
//               }`}
//           >
//             {isUploading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Uploading...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                 </svg>
//                 <span>Upload to Catalog</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {[
//           { href: "/dev/view", text: "VIEW DATA", className: "from-indigo-600 to-blue-600" },
//           { href: "/dev/view/viewCatalog", text: "VIEW CATALOG", className: "from-cyan-600 to-blue-600" },
//           { href: "/dev/insertArt", text: "INSERT ART", className: "from-green-600 to-teal-600" },
//           { href: "/dev/insertGraphics", text: "INSERT GRAPHICS", className: "from-pink-600 to-rose-600" },
//           { href: "/dev/insertTaheraKhanam", text: "INSERT TAHERA KHANAM", className: "from-purple-600 to-fuchsia-600" }
//         ].map((link) => (
//           <Link
//             key={link.href}
//             href={link.href}
//             className={`bg-gradient-to-r ${link.className} text-white rounded-xl p-6 text-center font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`}
//           >
//             {link.text}
//           </Link>
//         ))}
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

// export default InsertCatalog;


// "use client";

// import React, { ChangeEvent, useState } from "react";
// import type { NextPage } from "next";
// import "/public/styles/home.css";
// import useAuth from "@/hooks/useAuth";
// import { Login } from "@/components/login";
// import Papa from "papaparse";
// import Link from "next/link";

// const InsertCatalog: NextPage = () => {
//   const { isAuthenticated, login, logout } = useAuth();

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [fileName, setFileName] = useState<string>("");
//   const [isUploading, setIsUploading] = useState(false);

//   // CSV columns: Title, Description, PDF, Pages (optional, comma-separated)
//   interface CsvRow {
//     Title: string;
//     Description: string;
//     PDF: string;
//     Pages?: string;
//     [key: string]: string | undefined;
//   }

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;
//     if (file) {
//       setSelectedFile(file);
//       setFileName(file.name);
//     } else {
//       setSelectedFile(null);
//       setFileName("No Supported File Uploaded");
//     }
//   };

//   const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     logout();
//   };

//   const handleSubmit = async () => {
//     if (!selectedFile) {
//       alert("Please upload a file first.");
//       return;
//     }
//     setIsUploading(true);

//     try {
//       const readFile = (file: File): Promise<string | ArrayBuffer> =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = (e: ProgressEvent<FileReader>) => {
//             const result = e.target?.result;
//             resolve(result ?? "");
//           };
//           reader.onerror = (e) => reject(e);
//           reader.readAsText(file);
//         });

//       const text = await readFile(selectedFile);
//       let errorOccurred = false;

//       if (typeof text === "string") {
//         Papa.parse<CsvRow>(text, {
//           header: true,
//           skipEmptyLines: true,
//           complete: async (result) => {
//             const transformedData = result.data
//               .map((row) => ({
//                 title: row["Title"]?.trim() ?? "",
//                 description: row["Description"]?.trim() ?? "",
//                 pdfUrl: row["PDF"]?.trim() ?? "",
//                 pages: row["Pages"]
//                   ? row["Pages"].split(",").map((url) => url.trim()).filter(Boolean)
//                   : [],
//               }))
//               .filter(item => item.title && item.description); // Only keep valid rows

//             console.log("Transformed Data:", transformedData);

//             for (const data of transformedData) {
//               try {
//                 const response = await fetch("/api/catalog/addCatalog", {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify(data),
//                 });

//                 if (!response.ok) {
//                   errorOccurred = true;
//                   const errorText = await response.text();
//                   throw new Error(
//                     `Failed to add catalog item: ${response.statusText} - ${errorText}`
//                   );
//                 }
//               } catch (error: any) {
//                 alert(`Error adding catalog item: ${error.message}`);
//                 return;
//               }
//             }

//             if (!errorOccurred) {
//               alert("All catalog items uploaded successfully");
//             }
//           },
//         });
//       }
//     } catch (error: any) {
//       alert(`Error reading file: ${error.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const renderAuthenticatedContent = () => (
//     <div className="max-w-6xl mx-auto p-8 text-white min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 lg:text-6xl text-4xl font-bold text-center mb-16 animate-fade-in">
//         Upload Catalog Items
//       </h1>

//       <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-orange-500/10">
//         <div className="flex flex-col space-y-8">
//           <div className="relative group">
//             <label
//               htmlFor="file-upload"
//               className="flex items-center justify-center space-x-4 cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//               </svg>
//               <span>Select Catalog CSV File</span>
//               <input
//                 id="file-upload"
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />
//             </label>
//             {fileName && (
//               <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20">
//                 <p className="text-lg text-gray-200 truncate">{fileName}</p>
//               </div>
//             )}
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={isUploading || !selectedFile}
//             className={`flex items-center justify-center space-x-2 py-4 px-8 rounded-xl font-semibold shadow-lg transition-all duration-300
//               ${isUploading || !selectedFile 
//                 ? 'bg-gray-600 cursor-not-allowed' 
//                 : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]'
//               }`}
//           >
//             {isUploading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span>Uploading...</span>
//               </>
//             ) : (
//               <>
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                 </svg>
//                 <span>Upload to Catalog</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {[
//           { href: "/dev/view", text: "VIEW DATA", className: "from-indigo-600 to-blue-600" },
//           { href: "/dev/view/viewCatalog", text: "VIEW CATALOG", className: "from-cyan-600 to-blue-600" },
//           { href: "/dev/insertArt", text: "INSERT ART", className: "from-green-600 to-teal-600" },
//           { href: "/dev/insertGraphics", text: "INSERT GRAPHICS", className: "from-pink-600 to-rose-600" },
//           { href: "/dev/insertTaheraKhanam", text: "INSERT TAHERA KHANAM", className: "from-purple-600 to-fuchsia-600" }
//         ].map((link) => (
//           <Link
//             key={link.href}
//             href={link.href}
//             className={`bg-gradient-to-r ${link.className} text-white rounded-xl p-6 text-center font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`}
//           >
//             {link.text}
//           </Link>
//         ))}
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

// export default InsertCatalog;





"use client";

import React, { ChangeEvent, useState, useRef } from "react";
import type { NextPage } from "next";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface UploadResponse {
  success: boolean;
  message: string;
  itemsAdded: number;
  duplicatesSkipped: number;
  totalItems: number;
  fileName: string;
  duplicates?: Array<{
    serial: string;
    pdfFileName: string;
    title: string;
  }>;
}

const InsertCatalog: NextPage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setFileName(file.name);
        setError(null);
      } else {
        setError('Please select a CSV file');
        setSelectedFile(null);
        setFileName("No Supported File Uploaded");
      }
    } else {
      setSelectedFile(null);
      setFileName("No Supported File Uploaded");
    }
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
    setFileName("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setUploadProgress("Preparing upload...");

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setUploadProgress("Uploading CSV file...");
      const response = await fetch('/api/catalog/addCatalog', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadProgress("Upload successful!");
        setUploadHistory(prev => [result, ...prev]);
        clearFileInput();
        
        // Enhanced success message
        const successMessage = `Upload successful!\n• ${result.itemsAdded} items added\n• ${result.duplicatesSkipped} duplicates skipped\n• Total items in catalog: ${result.totalItems}`;
        alert(successMessage);
        
        // Auto-redirect to view catalog after successful upload
        setTimeout(() => {
          router.push('/dev/view/viewCatalog');
        }, 2000);
      } else {
        setError(result.error || 'Upload failed');
        setUploadProgress("");
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError('Network error. Please try again.');
      setUploadProgress("");
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const validateCSVFormat = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        if (lines.length < 2) {
          resolve(false);
          return;
        }
        
        const headers = lines[0].toLowerCase().trim();
        const expectedHeaders = ['serial', 'pdf file name', 'pdf location', 'title'];
        const hasAllHeaders = expectedHeaders.every(header => 
          headers.includes(header.toLowerCase())
        );
        
        resolve(hasAllHeaders);
      };
      reader.readAsText(file);
    });
  };

  const handleFileValidation = async (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const isValidFormat = await validateCSVFormat(file);
      if (!isValidFormat) {
        setError('CSV file must contain columns: Serial, Pdf File Name, Pdf Location, Title');
        return false;
      }
      return true;
    }
    return false;
  };

  const renderAuthenticatedContent = () => (
    <div className="max-w-6xl mx-auto p-8 text-white min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 lg:text-6xl text-4xl font-bold text-center mb-16 animate-fade-in">
        Upload Catalog Items
      </h1>

      <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-orange-500/10">
        <div className="flex flex-col space-y-8">
          <div className="relative group">
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center space-x-4 cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Select Catalog CSV File</span>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {fileName && (
              <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20">
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-200 truncate">{fileName}</p>
                  <button
                    onClick={clearFileInput}
                    className="ml-4 text-red-400 hover:text-red-300 transition-colors"
                    title="Clear file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200">❌ {error}</p>
            </div>
          )}

          {uploadProgress && (
            <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-blue-200">📤 {uploadProgress}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile}
            className={`flex items-center justify-center space-x-2 py-4 px-8 rounded-xl font-semibold shadow-lg transition-all duration-300
              ${isUploading || !selectedFile 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload to Catalog</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload History */}
      {uploadHistory.length > 0 && (
        <div className="mt-8 backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300 mb-6">
            Upload History
          </h2>
          <div className="space-y-4">
            {uploadHistory.map((upload, index) => (
              <div 
                key={index} 
                className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-white text-lg">
                    {upload.fileName}
                  </h3>
                  <span className="text-xs text-gray-400">
                    Just now
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="bg-green-500/20 rounded-lg p-3 text-center">
                    <div className="text-green-300 font-medium">Items Added</div>
                    <div className="text-green-100 text-lg font-bold">
                      {upload.itemsAdded}
                    </div>
                  </div>
                  <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                    <div className="text-yellow-300 font-medium">Duplicates</div>
                    <div className="text-yellow-100 text-lg font-bold">
                      {upload.duplicatesSkipped}
                    </div>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                    <div className="text-blue-300 font-medium">Total Items</div>
                    <div className="text-blue-100 text-lg font-bold">
                      {upload.totalItems}
                    </div>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-3 text-center">
                    <div className="text-green-300 font-medium">Status</div>
                    <div className="text-green-100 text-lg font-bold">✅ Success</div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3">
                  {upload.message}
                </p>
                
                {upload.duplicates && upload.duplicates.length > 0 && (
                  <details className="mt-3">
                    <summary className="text-sm text-yellow-300 cursor-pointer hover:text-yellow-200">
                      View duplicates ({upload.duplicates.length})
                    </summary>
                    <div className="mt-2 pl-4 border-l-2 border-yellow-500/50 bg-yellow-500/10 rounded-r-lg p-3">
                      {upload.duplicates.map((dup, i) => (
                        <div key={i} className="text-xs text-gray-300 mb-1">
                          Serial: {dup.serial} - {dup.title}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Instructions */}
      <div className="mt-8 backdrop-blur-md bg-blue-500/10 rounded-3xl p-6 shadow-2xl border border-blue-500/20">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-4">
          📋 CSV Format Instructions
        </h3>
        <div className="text-sm text-gray-300 space-y-3">
          <p>Your CSV file must have these exact columns (case-sensitive):</p>
          <code className="block bg-white/10 p-3 rounded-lg text-xs font-mono border border-white/20">
            Serial,Pdf File Name,Pdf Location,Title
          </code>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Requirements:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                <li>Serial: Unique identifier (numbers or text)</li>
                <li>Pdf File Name: Name of the PDF file</li>
                <li>Pdf Location: Google Drive shareable link</li>
                <li>Title: Descriptive title for the document</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-300 mb-2">Features:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                <li>Auto-detects and skips duplicates</li>
                <li>Extracts PDFs from Google Drive</li>
                <li>Builds comprehensive catalog</li>
                <li>Supports multiple CSV uploads</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { href: "/dev/view", text: "VIEW DATA", className: "from-indigo-600 to-blue-600" },
          { href: "/dev/view/viewCatalog", text: "VIEW CATALOG", className: "from-cyan-600 to-blue-600" },
          { href: "/dev/insertArt", text: "INSERT ART", className: "from-green-600 to-teal-600" },
          { href: "/dev/insertGraphics", text: "INSERT GRAPHICS", className: "from-pink-600 to-rose-600" },
          { href: "/dev/insertTaheraKhanam", text: "INSERT TAHERA KHANAM", className: "from-purple-600 to-fuchsia-600" }
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`bg-gradient-to-r ${link.className} text-white rounded-xl p-6 text-center font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]`}
          >
            {link.text}
          </Link>
        ))}
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

export default InsertCatalog;