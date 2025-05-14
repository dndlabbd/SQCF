// app/biography/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";

type Section = {
  title: string;
  yearRange: string;
  imageUrl: string;
  content: string;
};

export default function BiographyPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch("/api/getBiography");
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error(err);
        setError("Could not load biography sections.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSections();
  }, []);

  const backgroundClasses = [
    "bg-[#0f0f0f]", "bg-[#1a1a1a]", "bg-[#2a2a2a]", "bg-[#1e1e1e]",
    "bg-[#151515]", "bg-[#121212]", "bg-[#262626]"
  ];

  if (isLoading) {
    return <div className="text-black p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-10">{error}</div>;
  }

  return (

    <main className="min-h-screen bg-black text-white py-12 px-6">
  <nav className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50">  
    <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
  </nav>
  {!isMenuOpen && (
    //  <div className="relative">  
    // <div className="py-28 px-4 max-w-6xl mx-auto">
    <div className="mt-10 lg:mx-32 mx-0 lg:px-0 lg:py-8 p-8">
      {/* <h1 className="text-5xl font-bold mb-16 text-center text-lime-400">Explore His Life</h1> */}
      {/* Intro Heading */}
  <div className="mb-16 text-center max-w-4xl mx-auto">
    <h1 className="lg:text-6xl text-4xl font-bold text-white mb-6"> 
      Qayyum Chowdhury’s Life, 1932–2014
    </h1>
    <p className="text-lg text-gray-300 leading-relaxed">
      Qayyum Chowdhury was one of the most prominent artists of Bangladesh. With a career spanning over six decades, he left a lasting impact on fine arts, book cover design, and visual culture. Explore the key moments and contributions of his extraordinary journey.
    </p>
  </div>
  {/* Original title */}
      <h1 className="lg:text-6xl text-4xl custom-font anim-appear-3 text-lime-400 -mt-6 mb-8" >Explore His Life</h1>
      <div className="relative border-l-4 border-lime-400 pl-6 space-y-20">
        {sections.map((section, index) => (
          <div
            key={index}
            onClick={() => router.push(`/main/biography/${index}`)}
            className="relative flex flex-col md:flex-row md:items-center gap-6 cursor-pointer hover:bg-lime-800 transition rounded-xl p-4"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-3.5 top-4 w-5 h-5 rounded-full bg-lime-500 border-4 border-black"></div>

            {/* Left side: Year + Text */}
            <div className="md:w-1/3 text-left">
              <p className="text-lg font-semibold text-lime-400">{section.yearRange}</p>
              <h2 className="text-xl font-bold mt-1 text-white">{section.title}</h2>
              <p className="text-sm text-gray-300 mt-2 line-clamp-4 pr-4">
                {section.content.slice(0, 150)}...
              </p>
            </div>

            {/* Right side: Image */}
            <div className="md:w-2/3 flex justify-end">
              <div
                className="relative w-full h-64 md:h-72 rounded-3xl"
                style={{ width: '600px', height: '350px' }}
              >
                <Image
                  src={section.imageUrl}
                  alt={section.title}
                  fill
                  className="object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
  ) }  
</main>

  );
}
