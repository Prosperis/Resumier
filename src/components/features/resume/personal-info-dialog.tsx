import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  BasicInfoSection,
  CertificationsSection,
  EducationSection,
  ExperienceSection,
  LinksSection,
  SkillsSection,
} from "@/components/features/resume/sections";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import type {
  Certification,
  Education,
  Experience,
  Link,
  Skill,
  UserInfo,
} from "@/stores";
import {
  createCertification,
  createEducation,
  createExperience,
  createLink,
  createSkill,
  useResumeStore,
} from "@/stores";
import {
  type PersonalInfoSection,
  selectPersonalInfoSection,
  selectSetPersonalInfoSection,
  useUIStore,
} from "@/stores/ui-store";

export function PersonalInfoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { userInfo, setUserInfo } = useResumeStore();
  const section = useUIStore(selectPersonalInfoSection);
  const setSection = useUIStore(selectSetPersonalInfoSection);

  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [name, setName] = useState(userInfo.name ?? "");
  const [email, setEmail] = useState(userInfo.email ?? "");
  const [phone, setPhone] = useState(userInfo.phone ?? "");
  const [address, setAddress] = useState(userInfo.address ?? "");
  const [experiences, setExperiences] = useState<Experience[]>(userInfo.experiences ?? []);
  const [education, setEducation] = useState<Education[]>(userInfo.education ?? []);
  const [skills, setSkills] = useState<Skill[]>(userInfo.skills ?? []);
  const [certifications, setCertifications] = useState<Certification[]>(
    userInfo.certifications ?? [],
  );
  const [highlightInputs, setHighlightInputs] = useState<Record<number, string>>({});
  const [links, setLinks] = useState<Link[]>(userInfo.links ?? []);
  const [customUrl, setCustomUrl] = useState(userInfo.customUrl ?? "");

  const importMutation = useMutation({
    mutationFn: async (url: string) => {
      const res = await fetch(`/api/linkedin?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return (await res.json()) as Partial<UserInfo>;
    },
    onSuccess: (data) => {
      setName(data.name ?? "");
      setEmail(data.email ?? "");
      setPhone(data.phone ?? "");
      setAddress(data.address ?? "");
      setExperiences(data.experiences ?? []);
      setEducation(data.education ?? []);
      setSkills(data.skills ?? []);
      setCertifications(data.certifications ?? []);
    },
  });

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

  function handleImport() {
    if (!linkedInUrl) return;
    importMutation.mutate(linkedInUrl);
  }

  function addExperience() {
    setExperiences([...experiences, createExperience()]);
    setHighlightInputs((prev) => ({ ...prev, [experiences.length]: "" }));
  }

  function updateExperience(
    index: number,
    field: keyof Experience,
    value: string | string[] | boolean,
  ) {
    setExperiences((prev) => {
      const next = [...prev];
      if (field === "current" && value === true) {
        next[index] = { ...next[index], current: true, endDate: "" };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  }

  function removeExperience(index: number) {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    setHighlightInputs((prev) => {
      const next: Record<number, string> = {};
      Object.keys(prev).forEach((key) => {
        const i = Number(key);
        if (i < index) next[i] = prev[i];
        else if (i > index) next[i - 1] = prev[i];
      });
      return next;
    });
  }

  function setHighlightInput(index: number, value: string) {
    setHighlightInputs((prev) => ({ ...prev, [index]: value }));
  }

  function addExperienceHighlight(index: number) {
    const highlight = highlightInputs[index]?.trim();
    if (!highlight) return;
    setExperiences((prev) => {
      const next = [...prev];
      const highlights = next[index].highlights ?? [];
      next[index] = { ...next[index], highlights: [...highlights, highlight] };
      return next;
    });
    setHighlightInputs((prev) => ({ ...prev, [index]: "" }));
  }

  function removeExperienceHighlight(index: number, highlightIndex: number) {
    setExperiences((prev) => {
      const next = [...prev];
      const highlights = next[index].highlights ?? [];
      next[index] = {
        ...next[index],
        highlights: highlights.filter((_, i) => i !== highlightIndex),
      };
      return next;
    });
  }

  function addEducation() {
    setEducation([...education, createEducation()]);
  }

  function updateEducation(index: number, field: keyof Education, value: string | boolean) {
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
    setSkills((prev) => [...prev, createSkill()]);
  }

  function updateSkill(index: number, field: keyof Skill, value: string | number) {
    setSkills((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function addCertification() {
    setCertifications([...certifications, createCertification()]);
  }

  function updateCertification(index: number, field: keyof Certification, value: string) {
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
    setLinks([...links, createLink()]);
  }

  function updateLink(index: number, field: keyof Link, value: string) {
    setLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function removeLink(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden md:max-h-[750px] md:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>Personal Information</DialogTitle>
        </DialogHeader>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarHeader>
                <DialogTitle className="text-base">Personal Information</DialogTitle>
              </SidebarHeader>
              <SidebarSeparator />
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
                          onClick={() => setSection(item.value as PersonalInfoSection)}
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
            {section === "basic" && (
              <BasicInfoSection
                name={name}
                email={email}
                phone={phone}
                address={address}
                linkedInUrl={linkedInUrl}
                onNameChange={setName}
                onEmailChange={setEmail}
                onPhoneChange={setPhone}
                onAddressChange={setAddress}
                onLinkedInUrlChange={setLinkedInUrl}
                onImport={handleImport}
                importing={importMutation.isPending}
                onSave={handleSave}
              />
            )}
            {section === "experience" && (
              <ExperienceSection
                experiences={experiences}
                highlightInputs={highlightInputs}
                addExperience={addExperience}
                updateExperience={updateExperience}
                removeExperience={removeExperience}
                setHighlightInput={setHighlightInput}
                addExperienceHighlight={addExperienceHighlight}
                removeExperienceHighlight={removeExperienceHighlight}
              />
            )}
            {section === "education" && (
              <EducationSection
                education={education}
                addEducation={addEducation}
                updateEducation={updateEducation}
                removeEducation={removeEducation}
              />
            )}
            {section === "skills" && (
              <SkillsSection
                skills={skills}
                addSkill={addSkill}
                updateSkill={updateSkill}
                removeSkill={removeSkill}
              />
            )}
            {section === "certifications" && (
              <CertificationsSection
                certifications={certifications}
                addCertification={addCertification}
                updateCertification={updateCertification}
                removeCertification={removeCertification}
              />
            )}
            {section === "links" && (
              <LinksSection
                customUrl={customUrl}
                links={links}
                setCustomUrl={setCustomUrl}
                addLink={addLink}
                updateLink={updateLink}
                removeLink={removeLink}
              />
            )}
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
