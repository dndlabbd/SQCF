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
      <div style={{ padding: "20px" }} className="text-white">
        <h2 className="text-4xl font-bold custom-font lg:mb-2 mb-8 text-center">
          Automated Insert Writings
        </h2>

        {/* Automated Submission */}

        <div className="lg:grid-cols-2 grid-cols-1 flex flex-col lg:gap-y-6 gap-y-4 items-center justify-center pt-8">
          <div className="text-white text-xl">
            {fileName ? fileName : "No File Uploaded"}
          </div>{" "}
          {/* Display the uploaded file name */}
          <div className="flex flex-row gap-x-4 items-center justify-cente text-black">
            <label className="bg-orange-200 p-2 rounded-sm border border-black w-[10em] cursor-pointer text-center my-auto">
              Upload
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </label>
            <button
              className="bg-rose-300 text-black p-2 rounded-sm border border-black w-[10em] text-center mb-2"
              type="button" // Changed to type="button" to prevent form submission
              style={{ marginTop: "10px" }}
              onClick={() =>
                selectedFile && handleSubmit(selectedFile, selectedCategory)
              }
            >
              Submit
            </button>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center my-4">
          <label htmlFor="category-select">Choose a category:</label>
          <select
            className="bg-pink-100 mx-2 rounded p-1 border-black border text-black"
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="WBQC">Writings By QC</option>
            <option value="WOQC">Writings On QC</option>
          </select>
        </div>

        <div className='p-4'>
            <div className='text-center pb-4 pt-8'>
                <Link href="/dev/view"
                className='text-xl font-bold custom-font bg-indigo-800 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
                >VIEW DATA</Link>
            </div>

            <div className='text-center pb-4 pt-8'>
                <Link href="/dev/insertArt"
                className='text-xl font-bold custom-font bg-green-800 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
                >INSERT ART</Link>
            </div>

            <div className='text-center pb-4 pt-8'>
                <Link href="/dev/insertGraphics"
                className='text-xl font-bold custom-font bg-green-600 text-white p-3 rounded-xl text-center px-6 drop-shadow-lg'
                >INSERT GRAPHICS</Link>
            </div>

        </div>

        {/* Logout */}

        <div className="fixed right-0 lg:mt-0 mt-4 bottom-0 mr-8">
          <button
            className="bg-rose-800 text-white px-4 py-2 rounded-sm border border-black transform mb-4 w-full"
            onClick={handleSubmit2}
          >
            Logout
          </button>
        </div>
      </div>
    );

  return isAuthenticated ? renderAuthenticatedContent() : <Login onLogin={login} />;
};

export default AddGraphics;
