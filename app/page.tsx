"use client";

import Image from "next/image";
import "/public/styles/home.css";
import classnames from "classnames";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { FaArrowRight } from "react-icons/fa6";
import { IoMenuOutline } from "react-icons/io5";
import { GrNext } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import { IoAppsSharp } from "react-icons/io5";
import LoadingScreen from '@/components/LoadingScreen';
import ErrorScreen from '@/components/error';
import { useRouter } from 'next/navigation';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function Home() {

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const router = useRouter();

  const handleNext = (index: number) => {
    let new_index = index + 1;
    if (new_index >= arts.length) {
      new_index = 0;
    }

    // Construct the new URL with the currentArtIndex parameter
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?currentArtIndex=${new_index}`;

    // Set the window's location to the new URL, triggering a page reload
    window.location.href = newUrl;
  };

  const handleBack = (index: number) => {
    let new_index = index - 1;
    if (new_index <= -1) {
      new_index = arts.length - 1;
    }

    // Construct the new URL with the currentArtIndex parameter
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?currentArtIndex=${new_index}`;

    // Set the window's location to the new URL, triggering a page reload
    window.location.href = newUrl;
  };

  const handleMenuItemClick = (index: number) => {
    // Construct the new URL with the currentArtIndex parameter
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?currentArtIndex=${index}`;

    // Set the window's location to the new URL, triggering a page reload
    window.location.href = newUrl;
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  interface Art {
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
  }

  const [arts, setArts] = useState<Art[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  const specificArtTitleArray = [
    "Boat in moonlight",
    "High noon",
    "Independence",
    "Collecting Shapla",
    "Quest for Self-9",
    "Quest for Self-45",
    "Quest for self-63",
  ];

  const colorArray = [
    // "#ec1f2e",
    // "#FBA834",
    // "#333A73",
    // "#FF9843",
    // "#402B3A",
    // "#D63484",
    // "#9ADE7B",
    "#000000",
    "#080402",
    "#0D0907",
    "#050100",
    "#030001",
    "#040200",
    "#000302",
  ];

  const imageCache = new Map();

  const preloadImages = (arts: Art[], currentArtIndex?: number) => {
    const loadImage = (src: string) => new Promise((resolve, reject) => {
      if (imageCache.has(src)) {
        resolve(imageCache.get(src)); // Use cached image
        return;
      }
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        imageCache.set(src, img); // Add to cache
        resolve(img);
      };
      img.onerror = reject;
    });

    // Ensure currentArtIndex is a valid index; otherwise, default to 0
    const validIndex = typeof currentArtIndex === 'number' && currentArtIndex >= 0 && currentArtIndex < arts.length ? currentArtIndex : 0;

    // Load the image at currentArtIndex or 0
    return loadImage(arts[validIndex].imageUrl);
  };

  useEffect(() => {

    let params = new URLSearchParams(window.location.search);
    let indexFromUrl = params.get('currentArtIndex');
    console.log("Current Index: ", indexFromUrl)
    if (indexFromUrl) {
      setCurrentArtIndex(Number(indexFromUrl));
    } else {
      setCurrentArtIndex(Number('0'));
    }

    const fetchData = async () => {

      try {
        const fetchPromises = specificArtTitleArray.map(title =>
          fetch(`/api/getArt?title=${title}`).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // console.log("Response: ", response.json())
            return response.json();
          })
        );
        const results = await Promise.all(fetchPromises);
        setArts(results);
        await preloadImages(results);
      } catch (error) {
        console.error('Failed to fetch arts:', error);
        setError('Failed to load artworks. Please try again later.');

      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    const fetchDataTimeout = setTimeout(() => {
      fetchData(); // Call fetchData after the timeout
    }, 2500);

    return () => clearTimeout(fetchDataTimeout);

  }, [router]);

  if (!isReady || isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  Fancybox.bind("[data-fancybox]", {});
  Fancybox.bind("[data-fancybox-2]", {});

  return (
    <main className="bg-black">
      <div className={classnames("bg-black w-[100vw] h-[100dvh] absolute top-0 left-0 z-50", {"fade-in": !isLoading && isReady} )}></div>

      <div className={`flex flex-col ${isMenuVisible ? 'hidden' : ''} ${isDescriptionVisible ? 'hidden' : ''}`}>
        {/* Landing Image */}
        <div className="relative lg:w-screen lg:h-screen h-[100dvh] w-[100dvw] overflow-hidden">
          <div
            style={{ borderColor: colorArray[currentArtIndex] || colorArray[0], borderWidth: '0px', borderStyle: 'solid' }}
            className="m-0 absolute inset-0 image-container"
          >
            <Image
              src={`${arts[currentArtIndex].imageUrl}`}
              alt="High Noon"
              layout="fill"
              objectFit="cover"
              className="image-zoom" // Applied zoom-in class to the image
            />
          </div>
        </div>

        {/* Logo */}
        <div className="absolute top-0 left-0 lg:p-[2.5em] p-[1em] anim-appear-2">
          <div className="flex items-center justify-center w-[75px] lg:w-[150px] h-[75px] lg:h-[150px] bg-[#f3ecdc] pr-1">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={75}
              height={75}
              className="w-auto lg:h-[140px] h-[70px]"
            />
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center lg:justify-center justify-end w-screen lg:h-screen h-[100dvh] absolute">
            <h1 className="text-4xl lg:text-[5rem] font-extrabold text-white text-center anim-appear custom-font drop-shadow-[0_2px_1.2px_rgba(0,0,0,0.8)]">{arts[currentArtIndex].title!=="" ? arts[currentArtIndex].title : "Title Not Found"}</h1>
            <div className="lg:mt-14 mt-4 lg:mb-2 mb-6 lg:space-y-4">
              <h3 className="text-lg lg:text-[2.1rem] text-white text-center anim-appear bangla-font drop-shadow-[0_1.3px_1.2px_rgba(0,0,0,0.9)]">{arts[currentArtIndex].title_Bangla!=="" ? arts[currentArtIndex].title_Bangla : ""} - শিল্পী কাইয়ুম চৌধুরী</h3>
              <h3 className="text-base lg:text-[1.4rem] text-white text-center anim-appear bangla-font drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)]">{arts[currentArtIndex].medium_Bangla!=="" ? arts[currentArtIndex].medium_Bangla : ""} - {arts[currentArtIndex].year_Bangla!=="" ? arts[currentArtIndex].year_Bangla : ""}</h3>
              {/* <h3 className="text-base lg:text-[1.4rem] text-white text-center anim-appear bangla-font">১৩০ সেমি x ১৫০ সেমি</h3> */}
            </div>
            <div>
              <div className="anim-appear-2 custom-link">
              <button onClick={toggleDescription}
              className="bg-black px-4 lg:py-4 py-3 border-2 border-white lg:px-24 lg:m-6
            hover:text-white lg:text-xl text-base flex items-center justify-center relative link-comp w-full
            transform lg:-translate-x-6 translate-x-0">
                <span className="text-gray-300 flex items-center justify-center hover:text-white duration-300">
                  <span className="relative hover-effect">বিস্তারিত জানুন</span>
                  <FaArrowRight className="ml-4 transform lg:-translate-x-1 -translate-x-1"/>
                </span>
              </button>
              </div>
            </div>
        </div>

        {/* Next Button only if currentArtIndex is not 6 */}
        {currentArtIndex !== arts.length - 1 && (
          <button onClick={() => handleNext(currentArtIndex)}>
            <div className="anim-appear-2 next-button-container">
              <div className="next-button">
                <GrNext className="lg:text-4xl text-4xl text-white"/>
              </div>
            </div>
          </button>
        )}

        {/* Next Button only if currentArtIndex is 6 */}
        {currentArtIndex == arts.length - 1 && (
          <Link href="/main/home">
            <div className="anim-appear-2 next-button-container">
              <div className="next-button">
                <GrNext className="lg:text-4xl text-4xl text-white"/>
              </div>
            </div>
          </Link>
        )}

        {/* View More Main Page */}
        <div className="absolute bottom-0 lg:block hidden anim-appear-2 left-1/2 mb-16">
          <Link href="/main/contents" className="bg-black p-2 flex justify-center items-center border-2
          border-white hover:shadow-lg text-gray-300 hover:text-white transform -translate-x-1/2">
            <IoAppsSharp className="text-xl mx-2"/>
            <h1 className="text-xl mr-2">View More</h1>
          </Link>
        </div>

        {/* Back Button, only if currentArtIndex is not 0 */}
        {currentArtIndex !== 0 && (
          <button onClick={() => handleBack(currentArtIndex)}>
            <div className="anim-appear-2 back-button-container">
              <div className="next-button">
                <GrNext className="lg:text-4xl text-4xl text-white transform rotate-180"/>
              </div>
            </div>
          </button>
        )}

        {/* Menu */}
        <div className="absolute anim-appear-2 top-0 right-0 lg:mr-[2.5em] lg:mt-[2.5em] mr-[1em] mt-[1em]">
          <button onClick={toggleMenu}>
            <div className="lg:p-3 p-4 bg-black border-white border-[3px]">
              <IoMenuOutline className="lg:text-4xl text-xl text-white"/>
            </div>
          </button>
        </div>

      </div>

      {/* ----------------------------------------------------------------- */}

      <div className={`${isMenuVisible ? '' : 'hidden'} ${isDescriptionVisible ? 'hidden' : ''}`}>

        <div className="flex h-screen bg-[whitesmoke]">

          {/* Left part with image */}
          <div
            style={{ borderColor: colorArray[currentArtIndex] || colorArray[0],
               borderWidth: '0px',
               borderStyle: 'solid',
               backgroundColor: colorArray[currentArtIndex] || colorArray[0]
              }}
            className="w-1/2 h-full relative overflow-hidden image-container hidden lg:flex"
          >
            <a
              data-fancybox
              data-src={`${arts[currentArtIndex].imageUrl}`}
              data-caption={`${arts[currentArtIndex].title}`}
            >
              <Image
                src={`${arts[currentArtIndex].imageUrl}`}
                alt={`${arts[currentArtIndex].title}`}
                layout="fill"
                objectFit="cover"
                className="image-zoom"
              />
            </a>

            {/* Title and button */}
            <div className="flex flex-col w-full items-center justify-end h-full anim-appear-3 pointer-events-none">
                <h1 className="text-2xl lg:text-[3rem] font-extrabold text-white text-center custom-font drop-shadow-[0_2px_1.2px_rgba(0,0,0,0.8)]">{arts[currentArtIndex].title!=="" ? arts[currentArtIndex].title : ""}</h1>
                <div className="lg:mt-6 mt-4 lg:mb-0 mb-8 lg:space-y-4">
                  <h3 className="text-lg lg:text-[1.5rem] text-white text-center bangla-font drop-shadow-[0_2px_1.2px_rgba(0,0,0,0.8)]">{arts[currentArtIndex].title_Bangla!=="" ? arts[currentArtIndex].title_Bangla : ""} - শিল্পী কাইয়ুম চৌধুরী</h3>
                </div>
                <div>
                  <div className="custom-link pointer-events-auto">
                  <button onClick={toggleDescription} className="bg-black px-4 lg:py-4 py-3 border-2 border-white lg:px-24 lg:m-6 hover:text-white lg:text-xl text-base flex items-center justify-center relative link-comp">
                    <span className="text-gray-300 flex items-center justify-center hover:text-white duration-300">
                      <span className="relative hover-effect">বিস্তারিত জানুন</span>
                      <FaArrowRight className="ml-4 transform lg:-translate-x-1 -translate-x-1"/>
                    </span>
                  </button>
                  </div>
                </div>
            </div>

          </div>

          {/* Right part with menu */}
          <div className="overflow-y-scroll lg:w-1/2 w-[92%] h-[75dvh] flex flex-col justify-start items-start transform translate-x-4 lg:translate-x-16 lg:mt-32 mt-0 lg:translate-y-2 translate-y-14">
            <ul className="">
              {/* Dynamically generate menu items, excluding the currentArtIndex */}
              {arts.map((art, index) => (
                index !== currentArtIndex && (
                  <button key={index} className="flex flex-col" onClick={() => handleMenuItemClick(index)}>
                    <li className="menu-item text-gray-800 hover-effect-black">&quot;{art.title !== "" ? art.title : ""}&quot;<p></p></li>
                    <p className="lg:ml-5 ml-3 lg:pt-0 pt-1 lg:text-base text-sm">{art.medium !== "" ? art.medium : ""} - {art.title_Bangla !== "" ? art.title_Bangla : ""} ({art.year_Bangla})</p>
                  </button>
                )
              ))}

              <Link href="/main/home" className="flex flex-col">
                <li className="menu-item text-red-800 hover-effect-red">-View More</li>
                <p className="lg:ml-5 ml-3 lg:pt-0 pt-1 lg:text-base text-sm">শিল্পী কাইয়ুম চৌধুরীর আরো শিল্প দেখুন</p>
              </Link>
            </ul>
          </div>

          {/* Menu Cross */}
          <div className="absolute anim-appear-3 top-0 right-0 lg:mr-[1.5em] lg:mt-[1.5em] mr-[0] mt-[0]">
            <button onClick={toggleMenu}>
              <div className="lg:p-3 p-4 bg-black">
                <IoClose  className="lg:text-4xl text-xl text-white"/>
              </div>
            </button>
          </div>

          {/* SQCF Foundation */}
          <div className="
          overflow-clip h-fit anim-appear-3
          lg:absolute lg:w-auto lg:top-0 lg:right-0 lg:mr-[5.75em] lg:mt-[1.5em]
          fixed w-[100dvw] bottom-0 mr-0 my-0">
            <Link href="/main/about">
              <div className="lg:py-4 lg:px-4 py-4 px-6 m-0 bg-black link-comp">
                <h1 className="text-white text-lg text-center hover-effect">ABOUT SQCF FOUNDATION</h1>
              </div>
            </Link>
          </div>

          {/* Logo */}
          <div className="absolute top-0 left-0 lg:p-[40px] anim-appear-2">
            <div className="lg:flex items-center justify-center w-[90px] lg:w-[100px] h-[90px] lg:h-[100px] bg-[#f3ecdc] pr-1 hidden">
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={90}
                height={90}
                className="w-auto lg:h-[90px] h-[70px]"
              />
            </div>
          </div>

          {/* Rotated Links */}
          <div className="flex flex-row absolute lg:bottom-0 lg:right-0 lg:left-auto left-0 transform lg:-rotate-90 rotate-0
          lg:-translate-y-44 -translate-y-[0px] lg:translate-x-[135px] -translate-x-0 text-gray-800">
              <Link href="/main/about/qayyum" className="bg-black text-white lg:text-base text-xs p-3 hover:bg-red-900">
                <p>Qayyum Chowdhury</p>
              </Link>
              <Link href="/main/about/tahera" className="bg-black text-white lg:text-base text-xs p-3 hover:bg-red-900">
                <p>Tahera Khanam</p>
              </Link>
          </div>

        </div>

      </div>


      {/* ----------------------------------------------------------------- */}

      <div className={`${isDescriptionVisible ? '' : 'hidden'}`}>
        <div className="flex lg:h-screen h-[100%] bg-[whitesmoke]">
            {/* Left part with image */}
            <div className="w-5/6 h-full overflow-hidden hidden relative lg:flex bg-[#111111]">
              <a
                data-fancybox-2
                data-src={`${arts[currentArtIndex].imageUrl}`}
                data-caption={`${arts[currentArtIndex].title}`}
              >
                <Image
                  src={`${arts[currentArtIndex].imageUrl}`}
                  alt={`${arts[currentArtIndex].title}`}
                  layout="fill"
                  objectFit="cover"
                  className="image-zoom2 drop-shadow-xl border-2 border-black"
                />
              </a>
            </div>

            {/* Right part with description */}
            <div className="overflow-y-scroll overflow-x-hidden lg:w-1/2 w-fit lg:h-[84%] h-[88%] flex flex-col lg:justify-start justify-start items-start bg-gray-100 transform translate-x-4 lg:translate-x-8 lg:mt-32 my-8 lg:-translate-y-12 translate-y-1 px-2">
              <br></br>

              <h1 className="w-[90%] custom-font leading-tight text-3xl lg:text-[2.5rem] anim-appear-4 text-[#898166]">{arts[currentArtIndex].title!=="" ? arts[currentArtIndex].title : ""}</h1>

              <p className="description lg:mt-6 custom-font text-lg lg:text-xl anim-appear-4 text-gray-800">{arts[currentArtIndex].title_Bangla!=="" ? arts[currentArtIndex].title_Bangla : ""} - শিল্পী কাইয়ুম চৌধুরী</p>

              <hr className="anim-appear-4 border w-full my-5 border-[#bbb190]"></hr>

              <p className="lg:mt-2 description text-base lg:text-xl anim-appear-4 text-gray-800 lg:w-5/6 w-[92%] text-justify font-light">
              {arts[currentArtIndex].description!=="" ? arts[currentArtIndex].description : ""}
              </p>
              <p className="mt-3 lg:mb-0 mb-3 description text-base lg:text-xl anim-appear-4 text-gray-800 w-5/6 text-justify font-light">
              {arts[currentArtIndex].publication!=="" ? arts[currentArtIndex].publication: ""}
              </p>

              <p className="lg:mt-4 mt-2 description custom-font text-base lg:text-xl anim-appear-4 text-gray-800 w-5/6 text-justify leading-10 font-light">
              {arts[currentArtIndex].measurement!=="" ? arts[currentArtIndex].measurement : ""}
              <br></br>
              {arts[currentArtIndex].medium_Bangla!=="" ? arts[currentArtIndex].medium_Bangla : ""} ({arts[currentArtIndex].medium!=="" ? arts[currentArtIndex].medium : ""})
              </p>

              {/* <p className="lg:mt-4 mt-2 custom-font text-base lg:text-xl anim-appear-4 text-gray-800 w-5/6 text-justify leading-10 font-light">
              Type: {arts.type!=="" ? arts.type : "Painting"}
              </p> */}

              <p className="custom-font description text-base lg:text-xl anim-appear-4 text-gray-800 w-5/6 text-justify leading-10 font-light">
              Year: {arts[currentArtIndex].year!=="" ? arts[currentArtIndex].year : ""}
              </p>


              <p className="lg:mt-4 mt-2 description custom-font text-sm lg:text-lg anim-appear-4 text-[#837341] w-5/6 text-justify leading-10 font-light">
                {Array.isArray(arts[currentArtIndex]?.tags) ? arts[currentArtIndex].tags.join(', ') : ""}
                {Array.isArray(arts[currentArtIndex]?.tags_Bangla) ? ', ' + arts[currentArtIndex].tags_Bangla.join(', ') : ""}
              </p>
              <br></br>

              {/* Image for mobile */}
              <div className="lg:hidden visible w-[92dvw] overflow-hidden mb-8 anim-appear">
                <a
                  data-fancybox-2
                  data-src={`${arts[currentArtIndex].imageUrl}`}
                  data-caption={`${arts[currentArtIndex].title}`}
                >
                  <Image
                    src={`${arts[currentArtIndex].imageUrl}`}
                    alt={`${arts[currentArtIndex].title}`}
                    width={500}
                    height={500}
                    layout="responsive"
                    objectFit="cover"
                    className="relative w-full image-zoom border-8 border-black my-2 shadow-lg"
                  />

                  <p className="text-center text-sm">CLICK IMAGE TO VIEW FULL PAINTING</p>
                </a>
              </div>
            </div>

            {/* Menu Cross */}
            <div className="absolute anim-appear-3 top-0 right-0 lg:mr-[1.5em] lg:mt-[1.5em] mr-[0] mt-[0]">
              <button onClick={toggleDescription}>
                <div className="lg:p-3 p-2 bg-black">
                  <IoClose  className="lg:text-4xl text-xl text-white"/>
                </div>
              </button>
            </div>

            {/* Next Button */}
            <button onClick={() => handleNext(currentArtIndex)}>
              <div className="anim-appear-2 fixed bottom-0 right-0">
                <div className="bg-black m-4 lg:p-4 p-3 lg:px-4 px-6">
                  <GrNext className="lg:text-2xl text-xl text-white"/>
                </div>
              </div>
            </button>
        </div>
      </div>

    </main>
  );
}