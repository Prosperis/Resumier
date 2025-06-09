import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import type {
  Education,
  WorkExperience,
  Certification,
  Skill,
  Link,
} from "@/hooks/use-resume-store"
import { useResumeStore } from "@/hooks/use-resume-store"
import { Plus, Trash } from "lucide-react"

type Section =
  | "basic"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "links";

export function PersonalInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { userInfo, setUserInfo } = useResumeStore();

  const [section, setSection] = useState<Section>("basic");

  const [name, setName] = useState(userInfo.name ?? "");
  const [email, setEmail] = useState(userInfo.email ?? "");
  const [phone, setPhone] = useState(userInfo.phone ?? "");
  const [address, setAddress] = useState(userInfo.address ?? "");
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    userInfo.experiences ?? [],
  );
  const [education, setEducation] = useState<Education[]>(
    userInfo.education ?? [],
  );
  const [skills, setSkills] = useState<Skill[]>(userInfo.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState<Certification[]>(
    userInfo.certifications ?? [],
  );
  const [awardInputs, setAwardInputs] = useState<Record<number, string>>({});
  const [links, setLinks] = useState<Link[]>(userInfo.links ?? [])
  const [customUrl, setCustomUrl] = useState(userInfo.customUrl ?? "")

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setUserInfo({
      name,
      email,
      phone,
      address,
      customUrl,
      links,
      experiences,
      education,
      skills,
      certifications,
    });
    onOpenChange(false);
  }

  function addExperience() {
    setExperiences([...experiences, {}]);
    setAwardInputs((prev) => ({ ...prev, [experiences.length]: "" }));
  }

  function updateExperience(
    index: number,
    field: keyof WorkExperience,
    value: string | string[],
  ) {
    setExperiences((prev) => {
      const next = [...prev]
      if (field === "current" && value === true) {
        next[index] = { ...next[index], current: true, endDate: undefined }
      } else {
        next[index] = { ...next[index], [field]: value }
      }
      return next
    })
  }

  function removeExperience(index: number) {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    setAwardInputs((prev) => {
      const next: Record<number, string> = {};
      Object.keys(prev).forEach((key) => {
        const i = Number(key);
        if (i < index) next[i] = prev[i];
        else if (i > index) next[i - 1] = prev[i];
      });
      return next;
    });
  }

  function setAwardInput(index: number, value: string) {
    setAwardInputs((prev) => ({ ...prev, [index]: value }));
  }

  function addExperienceAward(index: number) {
    const award = awardInputs[index]?.trim();
    if (!award) return;
    setExperiences((prev) => {
      const next = [...prev];
      const awards = next[index].awards ?? [];
      next[index] = { ...next[index], awards: [...awards, award] };
      return next;
    });
    setAwardInputs((prev) => ({ ...prev, [index]: "" }));
  }

  function removeExperienceAward(index: number, awardIndex: number) {
    setExperiences((prev) => {
      const next = [...prev];
      const awards = next[index].awards ?? [];
      next[index] = {
        ...next[index],
        awards: awards.filter((_, i) => i !== awardIndex),
      };
      return next;
    });
  }

  function addEducation() {
    setEducation([...education, {}]);
  }

  function updateEducation(
    index: number,
    field: keyof Education,
    value: string,
  ) {
    setEducation((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeEducation(index: number) {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }

  function addSkill() {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  }

  function updateSkill(index: number, field: keyof Skill, value: string) {
    setSkills((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function addCertification() {
    setCertifications([...certifications, {}]);
  }

  function updateCertification(
    index: number,
    field: keyof Certification,
    value: string,
  ) {
    setCertifications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeCertification(index: number) {
    setCertifications((prev) => prev.filter((_, i) => i !== index));
  }

  function addLink() {
    setLinks([...links, {}])
  }

  function updateLink(index: number, field: keyof Link, value: string) {
    setLinks((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index))
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
                      { value: "links", label: "Links" },
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
                  <div key={i} className="border p-4 rounded-md grid gap-2">
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
                    <div className="grid grid-cols-3 gap-2">
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
                          disabled={exp.current}
                          placeholder={exp.current ? "Present" : undefined}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          id={`current-${i}`}
                          type="checkbox"
                          checked={exp.current ?? false}
                          onChange={(e) =>
                            updateExperience(i, "current", e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`current-${i}`}>Current</Label>
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
                    <div className="grid gap-2">
                      <Label>Awards</Label>
                      <div className="flex gap-2">
                        <Input
                          value={awardInputs[i] ?? ""}
                          onChange={(e) => setAwardInput(i, e.target.value)}
                          placeholder="Add award"
                        />
                        <Button
                          type="button"
                          onClick={() => addExperienceAward(i)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                      </div>
                      <ul className="grid gap-2">
                        {(exp.awards ?? []).map((award, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <span className="flex-1">{award}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeExperienceAward(i, j)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
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
                  <div key={i} className="border p-4 rounded-md grid gap-2">
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
                {skills.map((skill, i) => (
                  <div key={i} className="border p-4 rounded-md grid gap-2">
                    <div className="grid gap-2">
                      <Label>Skill</Label>
                      <Input
                        value={skill.name ?? ""}
                        onChange={(e) => updateSkill(i, "name", e.target.value)}
                        placeholder="Skill name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Years of Experience</Label>
                      <Input
                        type="number"
                        min="0"
                        value={skill.years ?? ""}
                        onChange={(e) => updateSkill(i, "years", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Proficiency</Label>
                      <select
                        className="border rounded-md p-2"
                        value={skill.proficiency ?? ""}
                        onChange={(e) =>
                          updateSkill(i, "proficiency", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="professional">Professional</option>
                        <option value="expert">Expert</option>
                        {[...Array(10)].map((_, idx) => {
                          const val = (idx + 1).toString()
                          return (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(i)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="mr-2 h-4 w-4" /> Add Skill
                </Button>
              </div>
            )}
            {section === "certifications" && (
              <div className="grid gap-4">
                {certifications.map((cert, i) => (
                  <div key={i} className="border p-4 rounded-md grid gap-2">
                    <div className="grid gap-2">
                      <Label>Certification</Label>
                      <Input
                        value={cert.name ?? ""}
                        onChange={(e) =>
                          updateCertification(i, "name", e.target.value)
                        }
                        placeholder="Certification name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Expiration</Label>
                      <Input
                        type="date"
                        value={cert.expiration ?? ""}
                        onChange={(e) =>
                          updateCertification(i, "expiration", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCertification(i)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertification}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Certification
                </Button>
              </div>
            )}
            {section === "links" && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="custom-url">Custom URL</Label>
                  <Input
                    id="custom-url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="yourname"
                  />
                </div>
                {links.map((link, i) => (
                  <div key={i} className="border p-4 rounded-md grid gap-2">
                    <div className="grid gap-2">
                      <Label>Label</Label>
                      <Input
                        value={link.label ?? ""}
                        onChange={(e) => updateLink(i, "label", e.target.value)}
                        placeholder="LinkedIn"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>URL</Label>
                      <Input
                        value={link.url ?? ""}
                        onChange={(e) => updateLink(i, "url", e.target.value)}
                        placeholder="https://linkedin.com/in/you"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLink(i)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addLink}>
                  <Plus className="mr-2 h-4 w-4" /> Add Link
                </Button>
              </div>
            )}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
