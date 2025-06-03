// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import "/public/styles/home.css"; // Reuse this if you have shared styles
// import React, { useEffect, useState } from "react";
// import Navbar from "@/components/navbar";
// import ErrorScreen from "@/components/error";
// import FlipBookItem from "@/components/FlipBookItem";

// interface CatalogItem {
//   title: string;
//   imageUrl: string;
//   description: string;
//   // pages?: { content: React.ReactNode }[];
//   pages?: string[]; // expect array of image URLs here
// }

// export default function CatalogPage() {
//   const [items, setItems] = useState<CatalogItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isReady, setIsReady] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  

//   // State for modal flipbook
//   const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

//   useEffect(() => {
//     const fetchCatalog = async () => {
//       try {
//         const response = await fetch("/api/getCatalog");
//         if (!response.ok) {
//           throw new Error("Failed to fetch catalog data");
//         }
//         const data = await response.json();
//         // Sort items alphabetically by title
//         const sortedData = data.sort((a: CatalogItem, b: CatalogItem) => 
//           a.title.localeCompare(b.title)
//         );
//         setItems(sortedData);
//         setIsReady(true);
//       } catch (err) {
//         console.error(err);
//         setError("Unable to load catalog. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCatalog();
//   }, []);

//   if (!isReady || isLoading)
//     return <div className="bg-black w-full h-screen"></div>;
//   if (error) return <ErrorScreen />;

//   return (
//     <main className="bg-black text-white min-h-screen w-full">
//       <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

//       {!isMenuOpen ? (
//         <div className="w-full">
//           {/* Header section */}
//           <div className="pt-28">
//             <h1 className="lg:text-6xl text-4xl custom-font anim-appear-3 mb-8 ml-2">
//               Catalogs
//             </h1>
//           </div>

//           {/* Catalog items section */}
//           <div className="ml-2">
//             <div 
//               className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
//               style={{
//                 gap: "0",  // remove all gaps
//                 columnGap: "1px", // minimal separation between columns
//                 rowGap: "1px", // minimal separation between rows
//                 justifyItems: "start",
//                 alignItems: "start",
//               }}
//             >
//               {items.map((item, index) => (
//                 <div
//                   key={index}
//                   onClick={() => setSelectedItem(item)}
//                   className="cursor-pointer transform transition-transform hover:scale-105"
//                 >
//                   <FlipBookItem item={item} />
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Modal Overlay */}
//           {selectedItem && (
//             <div
//               onClick={() => setSelectedItem(null)}
//               className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
//             >
//               {/* Prevent click inside flipbook from closing modal */}
//               <div
//                 onClick={(e) => e.stopPropagation()}
//                 className="w-full max-w-4xl"
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <FlipBookItem item={selectedItem} isModal={true} />
//                 <button
//                   onClick={() => setSelectedItem(null)}
//                   className="block mx-auto mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       ) : null}
//     </main>
// }




"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "/public/styles/home.css";
import Navbar from "@/components/navbar";
import ErrorScreen from "@/components/error";
import FlipBookItem from "@/components/FlipBookItem";
import LoadingScreen from "@/components/LoadingScreen"; // Fixed import path

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
          {/* Header section - positioned like Arts & Writings page */}
          <div className="pt-36 pb-12 px-8 lg:px-20">
            <div className="max-w-7xl">
              <h1 className="lg:text-6xl text-4xl custom-font anim-appear-3 text-left ml-4">
                CATALOGS
              </h1>
            </div>
          </div>

          {/* Catalog items section - 4 items per row with isolated click areas */}
          <div className="px-8 lg:px-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap justify-start catalog-container">
                {items.map((item, index) => (
                  <div
                    key={`catalog-${index}-${item.title}`}
                    className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                    style={{
                      width: 'calc(25% - 24px)', // Exactly 4 per row with gap
                      minWidth: '280px', // Minimum width for smaller screens
                      margin: '12px', // 24px total gap between items
                      padding: '0',
                      boxSizing: 'border-box',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      isolation: 'isolate', // Create new stacking context
                      zIndex: 1,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(`Opening modal for: ${item.title} (index: ${index})`);
                      setSelectedItem(item);
                    }}
                  >
                    <div
                      style={{
                        width: '280px',
                        height: '360px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none', // Completely disable pointer events on flipbook container
                      }}
                    >
                      <FlipBookItem item={item} />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Responsive styles for smaller screens */}
              <style jsx>{`
                @media (max-width: 1536px) {
                  .catalog-container > div {
                    width: calc(33.333% - 24px) !important;
                    min-width: 280px !important;
                  }
                }
                @media (max-width: 1024px) {
                  .catalog-container > div {
                    width: calc(50% - 24px) !important;
                    min-width: 280px !important;
                  }
                }
                @media (max-width: 768px) {
                  .catalog-container > div {
                    width: calc(100% - 24px) !important;
                    min-width: 280px !important;
                  }
                }
              `}</style>
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