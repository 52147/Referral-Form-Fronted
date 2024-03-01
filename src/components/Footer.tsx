"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faInstagram,
  faLinkedin,
  faWhatsapp,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-white p-6 text-center mt-12">
      <div className="max-w-screen-lg mx-auto">
        <img
          src="/origin_logo_small-300x300.png"
          alt="Company Logo"
          className="mx-auto mb-4 h-28 w-28"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          STAY CONNECTED
        </h2>
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          {/* Add the correct links to your social media pages */}
          <a
            href="https://www.youtube.com/channel/UCH7FpqzB2FREHifKRYWKU4Q"
            className="social-icon youtube"
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a
            href="https://www.instagram.com/upwomxn/"
            className="text-pink-600 social-icon youtube"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="mailto:support@upwomxn.org"
            className="text-gray-600 social-icon youtube"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a
            href="https://chat.whatsapp.com/HoJRcHtaF65GT74lALG7wu"
            className="text-green-600 social-icon youtube"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a
            href="https://www.linkedin.com/company/upwomxn/about/"
            className="text-blue-600 social-icon youtube"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="https://discord.com/invite/nxUTpuX79h"
            className="text-blue-600 social-icon youtube"
          >
            <FontAwesomeIcon icon={faDiscord} />
          </a>
        </div>
      </div>
      <style jsx>{`
        .social-icon {
          color: #e495c1;
        }

        .social-icon.youtube:hover {
          color:#a80f6a /* YouTube Red */
        }

        @media (max-width: 640px) {
          footer {
            padding: 3rem 1rem; /* Adjust padding on smaller screens */
          }

          footer .max-w-screen-lg {
            flex-direction: column; /* Stack elements vertically */
          }

          footer h2 {
            margin-bottom: 2rem;
          }

          footer .social-icon {
            margin: 0.5rem; /* Space out icons a bit more on small screens */
          }
        }
      `}</style>
    </footer>
  );
}
