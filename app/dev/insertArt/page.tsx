"use client";

import React, { ChangeEvent, useState } from 'react';
import type { NextPage } from "next";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Papa from 'papaparse';
import Link from 'next/link';

const AddArt: NextPage = () => {
  const { isAuthenticated, login, logout } = useAuth();

  // Automated System

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('paintings');
  const [isUploading, setIsUploading] = useState(false);

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  interface CsvRow {
    'Title (English)': string;
    'Title (Bangla)': string;
    'Description': string;
    'Year (English)': string;
    'Year (Bangla)': string;
    'Image name': string;
    'Measurement': string;
    'Measurement (Bangla)': string;
    'Medium (English)': string;
    'Medium (Bangla)': string;
    'Type': string;
    'Publication': string;
    'Image ULR': string;
    'Tags (English)': string;
    'Tags (Bangla)': string;
    [key: string]: string;
  }

  // Changing uploaded file name
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setFileName(file.name); // Update the fileName state with the name of the file
      console.log(file.name)
    } else {
      // Reset the selected file and file name if no file is selected
      setSelectedFile(null);
      setFileName('No Supported File Uploaded'); // Clear the fileName if no file is selected
    }
  };

  // Logout
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  // Upload Function
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }
    setIsUploading(true);
    // ...existing upload logic...
    try {
      const readFile = (file: File): Promise<string | ArrayBuffer> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            // Check for the result and ensure it's not undefined. If undefined, resolve to an empty string as a fallback.
            const result = e.target?.result;
            resolve(result ?? "");
          };
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

      try {
        const text = await readFile(selectedFile);
        let errorOccurred = false;

        if (typeof text === "string") {
          Papa.parse<CsvRow>(text, {
            header: true, // Now treating the first row as headers
            skipEmptyLines: true,
            complete: async (result) => {
              const transformedData = result.data.map((row) => {
                const imageUrl = `https://sqcf.s3.ap-southeast-1.amazonaws.com/${selectedCategory}/${row["Image File Name"]}`;

                return {
                  title: row["Title in English"],
                  title_Bangla: row["Title in Bangla"],
                  year: row["Year in English"],
                  year_Bangla: row["Year in Bangla"],
                  type: selectedCategory,
                  description: row["Description"] ?? "",
                  imageUrl,
                  measurement: row["Measurement in English"] ?? "",
                  measurement_Bangla: row["Measurement in Bangla"] ?? "",
                  medium: row["Media in English"],
                  medium_Bangla: row["Media in Bangla"],
                  publication: row["Publication"] ?? "",
                  tags:
                    row["Tags in English"]
                      .split(",")
                      .map((tag) => tag.trim()) ?? [],
                  tags_Bangla:
                    row["Tags in Bangla"].split(",").map((tag) => tag.trim()) ??
                    [],
                };
              });

              for (const data of transformedData) {
                try {
                  const response = await fetch("/api/addArt", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });

                  if (!response.ok) {
                    errorOccurred = true;
                    throw new Error(
                      `Failed to add artwork: ${response.statusText}`
                    );
                  }

                  console.log("Artwork added successfully", data);
                } catch (error: any) {
                  console.error("Error adding artwork:", error);
                  alert(`Error adding artwork: ${error.message}`);
                  return; // Early return on first error
                }
              }

              if (!errorOccurred) {
                alert("All artwork uploaded to database successfully");
              }
            },
          });
        }
      } catch (error: any) {
        console.error("Error reading file:", error);
        alert(`Error reading file: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };


  const renderAuthenticatedContent = () => (
    <div className="max-w-6xl mx-auto p-8 text-white min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 lg:text-6xl text-4xl font-bold text-center mb-16 animate-fade-in">
        Upload Artwork
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
              <span>Select CSV File</span>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            
            {fileName && (
              <div className="mt-4 p-4 rounded-lg bg-white/10 border border-white/20">
                <p className="text-lg text-gray-200 truncate">{fileName}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <label className="text-lg font-medium text-gray-200">Category:</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full bg-gray-800 text-gray-100 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            >
              <option value="paintings" className="bg-gray-800">Paintings</option>
              <option value="drawings" className="bg-gray-800">Drawings</option>
              <option value="sketches" className="bg-gray-800">Sketches</option>
              <option value="layouts" className="bg-gray-800">Layouts of Paintings</option>
              <option value="prints" className="bg-gray-800">Prints</option>
            </select>
          </div>

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
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload to Database</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { href: "/dev/view", text: "VIEW DATA", className: "from-indigo-600 to-blue-600" },
          { href: "/dev/insertWritings", text: "INSERT WRITINGS", className: "from-green-600 to-teal-600" },
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

export default AddArt;
