import React, { useState } from "react";
import "./Sidebar.css";

const tabs = [
  { label: "Player 1", icon: "/icons/pfp.png" },
  { label: "Player 2", icon: "/icons/pfp.png" },
  { label: "Player 3", icon: "/icons/pfp.png" },
  { label: "Player 4", icon: "/icons/pfp.png" },
];
export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="sidebar-container">
      <aside className="sidebar">
        <h2>Messages</h2>
        <nav>
          {tabs.map((tab) => (
            <button
                key={tab.label}
                className={`sidebar-button ${activeTab === tab.label ? "active" : ""}`}
                onClick={() => setActiveTab(tab.label)}
            >
                <img src={tab.icon} alt={tab.label} className="tab-icon" />
                <span>{tab.label}</span>
            </button>
            ))}
        </nav>
      </aside>

      <main className="main-content">
        <h1>{activeTab}</h1>
        <p>This is the <strong>{activeTab}</strong> tab content.</p>
      </main>
    </div>
  );
}
