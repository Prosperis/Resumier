import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [currentView, setCurrentView] = useState("builder");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <img src="/assets/logo_dark.png" alt="Logo" className="h-8" />
        <nav className="flex gap-2">
          <Button variant="outline" onClick={() => setCurrentView("data")}>Add Personal Info</Button>
          <Button variant="outline" onClick={() => setCurrentView("jobs")}>Add Job Info</Button>
        </nav>
      </header>

      <main className="flex-1 p-6">
        {currentView === "data" && <MyDataSection />}
        {currentView === "jobs" && <JobUploadSection />}
        {currentView === "builder" && <ResumeBuilderViewer />}
      </main>
    </div>
  );
}

function MyDataSection() {
  return <div>📁 Personal data form goes here.</div>;
}

function JobUploadSection() {
  return <div>📄 Upload/paste job info and view history here.</div>;
}

function ResumeBuilderViewer() {
  return <div className="text-gray-500 italic">🧾 Your resume will appear here once you add some data.</div>;
}
