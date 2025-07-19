import { useState } from "react";
import { Button } from "./ui/button"; // adjust path if needed

const tabs = ["Home", "Analytics", "Settings", "Logout"];

export default function SidebarPage() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4">
        <h2 className="text-lg font-semibold">Sidebar</h2>
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-4">{activeTab}</h1>
        <div className="rounded-lg border bg-white p-6 shadow">
          This is the <strong>{activeTab}</strong> tab content.
        </div>
      </main>
    </div>
  );
}


