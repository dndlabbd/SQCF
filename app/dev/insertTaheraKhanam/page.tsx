"use client";

import React, { ChangeEvent, useState } from 'react';
import type { NextPage } from "next";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Papa from 'papaparse';
import Link from 'next/link';

const AddTaheraKhanam: NextPage = () => {
  const { isAuthenticated, login, logout } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('paintings');

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  interface CsvRow {
    'Title in English': string;
    'Title in Bangla': string;
    'Description': string;
    'Year in English': string;
    'Year in Bangla': string;
    'Image File Name': string;
    'Measurement in English': string;
    'Measurement in Bangla': string;
    'Media in English': string;
    'Media in Bangla': string;
    'Tags in English': string;
    'Tags in Bangla': string;
    'Publication': string;
    [key: string]: string;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      console.log(file.name)
    } else {
      setSelectedFile(null);
      setFileName('No Supported File Uploaded');
    }
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }

    const readFile = (file: File): Promise<string | ArrayBuffer> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
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
          header: true,
          skipEmptyLines: true,
          complete: async (result) => {
            const transformedData = result.data.map((row) => {
              const imageUrl = `https://sqcf.s3.ap-southeast-1.amazonaws.com/tahera-khanam/${selectedCategory}/${row["Image File Name"]}`;

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
                tags: row["Tags in English"]?.split(",").map((tag) => tag.trim()) ?? [],
                tags_Bangla: row["Tags in Bangla"]?.split(",").map((tag) => tag.trim()) ?? [],
              };
            });

            for (const data of transformedData) {
              try {
                const response = await fetch("/api/addTaheraKhanam", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });

                if (!response.ok) {
                  errorOccurred = true;
                  throw new Error(`Failed to add content: ${response.statusText}`);
                }

                console.log("Content added successfully", data);
              } catch (error: any) {
                console.error("Error adding content:", error);
                alert(`Error adding content: ${error.message}`);
                return;
              }
            }

            if (!errorOccurred) {
              alert("All content uploaded to database successfully");
            }
          },
        });
      }
    } catch (error: any) {
      console.error("Error reading file:", error);
      alert(`Error reading file: ${error.message}`);
    }
  };

const renderAuthenticatedContent = () => (
      <div style={{ padding: "20px" }} className='text-white mt-8'>
        <div className="lg:grid-cols-2 grid-cols-1 flex flex-col lg:gap-y-6 gap-y-4 items-center justify-center text-black">
          <h1 className="text-white text-4xl font-bold text-center">Insert Tahera Khanam Content</h1>
          <div className='text-white text-xl'>{fileName ? fileName : 'No File Uploaded'}</div>
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
              type="button"
              style={{ marginTop: "10px" }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        <div className='flex flex-row items-center justify-center my-4'>
          <label htmlFor="category-select">Choose a category:</label>
          <select 
            className='text-black bg-pink-100 mx-2 rounded p-1 border-black border' 
            id="category-select" 
            value={selectedCategory} 
            onChange={handleCategoryChange}
          >
            <option value="paintings">Painting</option>
            <option value="writings">Writings</option>
          </select>
        </div>

        <div className='p-4'>
          <div className='text-center pb-4 pt-8'>
            <Link href="/dev/view"
              className='text-xl font-bold custom-font bg-indigo-800 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
            >VIEW DATA</Link>
          </div>
        </div>

        <div className="fixed right-0 lg:mt-0 mt-4 bottom-0 mr-8">
          <button
            className="bg-rose-800 text-white px-4 py-2 rounded-sm border border-black transform mb-4 w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );

  return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
};

export default AddTaheraKhanam;
