"use client";

import Image from "next/image";
import Link from "next/link";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import React, { useCallback, useEffect, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorScreen from "../../components/error";
import "/public/styles/home.css";
import axios from "axios";
import { IoMdSearch } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { debounce } from "lodash";
import Navbar from "@/components/navbar";
// import levenshtein from "fast-levenshtein";

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
  imageUrl: string;
  category: string;
  year: string;
  year_Bangla: string;
  for_whom: string;
  measurement: string;
  measurement_Bangla: string;
  tags: string[];
  tags_Bangla: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Illustration {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  year: string;
  year_Bangla: string;
  imageUrl: string;
  tags: string[];
  tags_Bangla: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface WritingByQC {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  link: string;
  category: string;
  date: string;
  date_Bangla: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  tags_Bangla: string[];
}

interface WritingOnQC {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  author: string;
  link: string;
  type: string;
  date: string;
  date_Bangla: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  tags_Bangla: string[];
}

export default function Category() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [arts, setArts] = useState<Art[]>([]);
  const [bookcovers, setBookCovers] = useState<BookCover[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [writingsByQC, setWritingsByQC] = useState<WritingByQC[]>([]);
  const [writingsOnQC, setWritingsOnQC] = useState<WritingOnQC[]>([]);
  const [isArtOpen, setIsArtOpen] = useState(false);
  const [isGPOpen, setIsGPOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isTaheraOpen, setIsTaheraOpen] = useState(false);
  const [selectedCategory, setselectedCategory] = useState("Paintings");

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Requires updates for new categories
  const handleNextPage = () => {
    if(selectedCategory === "Paintings") {
      if (
        currentPage <
        Math.ceil(
          arts.filter((art) => art.type === selectedCategory.toLowerCase()).length / itemsPerPage
        )
      ) {
        setCurrentPage(currentPage + 1);
        setCurrentIndex(currentIndex + itemsPerPage);
      }
    } else if(selectedCategory === "Book Covers") {
      if (
        currentPage <
        Math.ceil(
          bookcovers.length / itemsPerPage
        )
      ) {
        setCurrentPage(currentPage + 1);
        setCurrentIndex(currentIndex + itemsPerPage);
      }
    } else if(selectedCategory === "Posters") {
      if (
        currentPage <
        Math.ceil(
          posters.length / itemsPerPage
        )
      ) {
        setCurrentPage(currentPage + 1);
        setCurrentIndex(currentIndex + itemsPerPage);
      }
    } else if(selectedCategory === "Illustrations & Cards") {
      if (
        currentPage <
        Math.ceil(
          illustrations.length / itemsPerPage
        )
      ) {
        setCurrentPage(currentPage + 1);
        setCurrentIndex(currentIndex + itemsPerPage);
      }
    }
   else if(selectedCategory === "Writing on QC") {
    if (
      currentPage <
      Math.ceil(
        writingsOnQC.length / itemsPerPage
      )
    ) {
      setCurrentPage(currentPage + 1);
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  interface SearchResultBase {
    source?: string;
  }
  type ExtendedArt = Art & SearchResultBase;
  type ExtendedBookCover = BookCover & SearchResultBase;
  type ExtendedPoster = Poster & SearchResultBase;
  type ExtendedIllustration = Illustration & SearchResultBase;
  type ExtendedWriting = WritingByQC & WritingOnQC & SearchResultBase;
  type SearchResult =
    | ExtendedArt
    | ExtendedBookCover
    | ExtendedPoster
    | ExtendedIllustration
    | ExtendedWriting;
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // const similarityThreshold = 50;

  // const calculateSimilarity = (tag: any, query: string) => {
  //   const distance = levenshtein.get(tag.toLowerCase(), query.toLowerCase());
  //   const longestLength = Math.max(tag.length, query.length);
  //   const similarityPercentage = (1 - distance / longestLength) * 100;
  //   return similarityPercentage;
  // };

  // Search Functions

  const performSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      setIsSearchLoading(false);
      return;
    }

    setIsSearchLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      // Enhance items with a source field for identification
      const allItems = [
        ...(arts.map((item) => ({ ...item, source: "Art" })) as (Art &
          SearchResultBase)[]),
        ...(bookcovers.map((item) => ({
          ...item,
          source: "BookCover",
        })) as (BookCover & SearchResultBase)[]),
        ...(posters.map((item) => ({ ...item, source: "Poster" })) as (Poster &
          SearchResultBase)[]),
        ...(illustrations.map((item) => ({
          ...item,
          source: "Illustration",
        })) as (Illustration & SearchResultBase)[]),
        ...(writingsOnQC.map((item) => ({
          ...item,
          source: "Writing",
        })) as (WritingOnQC & WritingByQC & SearchResultBase)[]),
      ];
      const matchedItems = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          // item.tags.some(tag => calculateSimilarity(tag, query) >= (100 - similarityThreshold)) ||
          // item.tags_Bangla.some(tag => calculateSimilarity(tag, query) >= (100 - similarityThreshold))
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ) ||
          item.tags_Bangla.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ) ||
          ("text" in item && item.text?.includes(query)) ||
          ("date" in item && item.date?.includes(query)) ||
          ("year" in item && item.year?.includes(query)) ||
          ("year_Bangla" in item && item.year_Bangla?.includes(query))
      );

      setSearchResults(matchedItems); // Update with filtered items
      setIsSearchLoading(false);
    }, 2500);
  };

  const handleSearch = (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior
    performSearch(searchQuery); // Perform the search immediately with the current query
  };

  const groupedResults = searchResults.reduce((acc, item) => {
    let categoryName =
      item.source === "BookCover"
        ? "Book Cover"
        : item.source === "Illustration"
        ? "Illustrations & Cards"
        : item.source || "Unknown";

    // Directly use the item's type as the category name if it's from the Art source
    if (item.source === "Art" && "type" in item) {
      categoryName = capitalizeFirstLetter(item.type);
    }

    // Initialize the category array if it does not exist
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Helper function to capitalize the first letter of a string (e.g., "sketch" -> "Sketch")
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function isExtendedWriting(item: SearchResult): item is ExtendedWriting {
    return (item as ExtendedWriting).author !== undefined;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Define the debounced function directly inside the effect
    const debouncedPerformSearch = debounce(() => {
      performSearch(searchQuery);
    }, 500);

    if (searchQuery) {
      debouncedPerformSearch();
    }

    // Requires update on new categories insert
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getAllArt");
        const response2 = await axios.get("/api/getAllBookCovers");
        const response3 = await axios.get("/api/getAllPosters");
        const response4 = await axios.get("/api/getAllIllustrations");
        const response5 = await axios.get("/api/getAllWritingByQC");
        const response6 = await axios.get("/api/getAllWritingOnQC");
        setArts(response.data);
        setBookCovers(response2.data);
        setPosters(response3.data);
        setIllustrations(response4.data);
        setWritingsByQC(response5.data);
        setWritingsOnQC(response6.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsReady(true);
        setIsLoading(false);
      }
    };
    const fetchDataTimeout = setTimeout(() => {
      fetchData(); // Call fetchData after the timeout
    }, 2500);

    return () => {
      clearTimeout(fetchDataTimeout);
      debouncedPerformSearch.cancel();
    }
  }, [searchQuery]);

  if (!isReady || isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  Fancybox.bind("[data-fancybox]", {});

  return (
    <main className="text-white">
      <div className="h-full w-full">

        {!isMenuOpen ? (
          <div className="relative">
            {/* Main Code */}
            <div className="mt-32 lg:mx-32 mx-0 lg:px-0 lg:py-8 p-8">
              {/* Title */}
              <h1 className="lg:text-6xl text-4xl custom-font anim-appear-3">
                ARTS & WRITINGS
              </h1>

              {/* Search Bar and Item Count */}
              <div className="flex lg:flex-cols flex-row justify-between items-end anim-appear-6">

                {/* Search Bar */}
                <div className="mt-12">
                  <div className="relative w-full">
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        placeholder="Search..."
                        className="lg:w-[25vw] w-full h-10 pl-4 pr-12 text-white shadow focus:outline-none bg-black z-0"
                        value={searchQuery} // Control component
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center px-1 text-2xl text-white"
                      >
                        <IoMdSearch />
                      </button>
                    </form>
                  </div>
                </div>

                {/* Item Count */}
                <div className="hidden lg:block">
                  <h1 className="text-sm lg:mb-2 mb-1 lg:mt-0 mt-6 custom-font text-right">
                    <span className="text-amber-200">
                      {
                        writingsOnQC.length
                      }
                    </span>{" "}
                    Writings on QC |{" "}
                    <span className="text-amber-200">
                      {
                        writingsByQC.filter(
                          (writing) => writing.category === "Poems"
                        ).length
                      }
                    </span>{" "}
                    Poems |{" "}
                    <span className="text-amber-200">
                      {
                        writingsByQC.filter(
                          (writing) => writing.category === "Prose"
                        ).length
                      }
                    </span>{" "}
                    Prose
                  </h1>
                  <h1 className="text-sm mb-1 custom-font text-right">
                    <span className="text-amber-200">
                      {arts.filter((art) => art.type === "paintings").length}
                    </span>{" "}
                    Painting |{" "}
                    <span className="text-amber-200">
                      {arts.filter((art) => art.type === "drawings").length}
                    </span>{" "}
                    Drawing |{" "}
                    <span className="text-amber-200">
                      {arts.filter((art) => art.type === "sketches").length}
                    </span>{" "}
                    Sketch |{" "}
                    <span className="text-amber-200">{bookcovers.length}</span>{" "}
                    Book Covers |{" "}
                    <span className="text-amber-200">{posters.length}</span>{" "}
                    Posters |{" "}
                    <span className="text-amber-200">
                      {illustrations.length}
                    </span>{" "}
                    Illustrations{" "}
                  </h1>
                </div>
              </div>

              <hr className="my-4 border anim-appear-6"></hr>

              {/* Drop Downs */}
              {searchQuery === "" ? (
                <div className="flex lg:flex-row flex-col justify-between anim-appear-7">
                  <div className="flex lg:flex-row flex-col">

                    {/* Art */}
                    <div className="relative mt-2 w-auto">
                      <button
                        className="text-zinc-300 hover:text-white text-2xl custom-font px-4 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={() => setIsArtOpen(!isArtOpen)}
                      >
                        Art
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {isArtOpen && (
                        <div className="w-auto mt-2 bg-black">
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Paintings");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Painting
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Drawings");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Drawing
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Sketches");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Sketch
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Print
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Layout of Painting
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Graphics Design */}
                    <div className="relative mt-2 w-auto">
                      <button
                        className="text-zinc-300 hover:text-white text-2xl custom-font px-4 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={() => setIsGPOpen(!isGPOpen)}
                      >
                        Graphics Design
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {isGPOpen && (
                        <div className="w-auto mt-2 bg-black">
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Book Covers");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Book Cover
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Posters");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Poster
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Illustrations & Cards");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Illustration & Cards
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Logos
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Portrait
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Textiles & Garments
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Calligraphy & Typography
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Master Heads & Page Makeup
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Record Sleeves & Crest Design
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Writing */}
                    <div className="relative mt-2 w-auto">
                      <button
                        className="text-zinc-300 hover:text-white text-2xl custom-font px-4 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={() => setIsWriteOpen(!isWriteOpen)}
                      >
                        Writing
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {isWriteOpen && (
                        <div className="w-auto mt-2 bg-black">
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Writings on QC");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Writings on QC
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Poems");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Poems
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Prose");
                            }}
                            className="block px-4 py-2 text-base text-zinc-300 hover:text-white"
                          >
                            Prose
                          </a>
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentIndex(0);
                              setCurrentPage(1);
                              setselectedCategory("Juvenile Literature");
                            }}
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Juvenile Literature
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Story
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Letters
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Tahera Khanam */}
                    <div className="relative mt-2 w-auto">
                      <button
                        className="text-zinc-300 hover:text-white text-2xl custom-font px-4 py-2.5 text-center inline-flex items-center"
                        type="button"
                        onClick={() => setIsTaheraOpen(!isTaheraOpen)}
                      >
                        Tahera Khanam
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>
                      {isTaheraOpen && (
                        <div className="w-auto mt-2 bg-black">
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Painting
                          </a>
                          <a
                            href=""
                            className="block px-4 py-2 text-base text-zinc-600 pointer-events-none"
                          >
                            Writing
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="my-4 border anim-appear-7 block lg:hidden"></hr>
                  <div className="mt-4">
                    <h1 className="lg:text-3xl text-2xl lg:text-right text-left">
                      Showing {selectedCategory}
                    </h1>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {/* Contents */}
              {searchQuery === "" ? (
                <div className="lg:mt-12 mt-6 anim-appear-8">
                  {/* Images */}
                  <div className="grid lg:grid-cols-4 grid-cols-2 gap-2 items-center justify-center">
                    {/* Painting */}
                    {selectedCategory === "Paintings" &&
                      arts
                        .filter((art) => art.type === "paintings")
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <a
                              data-fancybox
                              data-src={`${art.imageUrl}`}
                              data-caption={`<div style='text-align: center;'>${
                                art.title
                              } | ${art.year}<br>
                              ${art.measurement}
                              <br><div style='color: #fde68a;'>${art.tags.join(
                                ", "
                              )} | ${art.tags_Bangla.join(", ")}</div></div>`}
                            >
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 hover:scale-105"
                              />
                            </a>
                            <div className="mb-2">
                              <h1 className="text-center text-sm px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title} | {art.year}
                              </h1>
                              <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                ( {art.title_Bangla} )
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                {art.measurement ? art.measurement : <br></br>}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Drawing */}
                    {selectedCategory === "Drawings" &&
                      arts
                        .filter((art) => art.type === "drawings")
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <a
                              data-fancybox
                              data-src={`${art.imageUrl}`}
                              data-caption={`<div style='text-align: center;'>${
                                art.title
                              } | ${art.year}<br>
                              ${art.measurement}
                              <br><div style='color: #fde68a;'>${art.tags.join(
                                ", "
                              )} | ${art.tags_Bangla.join(", ")}</div></div>`}
                            >
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 hover:scale-105"
                              />
                            </a>
                            <div className="mb-2">
                              <h1 className="text-center text-sm px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title} | {art.year}
                              </h1>
                              <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                ( {art.title_Bangla} )
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                {art.measurement}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Sketch */}
                    {selectedCategory === "Sketches" &&
                      arts
                        .filter((art) => art.type === "sketches")
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <a
                              data-fancybox
                              data-src={`${art.imageUrl}`}
                              data-caption={`<div style='text-align: center;'>${
                                art.title
                              } | ${art.year}<br>
                              ${art.measurement}
                              <br><div style='color: #fde68a;'>${art.tags.join(
                                ", "
                              )} | ${art.tags_Bangla.join(", ")}</div></div>`}
                            >
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 hover:scale-105"
                              />
                            </a>
                            <div className="mb-2">
                              <h1 className="text-center text-sm px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title}
                              </h1>
                              <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                ( {art.title_Bangla} )
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                {art.measurement}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Book Cover */}
                    {selectedCategory === "Book Covers" &&
                      bookcovers
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <a
                              data-fancybox
                              data-src={`${art.imageUrl}`}
                              data-caption={`<div style='text-align: center;'>${
                                art.title
                              } | ${art.date}<br>
                              Written By ${art.author} | Published By ${
                                art.publisher
                              }
                              <br><div style='color: #fde68a;'>${art.tags.join(
                                ", "
                              )} | ${art.tags_Bangla.join(", ")}</div></div>`}
                            >
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 hover:scale-105"
                              />
                            </a>
                            <div className="mb-2">
                              {/* <h1 className="text-center text-sm px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                            {art.title}
                          </h1> */}
                              <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title} | {art.date}
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                Written By {art.author}
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                Published By {art.publisher}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Poster */}
                    {selectedCategory === "Posters" &&
                      posters
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <a
                              data-fancybox
                              data-src={`${art.imageUrl}`}
                              data-caption={`<div style='text-align: center;'>${
                                art.title
                              } | ${art.year_Bangla}<br>
                              ${art.measurement} | For ${
                                art.for_whom
                              }
                              <br><div style='color: #fde68a;'>${art.tags.join(
                                ", "
                              )} | ${art.tags_Bangla.join(", ")}</div></div>`}
                            >
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 hover:scale-105"
                              />
                            </a>
                            <div className="mb-2">
                              <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title} | {art.year_Bangla}
                              </h1>
                              <h1 className="text-center text-xs px-1 mb-1">
                                {art.measurement}
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                For {art.for_whom}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Illustrations */}
                    {selectedCategory === "Illustrations & Cards" &&
                      illustrations
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <a
                              data-fancybox
                              data-src={`${art.imageUrl}`}
                              data-caption={`<div style='text-align: center;'>${
                                art.title
                              } ${
                                art.year ? `| ${art.year}` : ""
                              }<br>
                              Published By ${art.publisher}
                              <br><div style='color: #fde68a;'>${art.tags.join(
                                ", "
                              )} | ${art.tags_Bangla.join(", ")}</div></div>`}
                            >
                              <Image
                                src={art.imageUrl}
                                alt={art.title}
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 hover:scale-105"
                              />
                            </a>
                            <div className="mb-2">
                              <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title}{" "}
                                {art.year ? `| ${art.year}` : ""}
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                {art.publisher}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Poems */}
                    {selectedCategory === "Poems" &&
                      writingsByQC
                        .filter((writing) => writing.category === "Poems")
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <Link href={`/main/contents/writingByQC/${art.id}`}>
                              <div className="relative group cursor-pointer">
                                {art.imageUrl ? (
                                  <Image
                                    src={art.imageUrl}
                                    alt={art.title}
                                    width={500}
                                    height={500}
                                    objectFit="cover"
                                    className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 transition-all duration-500 ease-in-out group-hover:brightness-[.2] group-hover:border-8"
                                  />
                                ) : (
                                  <div className="w-full lg:h-[20vw] h-[35vw] flex items-center justify-center border-4 border-black mb-2 bg-gray-100 transition-all duration-500 ease-in-out group-hover:brightness-[0.2] group-hover:border-8 group-hover:text-gray-100 text-black">
                                    <span className="lg:text-4xl text-2xl font-bold text-center overflow-hidden text-ellipsis p-4">
                                      {art.title}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                                  <h1 className="text-white text-3xl font-bold custom-font">
                                    View Writing
                                  </h1>
                                </div>
                              </div>
                            </Link>
                            <div className="mb-2">
                              <h1 className="text-center bangla-font text-lg px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title} | {art.date_Bangla}
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                Published In: {art.publisher}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Prose */}
                    {selectedCategory === "Prose" &&
                      writingsByQC
                        .filter((writing) => writing.category === "Prose")
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <Link href={`/main/contents/writingByQC/${art.id}`}>
                              <div className="relative group cursor-pointer">
                                {art.imageUrl ? (
                                  <Image
                                    src={art.imageUrl}
                                    alt={art.title}
                                    width={500}
                                    height={500}
                                    objectFit="cover"
                                    className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 transition-all duration-500 ease-in-out group-hover:brightness-[.2] group-hover:border-8"
                                  />
                                ) : (
                                  <div className="w-full lg:h-[20vw] h-[35vw] flex items-center justify-center border-4 border-black mb-2 bg-gray-100 transition-all duration-500 ease-in-out group-hover:brightness-[0.2] group-hover:border-8 group-hover:text-gray-100 text-black">
                                    <span className="lg:text-4xl text-2xl font-bold text-center overflow-hidden text-ellipsis p-4">
                                      {art.title}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                                  <h1 className="text-white text-3xl font-bold custom-font">
                                    View Writing
                                  </h1>
                                </div>
                              </div>
                            </Link>
                            <div className="mb-2">
                              <h1 className="text-center bangla-font text-lg px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title} | {art.date_Bangla}
                              </h1>
                              <h1 className="text-center text-xs px-1">
                                Published In: {art.publisher}
                              </h1>
                            </div>
                          </div>
                        ))}
                    {/* Writings on QC */}
                    {selectedCategory === "Writings on QC" &&
                      writingsOnQC
                        .slice(currentIndex, currentIndex + itemsPerPage)
                        .map((art, index) => (
                          <div className="" key={index}>
                            <Link href={`/main/contents/writingOnQC/${art.id}`}>
                              <div className="relative group cursor-pointer">
                                {art.imageUrl !== "" ? (
                                  <Image
                                    src={art.imageUrl}
                                    alt={art.title}
                                    width={500}
                                    height={500}
                                    objectFit="cover"
                                    className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 transition-all duration-500 ease-in-out group-hover:brightness-[.2] group-hover:border-8"
                                  />
                                ) : (
                                  <div className="w-full lg:h-[20vw] h-[35vw] flex items-center justify-center border-4 border-black mb-2 bg-gray-100 transition-all duration-500 ease-in-out group-hover:brightness-[0.2] group-hover:border-8 group-hover:text-gray-100 text-black">
                                    <span className="lg:text-4xl text-2xl font-bold text-center overflow-hidden text-ellipsis p-4 bangla-font">
                                      {art.title}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                                  <h1 className="text-white text-3xl font-bold custom-font">
                                    View Writing
                                  </h1>
                                </div>
                              </div>
                            </Link>
                            <div className="mb-2">
                              <h1 className="text-center bangla-font text-lg px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                {art.title}
                              </h1>
                              <h1 className="text-center text-xs px-1 pb-1 bangla-font">
                                Published On: {art.date}
                              </h1>
                              <h1 className="text-center text-xs px-1 bangla-font">
                                Written By:{" "}
                                {art.author}
                              </h1>
                            </div>
                          </div>
                        ))}
                  </div>

                  {/* Pagination */}
                  <div className="my-12">
                    <div className="flex flex-row justify-between mt-4 items-center">
                      {/* Previous Page Button */}
                      {currentPage > 1 && (
                        <div
                          className="flex flex-row gap-2 items-center cursor-pointer"
                          onClick={handlePreviousPage}
                        >
                          <FaArrowLeftLong className="lg:text-2xl text-4xl text-white " />
                          <h1 className="text-2xl lg:block hidden text-zinc-300 hover:text-white">
                            Previous Page
                          </h1>
                        </div>
                      )}
                      {currentPage <= 1 && (
                        <div className="flex flex-row gap-2 items-center cursor-not-allowed text-zinc-800 hover:text-zinc-900">
                          <FaArrowLeftLong className="lg:text-2xl text-4xl" />
                          <h1 className="text-2xl hidden lg:block">
                            Previous Page
                          </h1>
                        </div>
                      )}

                      {/* Page Number */}
                      <div>
                        {(() => {
                          let totalItems;
                          switch (selectedCategory) {
                            case "Paintings":
                              totalItems = arts.filter(
                                (art) => art.type === "paintings"
                              ).length;
                              break;
                            case "Drawings":
                              totalItems = arts.filter(
                                (art) => art.type === "drawings"
                              ).length;
                              break;
                            case "Sketches":
                              totalItems = arts.filter(
                                (art) => art.type === "sketches"
                              ).length;
                              break;
                            case "Book Covers":
                              totalItems = bookcovers.length;
                              break;
                            case "Posters":
                              totalItems = posters.length;
                              break;
                            case "Illustrations & Cards":
                              totalItems = illustrations.length;
                              break;
                            case "Writings on QC":
                            case "Poems":
                            case "Prose":
                              totalItems = 1; // Assuming these categories inherently have only 1 page of items or are treated as such
                              break;
                            default:
                              totalItems = 0; // Default or error case
                          }

                          const totalPages = Math.ceil(
                            totalItems / itemsPerPage
                          );

                          return (
                            <h1 className="text-center lg:text-base text-sm">
                              Page: {currentPage} of {totalPages}
                            </h1>
                          );
                        })()}
                      </div>

                      {/* Next Page Button */}
                      {(() => {
                        let totalItems;
                        switch (selectedCategory) {
                          case "Paintings":
                            totalItems = arts.filter(
                              (art) => art.type === "paintings"
                            ).length;
                            break;
                          case "Drawings":
                            totalItems = arts.filter(
                              (art) => art.type === "drawings"
                            ).length;
                            break;
                          case "Sketches":
                            totalItems = arts.filter(
                              (art) => art.type === "sketches"
                            ).length;
                            break;
                          case "Book Covers":
                            totalItems = bookcovers.length;
                            break;
                          case "Posters":
                            totalItems = posters.length;
                            break;
                          case "Illustrations & Cards":
                            totalItems = illustrations.length;
                            break;
                          // Include other categories with their respective logic for totalItems
                          default:
                            totalItems = 0; // Handle any categories not explicitly mentioned
                        }

                        const totalPages = Math.ceil(totalItems / itemsPerPage);
                        const isLastPage = currentPage >= totalPages;

                        return (
                          <div
                            className={`flex flex-row gap-2 items-center ${
                              isLastPage
                                ? "cursor-not-allowed text-zinc-800 hover:text-zinc-900"
                                : "cursor-pointer"
                            }`}
                            onClick={!isLastPage ? handleNextPage : undefined}
                          >
                            <h1
                              className={`text-2xl lg:block hidden ${
                                isLastPage
                                  ? ""
                                  : "text-zinc-300 hover:text-white"
                              }`}
                            >
                              Next Page
                            </h1>
                            <FaArrowRightLong
                              className={`lg:text-2xl text-4xl ${
                                isLastPage ? "" : "text-white"
                              }`}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                // Search Screen
                <div className="grid lg:grid-cols-3 grid-cols-2 gap-2 items-center justify-center mt-12">
                  {isSearchLoading ? (
                    <div className="flex justify-center items-center mt-64 mx-auto col-span-3">
                      <AiOutlineLoading className="animate-spin text-7xl font-bold text-white" />
                    </div>
                  ) : (
                    Object.entries(groupedResults).map(([source, items]) => (
                      <div key={source} className="col-span-3">
                        <h2 className="text-2xl font-bold mb-4">{source}</h2>
                        <div className="grid lg:grid-cols-3 grid-cols-2 gap-2 items-center justify-center">
                          {items.map((result, index) => (
                            <div key={index} className="anim-appear-3">
                              {result.source !== "Writing" ? (
                                <a
                                  data-fancybox
                                  data-src={`${result.imageUrl}`}
                                  data-caption={`<div style='text-align: center;'>${
                                    result.title
                                  }<br><div style='color: #fde68a;'>${result.tags.join(
                                    ", "
                                  )}<br>${result.tags_Bangla.join(
                                    ", "
                                  )}</div></div>`}
                                >
                                  <Image
                                    src={result.imageUrl}
                                    alt={result.title}
                                    width={500}
                                    height={500}
                                    objectFit="cover"
                                    className="w-full lg:h-[25vw] h-[40vw] object-cover border-4 border-black mb-2 hover:scale-105"
                                  />
                                </a>
                              ) : (
                                <div>
                                  <Link href={`/category/writing/${result.id}`}>
                                    <div className="relative group cursor-pointer">
                                      {result.imageUrl ? (
                                        <Image
                                          src={result.imageUrl}
                                          alt={result.title}
                                          width={500}
                                          height={500}
                                          objectFit="cover"
                                          className="w-full lg:h-[20vw] h-[35vw] object-cover border-4 border-black mb-2 transition-all duration-500 ease-in-out group-hover:brightness-[.2] group-hover:border-8"
                                        />
                                      ) : (
                                        <div className="w-full lg:h-[20vw] h-[35vw] flex items-center justify-center border-4 border-black mb-2 bg-gray-100 transition-all duration-500 ease-in-out group-hover:brightness-[0.2] group-hover:border-8 group-hover:text-gray-100 text-black">
                                          <span className="lg:text-4xl text-2xl font-bold text-center overflow-hidden text-ellipsis p-4">
                                            {result.title}
                                          </span>
                                        </div>
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                                        <h1 className="text-white text-3xl font-bold custom-font">
                                          View Writing
                                        </h1>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              )}

                              <div className="mb-2 custom-font">
                                <h1 className="text-center text-base font-bold px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                  {result.title}
                                </h1>
                                {result.source !== "Writing" ? (
                                  <h1 className="text-center bangla-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                    ( {result.title} )
                                  </h1>
                                ) : (
                                  <div>
                                    <h1 className="text-center bangla-font text-2xl px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                      {result.title}
                                    </h1>
                                    {isExtendedWriting(result) && (
                                      <div>
                                        <h1 className="text-center custom-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                          Written By: {result.author}
                                        </h1>
                                        <h1 className="text-center custom-font text-base px-1 whitespace-nowrap text-ellipsis overflow-hidden">
                                          Published By: {result.publisher}
                                        </h1>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* {"width" in result && "height" in result ? (
                                  <h1 className="text-center text-xs px-1">
                                    {result.measurement}
                                  </h1>
                                ) : "publisher_Bangla" in result ? (
                                  <h1 className="text-center text-xs px-1">
                                    {result.publisher}
                                  </h1>
                                ) : null} */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {/* Navbar */}
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      </div>
    </main>
  );
}
