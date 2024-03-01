import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
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
        <div className="flex justify-center gap-4 mb-4">
          {/* Add the correct links to your social media pages */}
          <a
            href="https://youtube.com"
            className="hover:text-red-800"
            style={{ color: "#e495c1" }}
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a
            href="https://instagram.com"
            className="text-pink-600"
            style={{ color: "#e495c1" }}
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="mailto:your-email@example.com"
            className="text-gray-600"
            style={{ color: "#e495c1" }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a
            href="https://api.whatsapp.com/send"
            className="text-green-600"
            style={{ color: "#e495c1" }}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
          <a
            href="https://linkedin.com"
            className="text-blue-600"
            style={{ color: "#e495c1" }}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="https://facebook.com"
            className="text-blue-600"
            style={{ color: "#e495c1" }}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
        </div>
      </div>
    </footer>
  );
}
