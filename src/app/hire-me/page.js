import BringYourIdeaToLife from "../bring-your-idea-to-life/BringYourIdeaToLife";
import { byitlFontVars } from "../bring-your-idea-to-life/fonts";

const title = "Hire Whitespace Design — Web, Print & Automation";
const description =
  "Web design, print collateral, trade show graphics, social media and AI automation for small businesses, racing programs and organizations across Ontario. One person, start to finish.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/hire-me",
  },
  openGraph: {
    type: "website",
    url: "https://whitespacedesign.ca/hire-me",
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

export default function HireMePage() {
  return <BringYourIdeaToLife brand="whitespace" fontVars={byitlFontVars} />;
}
