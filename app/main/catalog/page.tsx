"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "/public/styles/home.css";
import Navbar from "@/components/navbar";
import ErrorScreen from "@/components/error";
import FlipBookItem from "@/components/FlipBookItem";
import LoadingScreen from "@/components/LoadingScreen"; // Fixed import path
import { IoMdSearch } from "react-icons/io";

interface CatalogItem {
  title: string;
  imageUrl: string;
  description: string;
  pages?: string[];
}

const CatalogPage = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogItem[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch("/api/getCatalog");
        if (!response.ok) {
          throw new Error("Failed to fetch catalog data");
        }
        const data = await response.json();
        const sortedData = data.sort((a: CatalogItem, b: CatalogItem) => 
          a.title.localeCompare(b.title)
        );
        setItems(sortedData);
        setIsReady(true);
      } catch (err) {
        console.error(err);
        setError("Unable to load catalog. Please try again later.");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);  // Add 2500ms loading time to match other pages
      }
    };

    fetchCatalog();
  }, []);

  // Search logic (case-insensitive, matches title, description, and tags if present)
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(items);
    } else {
      const q = searchQuery.toLowerCase();
      setSearchResults(
        items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (Array.isArray((item as any).tags) &&
              ((item as any).tags as string[]).some((tag) =>
                tag.toLowerCase().includes(q)
              ))
        )
      );
    }
  }, [searchQuery, items]);

  if (!isReady || isLoading) {
    return <LoadingScreen />;  // Use LoadingScreen component instead of empty div
  }
  
  if (error) {
    return <ErrorScreen />;
  }

  return (
    <main className="bg-black text-white min-h-screen w-full">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {!isMenuOpen && (
        <div className="w-full">
          {/* Header section - align title with underline and grid */}
          <div className="pt-36 pb-12 px-8 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <h1 className="lg:text-6xl text-4xl custom-font anim-appear-3 text-left"
                  style={{ marginLeft: 0 }}>
                CATALOGS
              </h1>
            </div>
          </div>

          {/* Search bar & count with underline (like contents page) */}
          <div className="px-8 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-end anim-appear-6">
                {/* Search Bar */}
                <div className="mt-12 mb-2 w-full max-w-md">
                  <div className="relative w-full">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 pl-4 pr-12 text-white shadow focus:outline-none bg-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          fontSize: "1.1rem",
                          letterSpacing: "0.01em",
                          borderRadius: 0,
                        }}
                      />
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-2xl text-white"
                        tabIndex={-1}
                      >
                        <IoMdSearch />
                      </button>
                    </form>
                  </div>
                </div>
                {/* Item Count */}
                <div className="mt-4 lg:mt-0 text-right w-full max-w-xs">
                  <h1 className="text-sm custom-font">
                    <span className="text-amber-200">{searchResults.length}</span> Catalog Item{searchResults.length !== 1 ? "s" : ""}
                  </h1>
                </div>
              </div>
              {/* Underline styled like contents page */}
              <hr className="my-4 border white-700 anim-appear-6" />
            </div>
          </div>

          {/* Catalog items section - align grid with underline and heading */}
          <div className="px-8 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12"
                style={{
                  marginLeft: 0, // align grid flush with underline and heading
                  marginTop: "2.5rem",
                }}
              >
                {searchResults.map((item, index) => (
                  <div
                    key={`catalog-${index}-${item.title}`}
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                    style={{
                      width: "100%",
                      aspectRatio: "3/4",
                      minWidth: "0",
                      maxWidth: "none",
                      borderRadius: "0",
                      overflow: "hidden",
                      boxShadow: "none",
                      border: "1px solid #222",
                      background: "#222",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        borderRadius: "0",
                        overflow: "hidden",
                        background: "#222",
                      }}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Modal Overlay */}
          {selectedItem && (
            <div
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4"
              style={{ zIndex: 9999 }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex flex-col items-center"
                style={{
                  background: "transparent", // Remove background
                  boxShadow: "none",         // Remove box-shadow
                  padding: 0,
                }}
              >
                <FlipBookItem item={selectedItem} isModal={true} />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default CatalogPage;