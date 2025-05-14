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
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  // Upload Function
  const handleSubmit2 = async () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    } else {
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
    }
  };


  if (isAuthenticated) {
    return (
      <div style={{ padding: "20px" }} className='text-white mt-8'>
        {/* Automated Submission */}

        <div className="lg:grid-cols-2 grid-cols-1 flex flex-col lg:gap-y-6 gap-y-4 items-center justify-center text-black">
          <h1 className="text-white text-4xl font-bold text-center">Automated using csv file</h1>
          <div className='text-white text-xl'>{fileName ? fileName : 'No File Uploaded'}</div> {/* Display the uploaded file name */}
          <div className="flex flex-row gap-x-4 items-center justify-center">
            <label className="bg-orange-200 p-2 rounded-sm border border-black w-[10em] cursor-pointer text-center my-auto">
              Upload
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            <button
              className="bg-rose-300 p-2 rounded-sm border border-black w-[10em] text-center mb-2"
              type="button" // Changed to type="button" to prevent form submission
              style={{ marginTop: "10px" }}
              onClick={handleSubmit2}
            >
              Submit
            </button>
          </div>
        </div>

        <div className='flex flex-row items-center justify-center my-4'>
          <label htmlFor="category-select">Choose a category:</label>
          <select className='text-black bg-pink-100 mx-2 rounded p-1 border-black border' id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="paintings">Painting</option>
            <option value="drawings">Drawings</option>
            <option value="sketches">Sketches</option>
            <option value="layouts">Layout of Paintings</option>
            <option value="prints">Prints</option>
          </select>
        </div>

        <div className='p-4'>
            <div className='text-center pb-4 pt-8'>
                <Link href="/dev/view"
                className='text-xl font-bold custom-font bg-indigo-800 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
                >VIEW DATA</Link>
            </div>

            <div className='text-center pb-4 pt-8'>
                <Link href="/dev/insertWritings"
                className='text-xl font-bold custom-font bg-green-800 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
                >INSERT Writings</Link>
            </div>

            <div className='text-center pb-4 pt-8'>
                <Link href="/dev/insertGraphics"
                className='text-xl font-bold custom-font bg-green-600 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
                >INSERT Graphics Design</Link>
            </div>

        </div>

        {/* Logout */}

        <div className="fixed right-0 lg:mt-0 mt-4 bottom-0 mr-8">
          <button
            className="bg-rose-800 text-white px-4 py-2 rounded-sm border border-black transform mb-4 w-full"
            onClick={handleSubmit}
          >
            Logout
          </button>
        </div>
      </div>
    );
  } else {
    return <Login onLogin={login} />;
  }
};

export default AddArt;
