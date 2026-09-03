import { Suspense } from "react";
import SignInContainer from "../../components/SignInContainer/SignInContainer.jsx";

export const metadata = {
  title: "Sign In | Mont Blanc",
  description: "Sign in to your Mont Blanc customer account.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>}>
      <SignInContainer />
    </Suspense>
  );
}
