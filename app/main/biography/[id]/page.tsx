"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";

type Section = {
  title: string;
  imageUrl: string;
  content: string;
};

export default function BiographyDetailPage() {
  const { id } = useParams();
  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      const res = await fetch("/api/getBiography");
      const data = await res.json();
      // const sectionData = data.sections[parseInt(id as string)];
      const idStr = Array.isArray(id) ? id[0] : id;
      const sectionData = data[parseInt(idStr)];

      setSection(sectionData);
    };

    if (id !== undefined) fetchSection();
  }, [id]);

  if (!section) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <nav className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50">
  <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} />
</nav>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{section.title}</h1>
        {section.imageUrl && (
          <Image
            src={section.imageUrl}
            alt={section.title}
            width={800}
            height={500}
            className="rounded-lg mb-6"
          />
        )}
        <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
          {section.content}
        </p>
      </div>
    </main>
  );
}
