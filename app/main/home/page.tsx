"use client";

import Image from "next/image";
import Link from "next/link";
import "/public/styles/home.css";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import React, { useRef, useEffect, useState } from "react";
import ErrorScreen from "@/components/error";
import { FaArrowRight } from "react-icons/fa6";
import Navbar from '@/components/navbar';

export default function Home() {

  // Retrieving Data
  interface Art {
    title: string;
    title_Bangla: string;
    year: string;
    year_Bangla: string;
    imageUrl: string;
    description: string;
    width: string;
    height: string;
    medium: string;
    medium_Bangla: string;
    type: string;
    publication: string;
    tags: [string];
    tags_Bangla: [string];
  }

  const [arts, setArts] = useState<Art[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const specificArtTitleArray = [
    "Collecting Shapla",
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const fetchPromises = specificArtTitleArray.map((title) =>
          fetch(`/api/getArt?title=${title}`).then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
        );
        const results = await Promise.all(fetchPromises);
        setArts(results);
        setIsReady(true);
      } catch (error) {
        console.error("Failed to fetch arts:", error);
        setError("Failed to load artworks. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    return;
  }, []);

  if (!isReady || isLoading) return <div className="bg-black w-full h-full"></div>;
  if (error) return <ErrorScreen />;

  Fancybox.bind("[data-fancybox]", {
    // Your custom options
  });

  return (
    <main className="bg-[#000000] text-white h-max-screen w-full">

      <div className="flex flex-col">

        {/* Navbar */}
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Main Code */}
        {!isMenuOpen ? (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between anim-appear-4 mt-20">
            <div className="lg:w-1/2 px-4 lg:px-16 h-full mt-20">
              <h1 className="custom-font lg:text-6xl text-5xl lg:mt-0 mt-8 lg:mx-0 mx-4 text-white leading-[4.2rem]">
                Discover the Life and Work of Artist Qayyum Chowdhury
              </h1>
              <p className="custom-font text-2xl text-white mt-8 lg:mx-0 mx-4">
                Explore the collection of his paintings, drawings, writings and more.
              </p>
              <hr className="my-6 opacity-0"></hr>
              <Link href="contents"
                className="text-3xl text-gray-300 hover:text-white
                flex flex-row items-center justify-start lg:mx-0 mx-4
                transform hover:translate-x-1">
                  <FaArrowRight></FaArrowRight>
                  <p className="custom-font text-3xl ml-3 text-gray-300 hover:text-white">Explore</p>
              </Link>
            </div>
            <div className="lg:flex hidden mr-16 mt-20">
              <hr className="border-gray-50 mt-14 border-2 mx-auto w-[80dvw] lg:hidden block"></hr>
              <div className="lg:flex lg:justify-center">
                <div className="lg:mx-0 mx-6">
                  <div className="perspective-container">
                    <a
                      data-fancybox
                      data-src={`${arts[0].imageUrl}`}
                      data-caption={`<div style='text-align: center;'>${arts[0].title}<br><div style='color: #fde68a;'>${arts[0].tags ? arts[0].tags.join(', ') : ""}<br>${arts[0].tags_Bangla ? arts[0].tags_Bangla.join(', ') : ""}</div></div>`}
                    >
                      <Image
                        src={`${arts[0].imageUrl ? arts[0].imageUrl : ""}`}
                        alt={`${arts[0].title}`}
                        height={550}
                        width={550}
                        objectFit="contain"
                        className="image-zoom-2 rounded image-3d-hover"
                      />
                    </a>
                    <p className="bangla-font text-center my-4 text-xl">{`${arts[0].title_Bangla}`}
                    &nbsp;- শিল্পী কাইয়ুম চৌধুরী</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:hidden block py-10">
              <br></br>
            </div>
          </div>
        ):(<div></div>)}

      </div>

    </main>
  );
}
