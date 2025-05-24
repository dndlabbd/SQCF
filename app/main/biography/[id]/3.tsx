"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";

export default function BiographySection3() {
  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <nav className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50">
        <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} />
      </nav>
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-4xl font-bold mb-6">স্বীকৃতি এবং উত্তরাধিকার</h1>
        <p className="text-lg text-gray-400 mb-4">১৯৮৫–২০১৪</p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="md:w-1/3">
            <Image
              src="/images/recog&Legacy.png"
              alt="স্বীকৃতি এবং উত্তরাধিকার"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-2/3">
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
              কাইয়ুম চৌধুরী ১৯৮৪ সালে একুশে পদক লাভ করেন। তাঁর অবদানগুলোর মধ্যে
              রয়েছে আইকনিক বইয়ের প্রচ্ছদ, মুরাল, এবং চিত্রাঙ্কন। তিনি
              বাংলাদেশের শিল্পকলার ইতিহাসে একটি গুরুত্বপূর্ণ অধ্যায়।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line mt-4">
              ২০১৪ সালে একটি অনুষ্ঠানে বক্তৃতা দেওয়ার সময় তিনি মৃত্যুবরণ করেন।
              তাঁর কাজ এবং উত্তরাধিকার আজও শিল্পকলার জগতে অনুপ্রেরণা হিসেবে
              বিবেচিত হয়।
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <a
            href="/main/biography/2"
            className="text-gray-400 hover:text-white"
          >
            ← Previous Page
          </a>
          <p>Page: 4 of 4</p>
          <div className="invisible">Next Page →</div>
        </div>
      </div>
    </main>
  );
}