import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"
import type { Education, WorkExperience } from "@/hooks/use-resume-store"
import { useResumeStore } from "@/hooks/use-resume-store"
import { Plus, Trash } from "lucide-react"

type Section =
  | "basic"
  | "experience"
  | "education"
  | "skills"
  | "certifications"

export function PersonalInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { userInfo, setUserInfo } = useResumeStore()

  const [section, setSection] = useState<Section>("basic")

  const [name, setName] = useState(userInfo.name ?? "")
  const [email, setEmail] = useState(userInfo.email ?? "")
  const [phone, setPhone] = useState(userInfo.phone ?? "")
  const [address, setAddress] = useState(userInfo.address ?? "")
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    userInfo.experiences ?? []
  )
  const [education, setEducation] = useState<Education[]>(
    userInfo.education ?? []
  )
  const [skills, setSkills] = useState<string[]>(userInfo.skills ?? [])
  const [skillInput, setSkillInput] = useState("")
  const [certifications, setCertifications] = useState<string[]>(
    userInfo.certifications ?? []
  )
  const [certInput, setCertInput] = useState("")

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setUserInfo({
      name,
      email,
      phone,
      address,
      experiences,
      education,
      skills,
      certifications,
    })
    onOpenChange(false)
  }

  function addExperience() {
    setExperiences([...experiences, {}])
  }

  function updateExperience(
    index: number,
    field: keyof WorkExperience,
    value: string
  ) {
    setExperiences((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function removeExperience(index: number) {
    setExperiences((prev) => prev.filter((_, i) => i !== index))
  }

  function addEducation() {
    setEducation([...education, {}])
  }

  function updateEducation(
    index: number,
    field: keyof Education,
    value: string
  ) {
    setEducation((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function removeEducation(index: number) {
    setEducation((prev) => prev.filter((_, i) => i !== index))
  }

  function addSkill() {
    if (!skillInput.trim()) return
    setSkills([...skills, skillInput.trim()])
    setSkillInput("")
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index))
  }

  function addCertification() {
    if (!certInput.trim()) return
    setCertifications([...certifications, certInput.trim()])
    setCertInput("")
  }

  function removeCertification(index: number) {
    setCertifications((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Personal Information</DialogTitle>
        </DialogHeader>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[
                      { value: "basic", label: "Basic Info" },
                      { value: "experience", label: "Experience" },
                      { value: "education", label: "Education" },
                      { value: "skills", label: "Skills" },
                      { value: "certifications", label: "Certifications" },
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
          <main className="flex h-[500px] flex-1 flex-col overflow-y-auto p-4">
            {section === "basic" && (
              <form className="grid gap-4" onSubmit={handleSave}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555-555-5555"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your address"
                  />
                </div>
                <Button type="submit" className="mt-2 w-full">
                  Save
                </Button>
              </form>
            )}
            {section === "experience" && (
              <div className="grid gap-4">
                {experiences.map((exp, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-md grid gap-2"
                  >
                    <div className="grid gap-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company ?? ""}
                        onChange={(e) =>
                          updateExperience(i, "company", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Title</Label>
                      <Input
                        value={exp.title ?? ""}
                        onChange={(e) =>
                          updateExperience(i, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.startDate ?? ""}
                          onChange={(e) =>
                            updateExperience(i, "startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate ?? ""}
                          onChange={(e) =>
                            updateExperience(i, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description ?? ""}
                        onChange={(e) =>
                          updateExperience(i, "description", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExperience(i)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addExperience}>
                  <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
              </div>
            )}
            {section === "education" && (
              <div className="grid gap-4">
                {education.map((ed, i) => (
                  <div
                    key={i}
                    className="border p-4 rounded-md grid gap-2"
                  >
                    <div className="grid gap-2">
                      <Label>School</Label>
                      <Input
                        value={ed.school ?? ""}
                        onChange={(e) =>
                          updateEducation(i, "school", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Degree</Label>
                      <Input
                        value={ed.degree ?? ""}
                        onChange={(e) =>
                          updateEducation(i, "degree", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={ed.startDate ?? ""}
                          onChange={(e) =>
                            updateEducation(i, "startDate", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={ed.endDate ?? ""}
                          onChange={(e) =>
                            updateEducation(i, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Textarea
                        value={ed.description ?? ""}
                        onChange={(e) =>
                          updateEducation(i, "description", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEducation(i)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addEducation}>
                  <Plus className="mr-2 h-4 w-4" /> Add Education
                </Button>
              </div>
            )}
            {section === "skills" && (
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add skill"
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
                <ul className="grid gap-2">
                  {skills.map((skill, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="flex-1">{skill}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(i)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {section === "certifications" && (
              <div className="grid gap-4">
                <div className="flex gap-2">
                  <Input
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="Add certification"
                  />
                  <Button type="button" onClick={addCertification}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
                <ul className="grid gap-2">
                  {certifications.map((cert, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="flex-1">{cert}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertification(i)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
