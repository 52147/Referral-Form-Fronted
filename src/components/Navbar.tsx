import Link from "next/link";

export default function Navbar() {
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
          <Link href="/" passHref>
            <div className="flex items-center">
              {" "}
              {/* Flex container for horizontal alignment */}
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

          {/* Menu items */}
          <div className="flex items-center space-x-1">
            <Link href="https://www.upwomxn.org/" className="pr-4">Home</Link>
            <Link href="https://www.upwomxn.org/" className="pr-4">About</Link>
            <Link href="https://www.upwomxn.org/people/" className="pr-4">People</Link>
            <Link href="https://www.upwomxn.org/united-proud-women-library/"className="pr-4">Library / Readings</Link>
            <Link href="https://www.upwomxn.org/theater-review/"className="pr-4">Theatre Review</Link>
            <Link href="https://www.upwomxn.org/connect/"className="pr-4">Connect</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
