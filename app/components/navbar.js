import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const linkStyle = (path) => {
    return pathname === path ? "border-b-2 border-white" : "";
  };

  // console.log("Pathname: ", pathname);

  return (
    <div className="anim-appear-3 z-50">
      {/* Navbar */}
      {isMenuOpen ? (
        // Mobile
        <div className="text-blackflex flex-col bg-white h-[100dvh] z-40">
          <div className="bg-white">
            <nav className="w-full z-20 top-0 start-0">
              <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
                <a
                  href="/"
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                  <span className="self-center text-2xl text-black font-semibold whitespace-nowrap appear">
                    SQCF
                  </span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                  <button
                    onClick={toggleMenu}
                    data-collapse-toggle="navbar-sticky"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-900"
                    aria-controls="navbar-sticky"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 17 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                  id="navbar-sticky"
                ></div>
              </div>
            </nav>
          </div>
          <div className="appeaar">
            <ul className="flex flex-col items-start justify-center px-8 py-4 space-y-10 h-[65dvh]">
              <li>
                <h1 className="custom-font text-3xl my-4 text-black">Menu</h1>
                <hr className="w-[85dvw] border-2 border-gray-800"></hr>
              </li>
              <li>
                <Link
                  href="home"
                  className="text-2xl text-black custom-font rounded-lg py-2"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="contents"
                  className="text-2xl text-black custom-font rounded-lg py-2"
                >
                  Arts & Writings
                </Link>
              </li>
              <li>
                <Link
                  href="catalog"
                  className="text-2xl text-zinc-300 custom-font rounded-lg py-2"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="biography"
                  className="text-2xl text-zinc-300 custom-font rounded-lg py-2"
                >
                  Biography
                </Link>
              </li>
              <li>
                <Link
                  href="about"
                  className="text-2xl text-black custom-font rounded-lg py-2"
                >
                  About
                </Link>
              </li>
              <li>
                <hr className="w-[85dvw] border-2 border-gray-800"></hr>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // Desktop
        <div className="h-full w-full">
          <nav className="fixed w-full top-0 start-0 z-50 bg-black">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto lg:px-8 px-8 lg:py-6 py-4 w-full">
              <a
                href="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <span className="self-center text-2xl font-semibold whitespace-nowrap appear">
                  SQCF
                </span>
              </a>
              <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button
                  onClick={toggleMenu}
                  data-collapse-toggle="navbar-sticky"
                  type="button"
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
                  aria-controls="navbar-sticky"
                  aria-expanded={isMenuOpen ? "true" : "false"}
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </button>
              </div>
              <div
                className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                id="navbar-sticky"
              >
                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                  <li>
                    <Link href="/main/home">
                      <p className={`nav-link ${linkStyle("/main/home")}`}>
                        Home
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/contents">
                      <p className={`nav-link ${linkStyle("/main/contents")}`}>
                        Arts & Writings
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/catalog"> 
                    {/* className="pointer-events-none"> */}
                    <p className={`nav-link ${linkStyle("/main/catalog")}`}>
                        Catalog
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/biography">
                     {/* className="pointer-events-none"> */}
                      {/* <p className={'text-zinc-800'}> */}
                      <p className={`nav-link ${linkStyle("/main/biography")}`}>
                        {/* Biography */}
                        Biography
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/main/about">
                      <p className={`nav-link ${linkStyle("/main/about")}`}>
                        About
                      </p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
