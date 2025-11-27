import React from "react";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 rounded-xl p-6 shadow-xl">
           
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
