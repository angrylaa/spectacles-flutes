import type { Route } from "./+types/home";
import { Welcome } from "../pages/welcome/welcome";

import { useState } from "react";
import { LandingPage } from "../pages/LandingPage"; // Adjust path as needed


export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  console.log("showLandingPage:", showLandingPage); // should toggle when button is clicked

  return showLandingPage ? (
    <LandingPage onStart={() => setShowLandingPage(false)} />
  ) : (
    <Welcome />
  );
}

// import Sidebar from "../components/ui/Sidebar";

// export default function sidebar() {
//   return <Sidebar />;
// }

