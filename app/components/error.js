import React from "react";
import { PiSmileySadBold } from "react-icons/pi";

const ErrorScreen = () => {
  return (
    <div className="bg-black w-[100%]">
        <div className="flex lg:flex-row flex-col space-x-4 justify-center items-center h-screen">
            {/* Error text */}
            <div className="text-white lg:mb-8 mb-6 lg:text-[2em] text-2xl text-center  appear">
                OOPS! Something went wrong. Please try again later.
            </div>
            <div className="text-white lg:text-[3em] text-[5em] lg:mb-8 mb-20">
                <PiSmileySadBold />
            </div>
        </div>
    </div>
  );
};

export default ErrorScreen;
