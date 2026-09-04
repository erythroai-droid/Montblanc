import { Suspense } from "react";
import SignUpContainer from "../../components/SignUpContainer/SignUpContainer.jsx";

export const metadata = {
  title: "Sign Up | Mont Blanc",
  description: "Create a new customer account at Mont Blanc.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>}>
      <SignUpContainer />
    </Suspense>
  );
}
