"use client";

import Image from "next/image";
import Link from "next/link";
import "/public/styles/home.css"; // Reuse this if you have shared styles
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ErrorScreen from "@/components/error";
import FlipBookItem from "@/components/FlipBookItem";

interface CatalogItem {
  title: string;
  imageUrl: string;
  description: string;
  pages?: { content: React.ReactNode }[];
}

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for modal flipbook
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch("/api/getCatalog"); // Update your endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch catalog data");
        }
        const data = await response.json();
        setItems(data);
        setIsReady(true);
      } catch (err) {
        console.error(err);
        setError("Unable to load catalog. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  if (!isReady || isLoading)
    return <div className="bg-black w-full h-screen"></div>;
  if (error) return <ErrorScreen />;

  return (
    <main className="bg-black text-white min-h-screen w-full">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* {!isMenuOpen ? (
        <div className="pt-28 px-6 max-w-6xl mx-auto">

          <h1 className="custom-font text-4xl mb-10">Catalogs</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {items.map((item, index) => (
              <FlipBookItem
              key={index}
              className="bg-zinc-900 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            >
            
                <Image
                  src={item.imageUrl || "/images/default.jpg"}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="rounded mb-4"
                />
                <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-300">{item.description}</p>
              </FlipBookItem>
            ))}
          </div>
        </div>
      ) : null} */}

      {!isMenuOpen ? (
        <>
          {/* Header */}
        <div className="max-w-7xl mx-auto pt-28 px-8"> {/* large top padding to push content down */}
         
                    <h1 className="lg:text-6xl text-4xl custom-font anim-appear-3 mb-10">
            Catalogs
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8" style={{minWidth: 0}}>
  
            {items.map((item, index) => (
              <div key={index} onClick={() => setSelectedItem(item)} className="cursor-pointer" >
                <FlipBookItem item={item} />
              </div>
            ))}
          </div>
          </div>

          {/* Modal Overlay */}
          {selectedItem && (
            <div
              onClick={() => setSelectedItem(null)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                cursor: "pointer",
              }}
            >
              {/* Prevent click inside flipbook from closing modal */}
              <div onClick={(e) => e.stopPropagation()}>
                <FlipBookItem item={selectedItem} isModal={true} />
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    display: "block",
                    margin: "12px auto 0",
                    padding: "8px 16px",
                    fontSize: "1.1rem",
                    backgroundColor: "#ef4444",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
         </>
      ) : null}
    </main>
  );
}
