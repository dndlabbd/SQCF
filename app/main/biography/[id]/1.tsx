"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import LoadingScreen from "@/components/LoadingScreen";

export default function BiographySection1() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <nav className="bg-black text-white shadow-md fixed top-0 left-0 w-full z-50">
        <Navbar isMenuOpen={false} setIsMenuOpen={() => {}} />
      </nav>
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-4xl font-bold mb-6">শিক্ষাজীবন ও প্রাথমিক কর্মজীবন</h1>
        <p className="text-lg text-gray-400 mb-8">১৯৫০–১৯৬০</p>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="md:w-1/3">
            <Image
              src="/images/ArtInstitute.png"
              alt="আর্ট ইনস্টিটিউট এবং গঠনমূলক বছর"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-2/3">
            <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
              কাইয়ুম চৌধুরী ম্যাট্রিকুলেশন পরীক্ষার পর ঢাকার গভর্নমেন্ট আর্ট
              ইনস্টিটিউটে ভর্তি হন। সেখানে তিনি বিখ্যাত শিল্পী জয়নুল আবেদিনের
              তত্ত্বাবধানে চারুকলা ও গ্রাফিক আর্টে দক্ষতা অর্জন করেন। ১৯৫৪ সালে
              তিনি স্নাতক ডিগ্রি অর্জন করেন।
            </p>
            {/* Additional content omitted for brevity */}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <a href="/main/biography/0" className="text-gray-400 hover:text-white">
            ← Previous Page
          </a>
          <p>Page: 2 of 4</p>
          <a href="/main/biography/2" className="text-gray-400 hover:text-white">
            Next Page →
          </a>
        </div>
      </div>
    </main>
  );
}