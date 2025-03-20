import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import modelImage from "../images/model.png";
import lipstickImage from "../images/sec1.png";
import jewelleryImage from "../images/sec2.png";
import foundationImage from "../images/sec3.png";
import blushImage from "../images/sec4.png";

const Landing: React.FC = () => {
  return (
    <>
      {/* <Navbar /> */}

      {/* Foundation Shades Try-On Section */}
      <section
        id="serum"
        className="bg-white py-12 md:py-16 2xl:py-24 relative"
      >
        <div className="w-[95%] 2xl:w-[85%] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          {/* Mobile view */}
          <div className="md:hidden mobile-section w-full text-center">
            <img
              src={foundationImage}
              alt="Foundation Shades Try-On"
              className="w-full rounded-lg mb-8"
            />
            <h2 className="text-4xl font-bold text-black mb-4">
              <span style={{ color: "#8590ff" }}>Soul Serum</span> Try-On
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              <em>Flawless Foundation, No More Guesswork</em>
            </p>
            <ul className="text-gray-600 mb-6 text-lg list-none">
              <li className="mb-2">
                Match foundation shades to your skin tone instantly.
              </li>
              <li>Say goodbye to returns and wrong purchases.</li>
            </ul>
            <div className="relative inline-block">
              <Link
                to="/serum-try-on"
                className="w-40 2xl:w-56 2k:w-80 4k:w-96 h-10 2xl:h-14 2k:h-24 4k:h-32 
                         bg-custom-blue hover:bg-opacity-90 transition-all duration-300 
                         flex items-center justify-center cursor-pointer 
                         rounded-lg 2xl:rounded-xl 2k:rounded-2xl 4k:rounded-3xl"
              >
                <span className="text-white font-bold text-sm 2xl:text-lg 2k:text-3xl 4k:text-4xl uppercase tracking-wider">
                  Try Now!
                </span>
              </Link>
              {/* Button effects - scaled up for larger screens */}
              <div className="absolute top-0 left-0 right-0 h-[1px] 2k:h-[2px] 4k:h-[3px] bg-white opacity-70"></div>
              <div className="absolute top-0 left-0 bottom-0 w-[1px] 2k:w-[2px] 4k:w-[3px] bg-white opacity-70"></div>
              <div className="absolute -bottom-1 2k:-bottom-2 4k:-bottom-3 left-0 right-0 h-[2px] 2k:h-[3px] 4k:h-[4px] bg-white opacity-20"></div>
              <div className="absolute -bottom-2 2k:-bottom-4 4k:-bottom-6 left-1 right-1 h-[2px] 2k:h-[3px] 4k:h-[4px] bg-white opacity-10"></div>
            </div>
            {/* Section Indicator */}
            {/* <div className="flex items-center mt-6 2k:mt-12 4k:mt-16">
              <span className="text-5xl 2xl:text-6xl 2k:text-8xl 4k:text-9xl font-bold text-custom-blue mr-2 2k:mr-4 4k:mr-6">
                03
              </span>
              <span className="text-xl 2xl:text-2xl 2k:text-4xl 4k:text-5xl text-gray-400">
                /04
              </span>

              <div className="flex ml-4 2k:ml-8 4k:ml-12">
                <div
                  className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-gray-600 
                              mr-2 2k:mr-4 4k:mr-6"
                ></div>
                <div
                  className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-gray-600 
                              mr-2 2k:mr-4 4k:mr-6"
                ></div>
                <div
                  className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-custom-blue 
                              mr-2 2k:mr-4 4k:mr-6"
                ></div>
                <div className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-gray-600"></div>
              </div>
            </div> */}
          </div>

          {/* Desktop view */}
          <div className="hidden md:flex md:flex-row items-center justify-between md:space-x-8 2xl:space-x-16">
            {/* Image */}
            <div className="md:w-1/2 relative mb-8 md:mb-0">
              <img
                src={foundationImage}
                alt="Foundation Shades Try-On"
                className="w-full rounded-lg"
              />
            </div>
            {/* Text Content */}
            <div className="md:w-1/2 pl-8 2xl:pl-16">
              <h2 className="text-5xl xl:text-6xl 2xl:text-7xl font-bold text-black mb-4">
                <span style={{ color: "#8590ff" }}>Soul Serum</span> Try-On
              </h2>
              <p className="text-2xl xl:text-3xl 2xl:text-4xl text-gray-600 mb-6">
                <em>Try before you Buy!</em>
              </p>
              <ul className="text-gray-600 mb-6 text-lg xl:text-xl 2xl:text-2xl list-none">
                <li className="mb-2">
                  Match serum to your skin type instantly.
                </li>
                <li>Say goodbye to returns and wrong purchases.</li>
              </ul>
              <div className="relative inline-block">
                <Link
                  to="/serum-try-on"
                  className="w-40 2xl:w-56 2k:w-80 4k:w-96 h-10 2xl:h-14 2k:h-24 4k:h-32 
                           bg-custom-blue hover:bg-opacity-90 transition-all duration-300 
                           flex items-center justify-center cursor-pointer 
                           rounded-lg 2xl:rounded-xl 2k:rounded-2xl 4k:rounded-3xl"
                >
                  <span className="text-white font-bold text-sm 2xl:text-lg 2k:text-3xl 4k:text-4xl uppercase tracking-wider">
                    Try Now!
                  </span>
                </Link>
                {/* Button effects - scaled up for larger screens */}
                <div className="absolute top-0 left-0 right-0 h-[1px] 2k:h-[2px] 4k:h-[3px] bg-white opacity-70"></div>
                <div className="absolute top-0 left-0 bottom-0 w-[1px] 2k:w-[2px] 4k:w-[3px] bg-white opacity-70"></div>
                <div className="absolute -bottom-1 2k:-bottom-2 4k:-bottom-3 left-0 right-0 h-[2px] 2k:h-[3px] 4k:h-[4px] bg-white opacity-20"></div>
                <div className="absolute -bottom-2 2k:-bottom-4 4k:-bottom-6 left-1 right-1 h-[2px] 2k:h-[3px] 4k:h-[4px] bg-white opacity-10"></div>
              </div>
              {/* Section Indicator */}
              {/* <div className="flex items-center mt-6 2k:mt-12 4k:mt-16">
                <span className="text-5xl 2xl:text-6xl 2k:text-8xl 4k:text-9xl font-bold text-custom-blue mr-2 2k:mr-4 4k:mr-6">
                  03
                </span>
                <span className="text-xl 2xl:text-2xl 2k:text-4xl 4k:text-5xl text-gray-400">
                  /04
                </span>

                <div className="flex ml-4 2k:ml-8 4k:ml-12">
                  <div
                    className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-gray-600 
                                mr-2 2k:mr-4 4k:mr-6"
                  ></div>
                  <div
                    className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-gray-600 
                                mr-2 2k:mr-4 4k:mr-6"
                  ></div>
                  <div
                    className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-custom-blue 
                                mr-2 2k:mr-4 4k:mr-6"
                  ></div>
                  <div className="w-2 h-2 2k:w-4 2k:h-4 4k:w-6 4k:h-6 rounded-full bg-gray-600"></div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
