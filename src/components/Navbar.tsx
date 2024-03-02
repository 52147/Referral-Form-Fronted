"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const styles = {
    navFont: {
      fontWeight: "bold", // Makes the font bold
      background:
        "linear-gradient(to right bottom, #d73609, #fc9553, #d05e9e, #a80f6a)", // Applies a gradient
      WebkitBackgroundClip: "text", // Clips the background to the text
      color: "transparent", // Makes the text color transparent to show the background
      display: "inline-block", // Changes display to inline-block to properly apply the gradient
      WebkitTextFillColor: "transparent", // Ensures text fill color is transparent (for webkit browsers)
      MozBackgroundClip: "text", // For Firefox
      backgroundClip: "text", // Standard property
    },
  };
  return (
    <nav className="bg-white shadow-md mt-4 mb-8 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <Link href="https://www.upwomxn.org/" passHref>
            <div className="flex items-center">
              <img
                src="/origin_logo_small.png"
                alt="Logo"
                className="h-16 w-16 mr-2"
              />
              <span className="font-bold" style={styles.navFont}>
                United Proud Women
              </span>
            </div>
          </Link>

          {/* Conditionally render the Hamburger Menu based on isMenuOpen */}
          {!isMenuOpen && (
            <div className="menu-icon" onClick={() => setIsMenuOpen(true)}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          )}

          {/* Menu items */}
          <div
            className={`flex items-center space-x-1 ${
              isMenuOpen ? "" : "hidden"
            } sm:flex`}
          >
            <Link
              href="https://www.upwomxn.org/"
              className={`${isMenuOpen === false ? "block" : "hidden"} pr-4`}
            >
              Home
            </Link>
            <Link
              href="https://www.upwomxn.org/about/"
              className={`${isMenuOpen === false ? "block" : "hidden"} pr-4`}
            >
              About
            </Link>
            <Link
              href="https://www.upwomxn.org/people/"
              className={`${isMenuOpen === false ? "block" : "hidden"} pr-4`}
            >
              People
            </Link>
            <Link
              href="https://www.upwomxn.org/united-proud-women-library/"
              className={`${isMenuOpen === false ? "block" : "hidden"} pr-4`}
            >
              Library / Readings
            </Link>
            <Link
              href="https://www.upwomxn.org/theater-review/"
              className={`${isMenuOpen === false ? "block" : "hidden"} pr-4`}
            >
              Theatre Review
            </Link>
            <Link
              href="https://www.upwomxn.org/connect/"
              className={`${isMenuOpen === false ? "block" : "hidden"} pr-4`}
            >
              Connect
            </Link>
            <Link
              href="https://referral-form-fronted.vercel.app/referral"
              className={`${isMenuOpen === false ? "Referral" : "hidden"} pr-4`}
            >
              Referral
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive Menu Overlay */}
      {isMenuOpen && (
        <div className="menu-overlay">
          <button onClick={() => setIsMenuOpen(false)} className="close-button">
            X
          </button>
          <ul>
            {/* Your menu items here */}
            <li>
              <Link href="https://www.upwomxn.org/">Home</Link>
            </li>
            <li>
              <Link href="https://www.upwomxn.org/about/">About</Link>
            </li>
            <li>
              <Link href="https://www.upwomxn.org/people/">People</Link>
            </li>
            <li>
              <Link href="https://www.upwomxn.org/united-proud-women-library/">
                Library / Readings
              </Link>
            </li>
            <li>
              <Link href="https://www.upwomxn.org/theater-review/">
                Theatre Review
              </Link>
            </li>
            <li>
              <Link href="https://www.upwomxn.org/connect/">Connect</Link>
            </li>
            <li>
              <Link href="https://referral-form-fronted.vercel.app/referral">
                Referral
              </Link>
            </li>
            {/* ...other menu items */}
          </ul>
        </div>
      )}
      <style jsx>{`
        .menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 250px; /* or any other width you prefer */
          height: 100%;
          background-color: white; /* make background white */
          z-index: 1000; /* High z-index to be on top of other content */
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-top: 20px; /* or any other spacing you want */
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* Optional: add shadow to the right side */
        }

        .close-button {
          align-self: flex-end; /* align close button to the right */
          margin: 1em;
          background: none;
          border: none;
          font-size: 1.5em;
          /* additional styles for the close button */
        }

        .menu-overlay ul {
          list-style: none;
          width: 100%; /* Full width of the menu overlay */
          padding: 0;
          /* additional styles for the menu */
        }

        .menu-overlay li {
          padding: 10px 20px;
          /* additional styles for menu items */
        }
        .menu-icon {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 30px; // Width of the hamburger icon
          height: 25px; // Height of the hamburger icon
        }

        .bar {
          height: 3px;
          width: 100%;
          background-color: #333; // Color of the hamburger icon bars
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          /* Hide hamburger menu on larger screens */
          .menu-icon {
            display: none;
          }

          /* Show menu items as inline elements on larger screens */
          .menu-overlay,
          .menu-overlay ul {
            position: static;
            width: auto;
            height: auto;
            background-color: transparent;
            box-shadow: none;
            display: block;
          }

          .menu-overlay ul {
            display: flex;
            justify-content: center;
          }

          .menu-overlay li {
            padding: 0 10px; /* Adjust padding as needed */
          }
        }
      `}</style>
    </nav>
  );
}
