import BringYourIdeaToLife from "./BringYourIdeaToLife";
import { byitlFontVars } from "./fonts";

const title = "Bring Your Idea to Life — Web Design, Print & AI Automation";
const description =
  "Web design, print collateral, trade show graphics, social media and AI automation for small businesses, racing programs and organizations across Ontario. One person, start to finish.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/bring-your-idea-to-life",
  },
  openGraph: {
    type: "website",
    url: "https://joshbyberg.com/bring-your-idea-to-life",
    title,
    description,
    locale: "en_CA",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Josh Byberg — Web Developer & Graphic Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/og-image.png"],
  },
};

export default function BringYourIdeaToLifePage() {
  return (
    <BringYourIdeaToLife fontVars={byitlFontVars} />
  );
}
