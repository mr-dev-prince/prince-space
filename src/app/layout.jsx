import "./globals.css";
import { Caveat, Poppins } from "next/font/google";
import BottomFade from "../components/bottom-fade";
import BottomTabs from "../components/bottom-tabs";
import Analytics from "../components/analytics";
import CommandMenu from "../components/command-menu";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Prince Chaurasia",
  description: "The Developer's Space",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${poppins.variable} scroll-smooth`}
    >
      <body className="relative font-poppins text-white min-h-screen">
        {children}
        <BottomFade />
        <BottomTabs />
        <Analytics />
        <CommandMenu />
      </body>
    </html>
  );
}
