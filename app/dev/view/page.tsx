"use client";

import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import axios from "axios";
import "/public/styles/home.css";
import useAuth from "@/hooks/useAuth";
import { Login } from "@/components/login";
import Image from "next/image";
import Link from "next/link";

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

  if (isAuthenticated) {
    return (
      <div className="">
        <div className="flex-row flex justify-between items-center">
        <h1 className="m-2 text-3xl font-bold text-white">
          {artType === "art" ? "SQCF ART GALLERY (Viewing Art)" : artType === "graphicsDesign" ? "SQCF ART GALLERY (Viewing Graphics Design)" : ""}
        </h1>
            <Link
              href="javascript:void(0);" // Dummy href to satisfy the requirement
              onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                window.history.back(); // Navigate back to the previous page
              }}
              className="bg-emerald-950 text-white custom-font text-2xl px-4 py-1 rounded drop-shadow-lg mx-4"
            >
              Back
            </Link>
        </div>
        <hr className="border-b-2 border-white mt-2 mb-4 w-full"></hr>

        {/* Item Counter */}
        <div className="grid lg:grid-cols-8 grid-cols-2">
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-orange-100">Art Count: {arts.length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-rose-100">Painting Count: {arts.filter(art => art.type === "paintings").length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-green-100">Drawing Count: {arts.filter(art => art.type === "drawings").length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-amber-100">Sketch Count: {arts.filter(art => art.type === "sketches").length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-yellow-100">Graphics Design Count: {bookcovers.length + posters.length + illustrations.length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-fuchsia-100">Book Cover Count: {bookcovers.length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-pink-100">Poster  Count: {posters.length}</h1>
            <h1 className="m-1 text-sm font-bold mx-4 border-2 border-black p-2 shadow-lg bg-emerald-100">Illustration & Cards Count: {illustrations.length}</h1>
        </div>

        {/* For Art */}
        {artType == 'art' && (
        <div className="overflow-x-scroll m-4 border-4 border-zinc-500 h-[75dvh]">
          <table className="bg-slate-200 min-w-full ">
            <thead className="text-left align-top border-2">
              <tr>
                <th className="border-2 border-black px-4 py-2">Image</th>
                <th className="border-2 border-black px-4 py-2">ID</th>
                <th className="border-2 border-black px-4 py-2">Title</th>
                <th className="border-2 border-black px-4 py-2">
                  Title (Bangla)
                </th>
                <th className="border-2 border-black px-4 py-2">Year</th>
                <th className="border-2 border-black px-4 py-2">
                  Year (Bangla)
                </th>
                <th className="border-2 border-black px-4 py-2">Image URL</th>
                <th className="border-2 border-black px-4 py-2">Description</th>
                <th className="border-2 border-black px-4 py-2">Measurement</th>
                <th className="border-2 border-black px-4 py-2">
                  Measurement_Bangla
                </th>
                <th className="border-2 border-black px-4 py-2">Medium</th>
                <th className="border-2 border-black px-4 py-2">
                  Medium (Bangla)
                </th>
                <th className="border-2 border-black px-4 py-2">Type</th>
                <th className="border-2 border-black px-4 py-2">Publication</th>
                <th className="border-2 border-black px-4 py-2">Tags</th>
                <th className="border-2 border-black px-4 py-2">
                  Tags (Bangla)
                </th>
              </tr>
            </thead>
            <tbody className="text-left bg-slate-50">
              {arts.map((art) => (
                <tr key={art.id}>
                  <td className="border-2 border-black p-4"><div className="w-[200px]"><Image src={art.imageUrl} alt={art.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/></div></td>

                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.id}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.title}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.title_Bangla}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.year}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.year_Bangla}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.imageUrl}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem] text-justify">{art.description}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.measurement}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.measurement_Bangla}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.medium}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.medium_Bangla}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.type}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.publication}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.tags.join(", ")}</div></td>
                  <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{art.tags_Bangla.join(", ")}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* For Book Covers */}
        {artType === 'graphicsDesign' && category === 'bookCover' && (
          <div className="overflow-x-scroll m-4 border-4 border-black h-[75dvh]">
            <table className="bg-slate-200 min-w-full ">
              <thead className="text-left align-top border-2">
                <tr>
                  <th className="border-2 border-black px-4 py-2">Image</th>
                  <th className="border-2 border-black px-4 py-2">ID</th>
                  <th className="border-2 border-black px-4 py-2">Title</th>
                  <th className="border-2 border-black px-4 py-2">Publication Date</th>
                  <th className="border-2 border-black px-4 py-2">Image URL</th>
                  <th className="border-2 border-black px-4 py-2">Author</th>
                  <th className="border-2 border-black px-4 py-2">Publisher</th>
                  <th className="border-2 border-black px-4 py-2">Type</th>
                  <th className="border-2 border-black px-4 py-2">
                  Type (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Tags</th>
                  <th className="border-2 border-black px-4 py-2">
                    Tags (Bangla)
                  </th>
                </tr>
              </thead>
              <tbody className="text-left bg-slate-50">
                {bookcovers.map((bookcover) => (
                  <tr key={bookcover.id}>
                    <td className="border-2 border-black p-4"><div className="w-[200px]"><Image src={bookcover.imageUrl} alt={bookcover.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/></div></td>

                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.id}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.title}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.date}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.imageUrl}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.author}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.publisher}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.type}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.type_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.tags.join(", ")}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{bookcover.tags_Bangla.join(", ")}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* For Posters */}
        {artType === 'graphicsDesign' && category === 'poster' && (
          <div className="overflow-x-scroll m-4 border-4 border-black h-[75dvh]">
            <table className="bg-slate-200 min-w-full ">
              <thead className="text-left align-top border-2">
                <tr>
                  <th className="border-2 border-black px-4 py-2">Image</th>
                  <th className="border-2 border-black px-4 py-2">ID</th>
                  <th className="border-2 border-black px-4 py-2">Title</th>
                  <th className="border-2 border-black px-4 py-2">
                    Title (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Year</th>
                  <th className="border-2 border-black px-4 py-2">
                  Year (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Image URL</th>
                  <th className="border-2 border-black px-4 py-2">Description</th>
                  <th className="border-2 border-black px-4 py-2">For Whom</th>
                  <th className="border-2 border-black px-4 py-2">Width</th>
                  <th className="border-2 border-black px-4 py-2">Height</th>
                  <th className="border-2 border-black px-4 py-2">Category</th>
                  <th className="border-2 border-black px-4 py-2">Tags</th>
                  <th className="border-2 border-black px-4 py-2">
                    Tags (Bangla)
                  </th>
                </tr>
              </thead>
              <tbody className="text-left bg-slate-50">
                {posters.map((poster) => (
                  <tr key={poster.id}>
                    <td className="border-2 border-black p-4"><div className="w-[200px]"><Image src={poster.imageUrl} alt={poster.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/></div></td>

                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.id}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.title}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.title_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.year}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.year_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.imageUrl}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem] text-justify">{poster.description}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.for_whom}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.width}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.height}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.category}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.tags.join(", ")}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{poster.tags_Bangla.join(", ")}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* For Illustrations */}
        {artType === 'graphicsDesign' && category === 'illustration' && (
          <div className="overflow-x-scroll m-4 border-4 border-black h-[75dvh]">
            <table className="bg-slate-200 min-w-full ">
              <thead className="text-left align-top border-2">
                <tr>
                  <th className="border-2 border-black px-4 py-2">Image</th>
                  <th className="border-2 border-black px-4 py-2">ID</th>
                  <th className="border-2 border-black px-4 py-2">Title</th>
                  <th className="border-2 border-black px-4 py-2">
                    Title (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Year</th>
                  <th className="border-2 border-black px-4 py-2">
                  Year (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Image URL</th>
                  <th className="border-2 border-black px-4 py-2">Description</th>
                  <th className="border-2 border-black px-4 py-2">Sub Title</th>
                  <th className="border-2 border-black px-4 py-2">
                  Sub Title (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Publisher</th>
                  <th className="border-2 border-black px-4 py-2">
                  Publisher (Bangla)
                  </th>
                  <th className="border-2 border-black px-4 py-2">Tags</th>
                  <th className="border-2 border-black px-4 py-2">
                    Tags (Bangla)
                  </th>
                </tr>
              </thead>
              <tbody className="text-left bg-slate-50">
                {illustrations.map((illustration) => (
                  <tr key={illustration.id}>
                    <td className="border-2 border-black p-4"><div className="w-[200px]"><Image src={illustration.imageUrl} alt={illustration.title} width={250} height={250} objectFit="contain" className="h-auto w-min-[250px]"/></div></td>

                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.id}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.title}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.title_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.year}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.year_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.imageUrl}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem] text-justify">{illustration.description}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.subtitle}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.subtitle_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.publisher}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.publisher_Bangla}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.tags.join(", ")}</div></td>
                    <td className="border-2 border-black px-4 py-1"><div className="h-max-[20rem] h-min-fit w-min-fit w-max-[25rem]">{illustration.tags_Bangla.join(", ")}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {artType == 'graphicsDesign' && (
        <div className="mt-4 grid lg:grid-cols-3 gird-cols-1 mx-4">
        <button
            className="bg-lime-800 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handleCover}
          >
            Book Covers
          </button>
          <button
            className="bg-green-800 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handlePoster}
          >
            Posters
          </button>
          <button
            className="bg-lime-600 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handleIllustration}
          >
            Illustrations
          </button>
        </div>
        )}

        <div className="mt-4 grid lg:grid-cols-4 gird-cols-2 mx-4">
        <button
            className="bg-zinc-800 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handleArt}
          >
            View Art
          </button>
          <button
            className="bg-gray-800 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handleGraphicsDesign}
          >
            View Graphics Design
          </button>
          <button
            className="bg-sky-800 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handlerefresh}
          >
            Refresh
          </button>
          <button
            className="bg-rose-800 text-white p-2 rounded-sm border border-black transform mb-4 w-[95%] drop-shadow-lg"
            onClick={handleSubmit2}
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

export default ViewArt;
