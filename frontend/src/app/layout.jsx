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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
