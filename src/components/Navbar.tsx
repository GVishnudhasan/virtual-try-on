import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/omnia.svg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100 font-sans">
      <div className="max-w-screen-4xl mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 2xl:px-22 qhd:px-40 2k:px-56 4k:px-64">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-20 xl:h-20 2xl:h-24 qhd:h-28 2k:h-32 4k:h-36">
          {/* Logo and menu items on the left */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 mr-4 sm:mr-6 md:mr-8 lg:mr-10 xl:mr-12 2xl:mr-14 qhd:mr-16 2k:mr-18 4k:mr-20">
              <img 
                className="h-10 w-auto sm:h-12 md:h-12 lg:h-12 xl:h-14 2xl:h-16 qhd:h-20 2k:h-24 4k:h-28" 
                src={logo} 
                alt="Logo" 
              />
            </Link>
            {/* Menu for desktop screens */}
            <div className="hidden lg:block lg:ml-6">
              <div className="flex items-center">
                {/* Special handling for 1280px resolution */}
                <div className="hidden lg:flex 2xl:hidden">
                  {[
                    ['Who We Are', '/'],
                    ['Lipsticks', '/lipsticks'],
                    ['Jewellery', '/jewellery'],
                    ['Foundation Shades', '/foundation-shades'],
                    ['Blush', '/blush']
                  ].map(([title, path]) => (
                    <Link
                      key={path}
                      to={path}
                      className="text-gray-800 hover:text-gray-600 px-2 py-1 text-base font-bold tracking-normal mr-3 whitespace-nowrap"
                    >
                      {title}
                    </Link>
                  ))}
                </div>
                {/* Normal spacing for larger screens */}
                <div className="hidden 2xl:flex 2xl:space-x-16">
                  {[
                    ['Who We Are', '/'],
                    ['Lipsticks', '/lipsticks'],
                    ['Jewellery', '/jewellery'],
                    ['Foundation Shades', '/foundation-shades'],
                    ['Blush', '/blush']
                  ].map(([title, path]) => (
                    <Link
                      key={path}
                      to={path}
                      className="text-gray-800 hover:text-gray-600 px-3 py-1 xl:text-lg 2xl:text-xl 2k:text-4xl 4k:text-5xl font-bold tracking-normal whitespace-nowrap"
                    >
                      {title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* "TRY NOW!" button on the right */}
          <div className="hidden lg:block">
            <Link
              to="/lipsticks"
              className="bg-custom-blue hover:bg-[#6B7AFF] text-white 
                lg:px-6 lg:py-2 
                xl:px-10 xl:py-3 
                2xl:px-12 2xl:py-4 
                qhd:px-14 qhd:py-5 
                2k:px-16 2k:py-6 
                4k:px-20 4k:py-8 
                rounded-lg 
                lg:text-base xl:text-lg 2xl:text-xl qhd:text-2xl 2k:text-3xl 4k:text-4xl 
                font-bold tracking-wider whitespace-nowrap"
            >
              TRY NOW!
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with animation */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`} 
        id="mobile-menu"
      >
        <div className="px-8 pt-2 pb-3 space-y-1 sm:px-8">
          {[
            ['Who We Are', '/'],
            ['Lipsticks', '/lipsticks'],
            ['Jewellery', '/jewellery'],
            ['Foundation Shades', '/foundation-shades'],
            ['Blush', '/blush'],
            ['TRY NOW!', '/try-now']
          ].map(([title, path], index) => (
            <Link
              key={path}
              to={path}
              className={`${
                index === 5 ? 'bg-custom-blue hover:bg-[#6B7AFF] text-white' : 'text-gray-800 hover:text-gray-600'
              } block px-3 py-2 text-base font-medium ${index === 5 ? 'rounded-md' : ''}`}
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;