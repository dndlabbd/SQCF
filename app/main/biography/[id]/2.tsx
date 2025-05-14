"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function BiographySection2() {
  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <nav className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50">
        <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} />
      </nav>
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-4xl font-bold mb-6">ক্যারিয়ার এবং অবদান</h1>
        <p className="text-lg text-gray-400 mb-4">১৯৫৫–১৯৮৪</p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="md:w-1/3">
            <Image
              src="/images/career&Contribution.png"
              alt="ক্যারিয়ার এবং অবদান"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-2/3">
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
              কাইয়ুম চৌধুরী তাঁর পেশাগত জীবনে বাংলাদেশের শিল্প আন্দোলনে
              গুরুত্বপূর্ণ ভূমিকা পালন করেন। তিনি শিক্ষক হিসেবে গভর্নমেন্ট আর্ট
              ইনস্টিটিউটে যোগ দেন এবং শিল্প শিক্ষার উন্নয়নে গুরুত্বপূর্ণ ভূমিকা
              রাখেন। তাঁর কাজের মধ্যে গ্রামীণ জীবনের প্রতিচ্ছবি এবং ঐতিহ্যের
              মিশ্রণ লক্ষ্যণীয়।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line mt-4">
              তিনি বইয়ের প্রচ্ছদ, পোস্টার, এবং চিত্রকর্মে নতুন মাত্রা যোগ করেন।
              তাঁর কাজের নান্দনিকতা এবং সৃজনশীলতা আজও সমাদৃত।
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}