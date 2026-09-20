import "./globals.css";
import { Caveat, Poppins } from "next/font/google";
import BottomFade from "../components/bottom-fade";
import BottomTabs from "../components/bottom-tabs";
import Analytics from "../components/analytics";
import CommandMenu from "../components/command-menu";
import Dock from "../components/dock";
import ThemeProvider from "../components/theme-provider";
import { THEME_BOOT_SCRIPT } from "../lib/theme";

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
    // The boot script themes <html> before hydration, which React would
    // otherwise report as a mismatch.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${caveat.variable} ${poppins.variable} scroll-smooth`}
    >
      <body className="relative font-poppins text-ink min-h-screen">
        {/* First thing in the body, so a stored light theme is applied before
            anything below it is painted. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <ThemeProvider>
          {children}
          <BottomFade />
          <BottomTabs />
          <Dock />
          <Analytics />
          <CommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
