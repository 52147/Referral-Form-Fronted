import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "@fortawesome/fontawesome-svg-core/styles.css";

// pages/_app.{js,jsx,ts,tsx}
import "./globals.css";

export default function Page({ children }: any) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
