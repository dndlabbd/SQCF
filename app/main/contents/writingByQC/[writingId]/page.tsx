"use client";

import Image from "next/image";
import Link from "next/link";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ErrorScreen from "@/components/error";
import axios from "axios";
import "/public/styles/home.css";
import Navbar from "@/components/navbar";

interface Writing {
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

export default function Writing({ params }: { params: { writingId: string } }) {
  const [writings, setWritings] = useState<Writing[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/getWritingByQC", {
          params: { writingId: params.writingId },
        });
        setWritings([response.data]);
      } catch (error) {
        console.error("Failed to fetch writings:", error);
      } finally {
        setIsReady(true);
        setIsLoading(false);
      }
    };
    const fetchDataTimeout = setTimeout(() => {
      fetchData(); // Call fetchData after the timeout
    }, 2500);

    return () => clearTimeout(fetchDataTimeout);
  }, []);

  if (!isReady || isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  Fancybox.bind("[data-fancybox]", {});

  return (
    <main className="text-white bg-black">
      <div className="h-full w-full">

        {!isMenuOpen ? (
          <div className="mt-32 lg:mx-32 mx-0 lg:px-0 lg:py-8 p-8 anim-appear-4">
            <div className="flex flex-row justify-between">
              <div>
                <h1 className="bangla-font lg:text-8xl text-6xl font-bold mb-3">
                  {writings[0].title}
                </h1>
                <h1 className="lg:text-xl text-base font-bold mb-2">
                  Published By: {writings[0].publisher}
                </h1>
                <h1 className="text-base mb-2">
                  {writings[0].subtitle}
                </h1>
                <h1 className="text-sm mb-8">
                  Published On: {writings[0].date}
                </h1>
              </div>
              <div className="lg:block hidden">
                <Link href='/main/contents' className="bg-zinc-900 p-4 rounded-sm hover:bg-zinc-700 whitespace-nowrap w-full">Go Back</Link>
              </div>
            </div>

            <hr className={`${writings[0].category=='Poem' ? 'lg:mb-20 mb-12' : 'mb-2'} `}></hr>

            <div className={`grid grid-cols-1 ${writings[0].category=='Poem' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-4 anim-appear-7`}>

              <div className={`order-2 ${writings[0].category=='Poem' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="bangla-font text-xl pb-8 lg:leading-10 text-justify pr-2 text-zinc-300">
                  {writings[0].text.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className={`order-1 ${writings[0].category=='Poem' ? 'lg:order-2' : 'lg:order-1'}`}>
                <a
                  data-fancybox
                  data-src={`${writings[0].imageUrl}`}
                  data-caption={`<div style='text-align: center;'>${
                    writings[0].imageAlt
                  }<br><div style='color: #fde68a;'>${writings[0].tags.join(
                    ", "
                  )}<br>${writings[0].tags_Bangla.join(", ")}</div></div>`}
                >
                  {writings[0].imageUrl ? (
                    <Image
                      src={writings[0].imageUrl}
                      alt={writings[0].title}
                      width={500}
                      height={500}
                      objectFit="cover"
                      className={`${writings[0].category=='Poem' ? 'w-full h-fit' : 'w-fit h-fit my-6'} object-cover mb-2 transition-all duration-500 ease-in-out group-hover:brightness-[.2] group-hover:border-8`}
                    />
                  ) : (
                    <div></div>
                  )}
                </a>
                <p className="bangla-font text-lg">{writings[0].imageAlt}</p>

                <div className={`${writings[0].imageUrl=='' && writings[0].category=='Poem' ? 'm-0' : 'my-4'}`}>
                  <p className="bangla-font text-lg text-amber-200 py-2">
                    English Tags: {writings[0].tags.join(", ")}
                  </p>
                  <p className="bangla-font text-lg text-amber-200 py-2">
                    Bangla Tags: {writings[0].tags_Bangla.join(", ")}
                  </p>
                </div>

                {writings[0].link !== "" && (
                  <div className="my-12">
                    <a
                      href={writings[0].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-300 text-black p-4 rounded-sm hover:bg-amber-200"
                    >
                      LINK TO ORIGINAL ARTICLE
                    </a>
                  </div>
                )}

                {writings[0].category!=='Poem' && (
                  <hr className="text-white my-8"></hr>
                )}

                <hr className="lg:hidden block mt-8"></hr>
              </div>

            </div>
            <hr className="my-8"></hr>

            <div className="block w-full mb-2">
              <Link href='/main/contents' className="bg-zinc-900 p-3 rounded-sm hover:bg-zinc-700 text-center block">Go Back</Link>
            </div>

            {/* Navbar */}
            <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </main>
  );
}
