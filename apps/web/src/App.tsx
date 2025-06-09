import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useResumeStore } from "@/hooks/use-resume-store"

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
  const { userInfo, setUserInfo } = useResumeStore()
  const [name, setName] = useState(userInfo.name ?? "")
  const [email, setEmail] = useState(userInfo.email ?? "")

  return (
    <div className="space-y-2 max-w-sm">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={() => setUserInfo({ name, email })}>Save</Button>
    </div>
  )
}

function JobUploadSection() {
  const { jobInfo, setJobInfo } = useResumeStore()
  const [description, setDescription] = useState(jobInfo.description ?? "")

  return (
    <div className="space-y-2 max-w-sm">
      <textarea
        className="w-full rounded border p-2 text-sm"
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={() => setJobInfo({ description })}>Save</Button>
    </div>
  )
}

function ResumeBuilderViewer() {
  const { userInfo, jobInfo } = useResumeStore()

  if (!Object.keys(userInfo).length && !Object.keys(jobInfo).length) {
    return (
      <div className="text-gray-500 italic">
        🧾 Your resume will appear here once you add some data.
      </div>
    )
  }

  return (
    <pre className="bg-muted p-4 rounded text-sm">
      {JSON.stringify({ userInfo, jobInfo }, null, 2)}
    </pre>
  )
}
