import "/public/styles/loader.css"; // Adjust the path as necessary
import React, { useEffect, useState } from "react";

const quotes = [
  "Qayyum Chowdhury’s artistry and teaching have profoundly shaped Bangladesh’s cultural and artistic landscape, inspiring future generations.",
  "Through his pioneering brushstrokes, Qayyum Chowdhury painted not just canvases, but also the vision of a culturally enriched Bangladesh, weaving tradition with modernity.",
  "Qayyum Chowdhury's legacy is a testament to the power of art in shaping minds and society, proving that creativity transcends boundaries and generations.",
  "As an educator, artist, and visionary, Qayyum Chowdhury's life was a masterpiece of dedication to the arts, illuminating paths for those who dare to dream.",
  "In every line and color, Qayyum Chowdhury captured the essence of Bangladeshi heritage, crafting a dialogue between the past and the present through his art.",
  "Qayyum Chowdhury's innovative spirit in the realm of print and design has left an indelible mark on the fabric of Bangladeshi culture, inspiring a legacy of artistic excellence and exploration.",
  "Qayyum Chowdhury's art transcended mere aesthetics, embedding itself into the soul of Bangladesh's cultural identity, guiding future creatives towards a horizon where tradition and innovation converge seamlessly.",
];

const LoadingScreen = () => {
  const [randomQuote, setRandomQuote] = useState(quotes[0]); // Set an initial quote
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Function to select a random quote
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]);
      setTimeout(() => setShowLoading(false), 5000); // Minimum duration
    };

    // Call the function to get a random quote after a short delay
    const timer = setTimeout(getRandomQuote, 5000); // Adjust the delay as necessary

    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center lg:h-screen h-[100dvh] bg-black ${
        showLoading ? '' : 'hidden'
      }`}
    >
      {/* Loading text */}
      <div className="text-white lg:mb-8 mb-20 lg:text-[2em] text-2xl text-center w-[85%] leading-tight appear">
        {randomQuote}
      </div>

      {/* Loading bar container */}
      <div className="loading-bar-container">
        {/* Loading bar */}
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;