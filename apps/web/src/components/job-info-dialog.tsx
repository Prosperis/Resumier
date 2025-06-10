import { useState } from "react"
import { useResumeStore } from "@/hooks/use-resume-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Plus, Trash } from "lucide-react"

type Section = "details" | "list"

export function JobInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { jobInfo, setJobInfo, jobs, addJob, removeJob } = useResumeStore()
  const typedJobInfo = jobInfo as {
    title?: string
    company?: string
    location?: string
    description?: string
    benefits?: string[]
    workType?: "onsite" | "remote" | "hybrid"
    basePay?: string
    bonus?: string
    stocks?: string
  }
  const standardBenefits = [
    "Health Insurance",
    "Dental Insurance",
    "Vision Insurance",
    "401(k)",
    "Paid Time Off",
  ]
  const [section, setSection] = useState<Section>("details")
  const [title, setTitle] = useState(typedJobInfo.title ?? "")
  const [company, setCompany] = useState(typedJobInfo.company ?? "")
  const [location, setLocation] = useState(typedJobInfo.location ?? "")
  const [description, setDescription] = useState(typedJobInfo.description ?? "")
  const [benefits, setBenefits] = useState<string[]>(typedJobInfo.benefits ?? [])
  const [benefitInput, setBenefitInput] = useState("")
  const [workType, setWorkType] = useState(typedJobInfo.workType)
  const [basePay, setBasePay] = useState(typedJobInfo.basePay ?? "")
  const [bonus, setBonus] = useState(typedJobInfo.bonus ?? "")
  const [stocks, setStocks] = useState(typedJobInfo.stocks ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const job = { title, company, location, description, basePay, bonus, stocks, workType, benefits }
    setJobInfo(job)
    addJob(job)
    setTitle("")
    setCompany("")
    setLocation("")
    setDescription("")
    setBenefits([])
    setWorkType(undefined)
    setBasePay("")
    setBonus("")
    setStocks("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[750px] md:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Job Information</DialogTitle>
        </DialogHeader>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { value: "details", label: "New Job" },
                      { value: "list", label: "Jobs" },
                    ].map((item) => (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          isActive={section === item.value}
                          onClick={() => setSection(item.value as Section)}
                        >
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[650px] flex-1 flex-col overflow-y-auto p-4">
            {section === "details" && (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="job">Job Title</Label>
                  <Input
                    id="job"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Desired role"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="workType">Type of Work</Label>
                  <Select
                    id="workType"
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value as "onsite" | "remote" | "hybrid" | undefined)}
                  >
                    <option value="">Select</option>
                    <option value="onsite">Onsite</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Company location"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Job description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Benefits</Label>
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) =>
                          setBenefits((prev) => {
                            const next = [...prev]
                            next[i] = e.target.value
                            return next
                          })
                        }
                        placeholder="Benefit"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setBenefits((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      placeholder="Add benefit"
                    />
                    <Button type="button" variant="outline" onClick={() => {
                      if (!benefitInput.trim()) return
                      setBenefits([...benefits, benefitInput.trim()])
                      setBenefitInput("")
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Benefit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setBenefits(standardBenefits)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="basePay">Base Pay</Label>
                  <Input
                    id="basePay"
                    value={basePay}
                    onChange={(e) => setBasePay(e.target.value)}
                    placeholder="Annual salary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bonus">Bonus</Label>
                  <Input
                    id="bonus"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    placeholder="Bonus or incentives"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stocks">Stocks/Options</Label>
                  <Input
                    id="stocks"
                    value={stocks}
                    onChange={(e) => setStocks(e.target.value)}
                    placeholder="Stock options or RSUs"
                  />
                </div>
                <Button type="submit" className="mt-2 w-full">
                  Add Job
                </Button>
              </form>
            )}
            {section === "list" && (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Company</th>
                      <th className="text-left p-2">Work Type</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Base Pay</th>
                      <th className="p-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {jobs.map((job, i) => (
                      <tr key={i}>
                        <td className="p-2">{job.title}</td>
                        <td className="p-2">{job.company}</td>
                        <td className="p-2">{job.workType}</td>
                        <td className="p-2">{job.location}</td>
                        <td className="p-2">{job.basePay}</td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeJob(i)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
