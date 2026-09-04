import "../styles/styles.scss";
import "flag-icons/css/flag-icons.min.css";
import Providers from "./providers.jsx";
import Layout from "../components/Layout/Layout.jsx";

export const metadata = {
  title: "Mont Blanc - Italian Quality Products",
  description: "E-shop of authentic Italian quality gourmet food, cheeses, pasta, and delicacies.",
  openGraph: {
    title: "Mont Blanc - Italian Quality Products",
    description: "E-shop of authentic Italian quality gourmet food, cheeses, pasta, and delicacies.",
    url: "https://pizza-na-dom.mk.ua",
    siteName: "Mont Blanc",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
