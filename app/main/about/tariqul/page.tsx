"use client";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import React, { useState } from 'react';
import Navbar from "@/components/navbar";

export default function Tariqul() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return <main className="bg-[#000000] h-[100dvh] w-[100dvw] text-white p-8">
    <div className="h-full w-full flex flex-col items-center justify-center">

    <div className="anim-appear-3 z-50">
      {/* Navbar */}
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </div>

      <div>
        <h1 className="text-5xl text-center">Under Development</h1>
      </div>
    </div>
  </main>;
}
