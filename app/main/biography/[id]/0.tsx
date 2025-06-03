"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/navbar";
import LoadingScreen from "@/components/LoadingScreen";

export default function BiographySection0() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Match content page loading time

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
        <h1 className="text-4xl font-bold mb-6">প্রারম্ভিক জীবন ও শিক্ষা</h1>
        <p className="text-lg text-gray-400 mb-8">১৯৩২–১৯৪৯</p>
        <div className="relative">
          {/* Image Section */}
          <div className="float-left mr-6 mb-4">
            <Image
              src="/images/youngKc.png"
              alt="প্রারম্ভিক জীবন ও শিক্ষা"
              width={400}
              height={300}
              className="rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="text-justify">
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              কাইয়ুম চৌধুরী ১৯৩২ সালে ফেনীতে জন্মগ্রহণ করেন। তাঁর পিতা আবদুল কুদ্দুস চৌধুরী ছিলেন একজন জমিদার এবং তাঁর পরিবার শিক্ষার প্রতি বিশেষ গুরুত্ব দিত। শৈশবে তিনি চট্টগ্রামে চলে আসেন এবং বিভিন্ন স্কুলে পড়াশোনা করেন। ১৯৪৯ সালে তিনি ম্যাট্রিকুলেশন পরীক্ষায় উত্তীর্ণ হন।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              শৈশবে কাইয়ুম চৌধুরী ছিলেন অত্যন্ত কৌতূহলী এবং সৃজনশীল। তিনি প্রকৃতির প্রতি গভীর আগ্রহী ছিলেন এবং ছোটবেলায়ই আঁকাআঁকির প্রতি ঝোঁক দেখিয়েছিলেন। তাঁর পরিবার তাঁর সৃজনশীলতাকে উৎসাহিত করত এবং তাঁকে বিভিন্ন শিল্পকর্মের সাথে পরিচিত করিয়ে দিত।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              চট্টগ্রামে পড়াশোনার সময় তিনি স্থানীয় শিল্পীদের কাজ দেখে অনুপ্রাণিত হন। তাঁর শিক্ষকেরা তাঁর প্রতিভা দেখে মুগ্ধ হন এবং তাঁকে শিল্পকলার প্রতি আরও মনোযোগী হতে উৎসাহিত করেন। এই সময়েই তিনি জলরঙ এবং পেন্সিল স্কেচে দক্ষতা অর্জন করেন।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              ১৯৪৯ সালে ম্যাট্রিকুলেশন পরীক্ষায় উত্তীর্ণ হওয়ার পর, তিনি ঢাকায় উচ্চশিক্ষার জন্য আসেন। ঢাকায় এসে তিনি আর্ট কলেজে ভর্তি হন, যেখানে তিনি শিল্পকলার বিভিন্ন দিক সম্পর্কে গভীর জ্ঞান অর্জন করেন। এখানেই তিনি তাঁর শিল্পীসত্তার বিকাশ ঘটান এবং ভবিষ্যতের জন্য একটি শক্তিশালী ভিত্তি তৈরি করেন।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              ঢাকায় এসে তিনি আর্ট কলেজে ভর্তি হন, যা পরবর্তীতে চারুকলা ইনস্টিটিউট নামে পরিচিতি লাভ করে। এখানে তিনি শিল্পকলার প্রতি গভীর আগ্রহী হয়ে ওঠেন এবং তাঁর প্রতিভার <br />
              বিকাশ ঘটে।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              তাঁর পরিবার শিক্ষার প্রতি অত্যন্ত মনোযোগী ছিল। শৈশবে তিনি চট্টগ্রামে বিভিন্ন স্কুলে পড়াশোনা করেন। ১৯৪৯ সালে ম্যাট্রিকুলেশন পরীক্ষায় উত্তীর্ণ হওয়ার পর তিনি উচ্চশিক্ষার জন্য ঢাকায় আসেন। ঢাকায় এসে তিনি আর্ট কলেজে ভর্তি হন, যা পরবর্তীতে চারুকলা ইনস্টিটিউট নামে পরিচিতি লাভ করে। এখানে তিনি শিল্পকলার প্রতি গভীর আগ্রহী হয়ে ওঠেন এবং তাঁর প্রতিভার বিকাশ ঘটে।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              তাঁর শিক্ষাজীবনের সময়ে তিনি বিভিন্ন সামাজিক ও সাংস্কৃতিক কার্যক্রমে অংশগ্রহণ করেন। তিনি তাঁর সহপাঠীদের মধ্যে একজন প্রভাবশালী ব্যক্তিত্ব হিসেবে পরিচিত ছিলেন। তাঁর শিল্পকর্মের প্রাথমিক পর্যায়ে তিনি জলরঙ এবং তেলরঙে দক্ষতা অর্জন করেন।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              ১৯৫০-এর দশকে তিনি শিল্পকলার জগতে প্রবেশ করেন এবং তাঁর কাজের জন্য বিভিন্ন পুরস্কার অর্জন করেন। তাঁর কাজের মধ্যে বাংলার গ্রামীণ জীবন, প্রকৃতি এবং ঐতিহ্যের প্রতিফলন দেখা যায়। তিনি শিল্পকলার মাধ্যমে সমাজের বিভিন্ন দিক তুলে ধরার চেষ্টা করেন এবং তাঁর কাজ সমসাময়িক শিল্পীদের মধ্যে বিশেষভাবে প্রশংসিত হয়।
            </p>
            <p className="text-lg leading-relaxed text-gray-300 mb-6">
              তাঁর শিল্পকর্মের পাশাপাশি তিনি একজন শিক্ষক হিসেবেও কাজ করেছেন। তিনি নতুন প্রজন্মের শিল্পীদের অনুপ্রাণিত করেছেন এবং তাঁদের দক্ষতা উন্নয়নে গুরুত্বপূর্ণ ভূমিকা পালন করেছেন। তাঁর জীবন ও কর্ম বাংলার শিল্পকলার ইতিহাসে একটি গুরুত্বপূর্ণ অধ্যায় হিসেবে বিবেচিত হয়।
            </p>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <a href="/main/biography" className="text-gray-400 hover:text-white">← Previous Page</a>
          <p>Page: 1 of 4</p>
          <a href="/main/biography/1" className="text-gray-400 hover:text-white">Next Page →</a>
        </div>
      </div>
    </main>
  );
}