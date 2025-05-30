"use client";

import React, { ChangeEvent, useState } from "react";
import type { NextPage } from "next";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Papa from "papaparse";
import Link from "next/link";

const AddGraphics: NextPage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("WBQC"); // Default category

  // Function to set filename
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setFileName(file.name); // Update the fileName state with the name of the file
      console.log(file.name);
    } else {
      // Reset the selected file and file name if no file is selected
      setSelectedFile(null);
      setFileName("No Supported File Uploaded"); // Clear the fileName if no file is selected
    }
  };

  // Driver function
  const handleSubmit = async (selectedFile: File, selectedCategory: string) => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }

    // Function to read file content
    const readFile = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });

    try {
      const fileContent = await readFile(selectedFile);
      let parseErrorOccurred = false;

      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          // Depending on the selectedCategory, call the respective function to process and save the data
          console.log(selectedCategory);
          switch (selectedCategory) {
            case "WBQC":
              await processWBQC(result.data);
              break;
            case "WOQC":
              await processWOQC(result.data);
              break;
            default:
              alert("Invalid category selected");
              console.error("Invalid category selected");
              parseErrorOccurred = true;
          }
        },
        error: (error: any) => {
          console.error("Error parsing CSV file:", error);
          alert("Error parsing CSV file. Please check the file format.");
          parseErrorOccurred = true;
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      alert(
        `Error reading file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Data Processing Functions for each Categories

  async function processWBQC(data: any[]) {
    const transformedData = data.map((item) => ({
      title: item["Title"],
      subtitle: item["Subtitle"],
      publisher: item["Organization/Person/Publisher"],
      link: item["Web Link"],
      category: item["Category"],
      date: item["Date in English"],
      date_Bangla: item["Date in Bangla"],
      text: item["Bangla Text"],
      imageUrl: item["Image File Name"] === "" ? "" : `https://sqcf.s3.ap-southeast-1.amazonaws.com/writings/${item["Image File Name"]}`,
      imageAlt: item["Image Caption"],
      tags: item["Tags in English"].split(","),
      tags_Bangla: item["Tags in Bangla"].split(","),
    }));

    let errorOccurred = false;
    for (const data of transformedData) {
      try {
        const response = await fetch("/api/addWritingByQC", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          errorOccurred = true;
          throw new Error(`Error: ${response.statusText}`);
        }

        console.log("Writing added successfully", data);
      } catch (error: any) {
        console.error("Error adding Writing:", error);
        alert(`Error adding Writing: ${error.message}`);
        return;
      }
    }

    if (!errorOccurred) {
      alert("All Writing uploaded to database successfully");
    }
  }

  async function processWOQC(data: any[]) {
    const transformedData = data.map((item) => ({
      title: item["Title"],
      subtitle: item["Subtitle"],
      author: item["Author/Editor"],
      publisher: item["Organization/Person/Publisher"],
      link: item["Web Link"],
      category: item["Category"],
      date: item["Date in English"],
      date_Bangla: item["Date in Bangla"],
      text: item["Bangla Text"],
      imageUrl: item["Image File Name"] === "" ? "" : `https://sqcf.s3.ap-southeast-1.amazonaws.com/writings/${item["Image File Name"]}`,
      imageAlt: item["Image Caption"],
      tags: item["Tags in English"].split(","),
      tags_Bangla: item["Tags in Bangla"].split(","),
    }));

    let errorOccurred = false;
    for (const data of transformedData) {
      try {
        const response = await fetch("/api/addWritingOnQC", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          errorOccurred = true;
          throw new Error(`Error: ${response.statusText}`);
        }

        console.log("Book Cover added successfully", data);
      } catch (error: any) {
        console.error("Error adding book cover:", error);
        alert(`Error adding book cover: ${error.message}`);
        return;
      }
    }

    if (!errorOccurred) {
      alert("All book covers uploaded to database successfully");
    }
  }

  // Logout Function
  const handleSubmit2 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  // Storing category in state
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const renderAuthenticatedContent = () => (
    <div className="max-w-6xl mx-auto p-8 text-white min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 lg:text-6xl text-4xl font-bold text-center mb-16 animate-fade-in">
        Upload Writings
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
              className="w-full bg-gray-800 text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            >
              <option value="WBQC" className="bg-gray-800">Writings By QC</option>
              <option value="WOQC" className="bg-gray-800">Writings On QC</option>
            </select>
          </div>

          <button
            onClick={() => selectedFile && handleSubmit(selectedFile, selectedCategory)}
            disabled={!selectedFile}
            className={`flex items-center justify-center space-x-2 py-4 px-8 rounded-xl font-semibold shadow-lg transition-all duration-300
              ${!selectedFile 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload to Database</span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { href: "/dev/view", text: "VIEW DATA", className: "from-indigo-600 to-blue-600" },
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
        onClick={handleSubmit2}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
      >
        Logout
      </button>
    </div>
  );

  return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
};

export default AddGraphics;
