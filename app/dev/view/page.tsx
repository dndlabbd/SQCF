"use client";

import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import axios from "axios";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Art {
  id: string;
  title: string;
  title_Bangla: string;
  year: string;
  year_Bangla: string;
  imageUrl: string;
  description: string;
  measurement: string;
  measurement_Bangla: string;
  medium: string;
  medium_Bangla: string;
  type: string;
  publication: string;
  tags: [string];
  tags_Bangla: [string];
  createdAt: Date;
  updatedAt: Date;
}

interface BookCover {
  id: string;
  title: string;
  author: string;
  publisher: string;
  date: string;
  imageUrl: string;
  type: string;
  type_Bangla: string;
  tags: string[];
  tags_Bangla: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Poster {
  id: string;
  title: string;
  title_Bangla: string;
  imageUrl: string;
  description: string;
  category: string;
  year: string;
  year_Bangla: string;
  for_whom: string;
  width: number;
  height: number;
  tags: string[];
  tags_Bangla: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Illustration {
  id: string;
  title: string;
  title_Bangla: string;
  subtitle: string;
  subtitle_Bangla: string;
  publisher: string;
  publisher_Bangla: string;
  year: string;
  year_Bangla: string;
  imageUrl: string;
  description: string;
  tags: string[];
  tags_Bangla: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Logos {

}

interface MasterHeads {

}

interface Calligraphies {

}

interface Portraits {

}

interface CrestDesigns {

}

interface Textiles {

}

const ViewArt: NextPage = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [arts, setArts] = useState<Art[]>([]);
  const [bookcovers, setBookCovers] = useState<BookCover[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [artType, setArtType] = useState("art");
  const [category, setCategory] = useState("bookcover");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const response = await axios.get("/api/getAllArt");
        const response2 = await axios.get("/api/getAllBookCovers");
        const response3 = await axios.get("/api/getAllPosters");
        const response4 = await axios.get("/api/getAllIllustrations");
        setArts(response.data);
        setBookCovers(response2.data);
        setPosters(response3.data);
        setIllustrations(response4.data);
      } catch (error) {
        console.error("Failed to fetch arts:", error);
      }
    };

    if (isAuthenticated) {
      fetchArts();
    }
  }, [isAuthenticated, refreshKey]);

  const handleSubmit2 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  const handlerefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRefreshKey((prevKey) => prevKey + 1);
    console.log("Refreshed", refreshKey);
  };

  const handleArt = (e: React.MouseEvent<HTMLButtonElement>) => {
    setArtType("art");
  };

  const handleGraphicsDesign = (e: React.MouseEvent<HTMLButtonElement>) => {
    setArtType("graphicsDesign");
  };

  const handleCover = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCategory("bookCover");
    console.log(bookcovers);
  };

  const handlePoster = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCategory("poster");
  }

  const handleIllustration = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCategory("illustration");
  }

  const handleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (items: any[]) => {
    setSelectedItems(prev => 
      prev.length === items.length ? [] : items.map(item => item.id)
    );
  };

  const handleDelete = async () => {
    if (!selectedItems.length) return;
    
    const categoryName = artType === 'art' ? 'Art' : 
      category === 'bookCover' ? 'Book Cover' :
      category === 'poster' ? 'Poster' :
      category === 'illustration' ? 'Illustration' : '';
    
    if (confirm(`Are you sure you want to delete ${selectedItems.length} ${categoryName}${selectedItems.length > 1 ? 's' : ''}?`)) {
      try {
        const response = await axios.post('/api/deleteItems', {
          ids: selectedItems,
          type: artType === 'art' ? 'art' : category
        });
        
        if (response.status === 200) {
          toast.success(
            `Successfully deleted ${selectedItems.length} ${categoryName}${selectedItems.length > 1 ? 's' : ''}`
          );
          setSelectedItems([]);
          setRefreshKey(prev => prev + 1);
        }
      } catch (error: any) { // Add type annotation for error
        console.error('Failed to delete items:', error);
        toast.error(`Failed to delete ${categoryName}s: ${error.message}`);
      }
    }
  };

  const bodyCellClasses = "p-4 border-b border-white/10 text-white/90"; // Common class for table cells

  return isAuthenticated ? (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex flex-col">
        {/* Header section */}
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 lg:text-5xl text-3xl font-bold animate-fade-in leading-normal py-1">
              {artType === "art" ? "Art Gallery" : "Graphics Design Gallery"}
            </h1>
            <Link
              href="javascript:void(0);"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              Back
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid lg:grid-cols-4 grid-cols-2 gap-4">
            {[
              { count: arts.length, label: "Art Count", color: "from-orange-500 to-amber-500" },
              { count: arts.filter(art => art.type === "paintings").length, label: "Paintings", color: "from-rose-500 to-pink-500" },
              { count: arts.filter(art => art.type === "drawings").length, label: "Drawings", color: "from-green-500 to-emerald-500" },
              { count: arts.filter(art => art.type === "sketches").length, label: "Sketches", color: "from-amber-500 to-yellow-500" },
              { count: bookcovers.length + posters.length + illustrations.length, label: "Graphics Design", color: "from-yellow-500 to-lime-500" },
              { count: bookcovers.length, label: "Book Covers", color: "from-fuchsia-500 to-purple-500" },
              { count: posters.length, label: "Posters", color: "from-pink-500 to-rose-500" },
              { count: illustrations.length, label: "Illustrations", color: "from-emerald-500 to-teal-500" }
            ].map((item, index) => (
              <div key={index} className={`bg-gradient-to-r ${item.color} rounded-xl p-4 text-white shadow-lg`}>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-sm opacity-90">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Table Section - Full Width */}
        <div className="w-full bg-black shadow-2xl border-t border-b border-white/20">
          <div className="overflow-x-auto px-8">
            {/* For Art */}
            {artType === 'art' && (
              <table className="w-full my-8">
                <thead className="bg-black sticky top-0 z-10">
                  <tr className="h-16">
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      <input
                        type="checkbox"
                        onChange={() => handleSelectAll(arts)}
                        checked={selectedItems.length === arts.length && arts.length > 0}
                        className="w-4 h-4 rounded border-gray-600"
                      />
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Image
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Title
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Title (Bangla)
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Year
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Year (Bangla)
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Description
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Measurement
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Measurement (Bangla)
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Medium
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Medium (Bangla)
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Type
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Publication
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Tags
                    </th>
                    <th className="p-4 text-left text-white font-medium border-b border-white/10 whitespace-nowrap">
                      Tags (Bangla)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-black">
                  {arts.map((art) => (
                    <tr key={art.id} className="hover:bg-white/5">
                      <td className={bodyCellClasses}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(art.id)}
                          onChange={() => handleSelect(art.id)}
                          className="w-4 h-4 rounded border-gray-600"
                        />
                      </td>
                      <td className={bodyCellClasses}>
                        <div className="w-[200px]">
                          <Image src={art.imageUrl} alt={art.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/>
                        </div>
                      </td>
                      <td className={bodyCellClasses}>{art.id}</td>
                      <td className={bodyCellClasses}>{art.title}</td>
                      <td className={bodyCellClasses}>{art.title_Bangla}</td>
                      <td className={bodyCellClasses}>{art.year}</td>
                      <td className={bodyCellClasses}>{art.year_Bangla}</td>
                      <td className={bodyCellClasses}>{art.description}</td>
                      <td className={bodyCellClasses}>{art.measurement}</td>
                      <td className={bodyCellClasses}>{art.measurement_Bangla}</td>
                      <td className={bodyCellClasses}>{art.medium}</td>
                      <td className={bodyCellClasses}>{art.medium_Bangla}</td>
                      <td className={bodyCellClasses}>{art.type}</td>
                      <td className={bodyCellClasses}>{art.publication}</td>
                      <td className={bodyCellClasses}>{art.tags.join(", ")}</td>
                      <td className={bodyCellClasses}>{art.tags_Bangla.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Book Covers Table */}
            {artType === 'graphicsDesign' && category === 'bookCover' && (
              <table className="w-full my-8">
                <thead className="bg-black sticky top-0">
                  <tr>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      <input
                        type="checkbox"
                        onChange={() => handleSelectAll(bookcovers)}
                        checked={selectedItems.length === bookcovers.length && bookcovers.length > 0}
                        className="w-4 h-4 rounded border-gray-600"
                      />
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Image
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Title
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Author
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Publisher
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Date
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Type
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {bookcovers.map((cover) => (
                    <tr key={cover.id} className="hover:bg-white/5 bg-black/80">
                      <td className={bodyCellClasses}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(cover.id)}
                          onChange={() => handleSelect(cover.id)}
                          className="w-4 h-4 rounded border-gray-600"
                        />
                      </td>
                      <td className={bodyCellClasses}>
                        <div className="w-[200px]">
                          <Image src={cover.imageUrl} alt={cover.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/>
                        </div>
                      </td>
                      <td className={bodyCellClasses}>{cover.id}</td>
                      <td className={bodyCellClasses}>{cover.title}</td>
                      <td className={bodyCellClasses}>{cover.author}</td>
                      <td className={bodyCellClasses}>{cover.publisher}</td>
                      <td className={bodyCellClasses}>{cover.date}</td>
                      <td className={bodyCellClasses}>{cover.type}</td>
                      <td className={bodyCellClasses}>{cover.tags.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Posters Table */}
            {artType === 'graphicsDesign' && category === 'poster' && (
              <table className="w-full my-8">
                <thead className="bg-black sticky top-0">
                  <tr>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      <input
                        type="checkbox"
                        onChange={() => handleSelectAll(posters)}
                        checked={selectedItems.length === posters.length && posters.length > 0}
                        className="w-4 h-4 rounded border-gray-600"
                      />
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Image
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Title
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Title (Bangla)
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Year
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Year (Bangla)
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Description
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Width
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Height
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {posters.map((poster) => (
                    <tr key={poster.id} className="hover:bg-white/5 bg-black/80">
                      <td className={bodyCellClasses}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(poster.id)}
                          onChange={() => handleSelect(poster.id)}
                          className="w-4 h-4 rounded border-gray-600"
                        />
                      </td>
                      <td className={bodyCellClasses}>
                        <div className="w-[200px]">
                          <Image src={poster.imageUrl} alt={poster.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/>
                        </div>
                      </td>
                      <td className={bodyCellClasses}>{poster.id}</td>
                      <td className={bodyCellClasses}>{poster.title}</td>
                      <td className={bodyCellClasses}>{poster.title_Bangla}</td>
                      <td className={bodyCellClasses}>{poster.year}</td>
                      <td className={bodyCellClasses}>{poster.year_Bangla}</td>
                      <td className={bodyCellClasses}>{poster.description}</td>
                      <td className={bodyCellClasses}>{poster.width}</td>
                      <td className={bodyCellClasses}>{poster.height}</td>
                      <td className={bodyCellClasses}>{poster.tags.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Illustrations Table */}
            {artType === 'graphicsDesign' && category === 'illustration' && (
              <table className="w-full my-8">
                <thead className="bg-black sticky top-0">
                  <tr>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      <input
                        type="checkbox"
                        onChange={() => handleSelectAll(illustrations)}
                        checked={selectedItems.length === illustrations.length && illustrations.length > 0}
                        className="w-4 h-4 rounded border-gray-600"
                      />
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Image
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      ID
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Title
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Title (Bangla)
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Subtitle
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Subtitle (Bangla)
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Publisher
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Publisher (Bangla)
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Year
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Year (Bangla)
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Description
                    </th>
                    <th className="p-4 text-left text-gray-100 font-medium border-b border-white/10 whitespace-nowrap">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {illustrations.map((illustration) => (
                    <tr key={illustration.id} className="hover:bg-white/5 bg-black/80">
                      <td className={bodyCellClasses}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(illustration.id)}
                          onChange={() => handleSelect(illustration.id)}
                          className="w-4 h-4 rounded border-gray-600"
                        />
                      </td>
                      <td className={bodyCellClasses}>
                        <div className="w-[200px]">
                          <Image src={illustration.imageUrl} alt={illustration.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/>
                        </div>
                      </td>
                      <td className={bodyCellClasses}>{illustration.id}</td>
                      <td className={bodyCellClasses}>{illustration.title}</td>
                      <td className={bodyCellClasses}>{illustration.title_Bangla}</td>
                      <td className={bodyCellClasses}>{illustration.subtitle}</td>
                      <td className={bodyCellClasses}>{illustration.subtitle_Bangla}</td>
                      <td className={bodyCellClasses}>{illustration.publisher}</td>
                      <td className={bodyCellClasses}>{illustration.publisher_Bangla}</td>
                      <td className={bodyCellClasses}>{illustration.year}</td>
                      <td className={bodyCellClasses}>{illustration.year_Bangla}</td>
                      <td className={bodyCellClasses}>{illustration.description}</td>
                      <td className={bodyCellClasses}>{illustration.tags.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-8 py-6">
          {/* Category buttons for graphics design */}
          {artType === 'graphicsDesign' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                { text: "Book Covers", onClick: handleCover, color: "from-lime-600 to-green-600" },
                { text: "Posters", onClick: handlePoster, color: "from-green-600 to-emerald-600" },
                { text: "Illustrations", onClick: handleIllustration, color: "from-emerald-600 to-teal-600" }
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`bg-gradient-to-r ${button.color} text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
                >
                  {button.text}
                </button>
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { text: "View Art", onClick: handleArt, color: "from-zinc-600 to-gray-600" },
              { text: "View Graphics", onClick: handleGraphicsDesign, color: "from-gray-600 to-slate-600" },
              { text: "Refresh", onClick: handlerefresh, color: "from-sky-600 to-blue-600" },
              { text: "Logout", onClick: handleSubmit2, color: "from-red-600 to-rose-600" }
            ].map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`bg-gradient-to-r ${button.color} text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>

        {/* Delete button that appears when items are selected */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg z-50">
            <button 
              onClick={handleDelete}
              className="flex items-center space-x-2"
            >
              <span>Delete {selectedItems.length} items</span>
            </button>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleSubmit2}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          Logout
        </button>
      </div>
    </div>
  ) : (
    <Login onLogin={login} />
  );
};

export default ViewArt;
