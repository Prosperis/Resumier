import { useParams } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useResume, useUpdateResume } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"
import type { Certification, Education, Experience, Link } from "@/lib/api/types"
import type {
  CertificationFormData,
  CreateCertificationFormData,
} from "@/lib/validations/certification"
import type { CreateEducationFormData, EducationFormData } from "@/lib/validations/education"
import type { CreateExperienceFormData, ExperienceFormData } from "@/lib/validations/experience"
import type { CreateLinkFormData, LinkFormData } from "@/lib/validations/links"
import { CertificationFormDialog } from "./forms/certification-form-dialog"
import { CertificationList } from "./forms/certification-list"
import { EducationFormDialog } from "./forms/education-form-dialog"
import { EducationList } from "./forms/education-list"
import { ExperienceFormDialog } from "./forms/experience-form-dialog"
import { ExperienceList } from "./forms/experience-list"
import { LinkFormDialog } from "./forms/link-form-dialog"
import { LinkList } from "./forms/link-list"
import { PersonalInfoForm } from "./forms/personal-info-form"
import { SkillsForm } from "./forms/skills-form"

export function ResumeBuilder() {
  const { id } = useParams({ strict: false })
  const resumeId = id || ""
  const { data: resume } = useResume(resumeId)
  const { mutate: updateResume } = useUpdateResume()
  const { toast } = useToast()

  // Dialog states
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<ExperienceFormData | null>(null)

  const [educationDialogOpen, setEducationDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<EducationFormData | null>(null)

  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<CertificationFormData | null>(
    null,
  )

  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkFormData | null>(null)

  if (!resume) {
    return null
  }

  const content = resume.content || {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: { technical: [], languages: [], tools: [], soft: [] },
    certifications: [],
    links: [],
  }

  // Experience handlers
  const handleAddExperience = () => {
    setEditingExperience(null)
    setExperienceDialogOpen(true)
  }

  const handleEditExperience = (experience: ExperienceFormData) => {
    setEditingExperience(experience)
    setExperienceDialogOpen(true)
  }

  const handleSaveExperience = (data: CreateExperienceFormData | ExperienceFormData) => {
    const experiences = content.experience || []
    let updatedExperiences: Experience[]

    if (editingExperience) {
      // Update existing
      updatedExperiences = experiences.map((exp) =>
        exp.id === editingExperience.id ? { ...exp, ...data } : exp,
      )
    } else {
      // Add new
      const newExperience: Experience = {
        id: crypto.randomUUID(),
        ...data,
      } as Experience
      updatedExperiences = [...experiences, newExperience]
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            experience: updatedExperiences,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingExperience
              ? "Experience updated successfully"
              : "Experience added successfully",
          })
          setExperienceDialogOpen(false)
          setEditingExperience(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save experience: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  const handleDeleteExperience = (id: string) => {
    const experiences = content.experience || []
    const updatedExperiences = experiences.filter((exp) => exp.id !== id)

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            experience: updatedExperiences,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Experience deleted successfully",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete experience: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  // Education handlers
  const handleAddEducation = () => {
    setEditingEducation(null)
    setEducationDialogOpen(true)
  }

  const handleEditEducation = (education: EducationFormData) => {
    setEditingEducation(education)
    setEducationDialogOpen(true)
  }

  const handleSaveEducation = (data: CreateEducationFormData | EducationFormData) => {
    const educations = content.education || []
    let updatedEducations: Education[]

    if (editingEducation) {
      // Update existing
      updatedEducations = educations.map((edu) =>
        edu.id === editingEducation.id ? { ...edu, ...data } : edu,
      )
    } else {
      // Add new
      const newEducation: Education = {
        id: crypto.randomUUID(),
        ...data,
      } as Education
      updatedEducations = [...educations, newEducation]
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            education: updatedEducations,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingEducation
              ? "Education updated successfully"
              : "Education added successfully",
          })
          setEducationDialogOpen(false)
          setEditingEducation(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save education: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  const handleDeleteEducation = (id: string) => {
    const educations = content.education || []
    const updatedEducations = educations.filter((edu) => edu.id !== id)

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            education: updatedEducations,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Education deleted successfully",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete education: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  // Certification handlers
  const handleAddCertification = () => {
    setEditingCertification(null)
    setCertificationDialogOpen(true)
  }

  const handleEditCertification = (certification: CertificationFormData) => {
    setEditingCertification(certification)
    setCertificationDialogOpen(true)
  }

  const handleSaveCertification = (data: CreateCertificationFormData | CertificationFormData) => {
    const certifications = content.certifications || []
    let updatedCertifications: Certification[]

    if (editingCertification) {
      // Update existing
      updatedCertifications = certifications.map((cert) =>
        cert.id === editingCertification.id ? { ...cert, ...data } : cert,
      )
    } else {
      // Add new
      const newCertification: Certification = {
        id: crypto.randomUUID(),
        ...data,
      } as Certification
      updatedCertifications = [...certifications, newCertification]
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            certifications: updatedCertifications,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingCertification
              ? "Certification updated successfully"
              : "Certification added successfully",
          })
          setCertificationDialogOpen(false)
          setEditingCertification(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save certification: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  const handleDeleteCertification = (id: string) => {
    const certifications = content.certifications || []
    const updatedCertifications = certifications.filter((cert) => cert.id !== id)

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            certifications: updatedCertifications,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Certification deleted successfully",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete certification: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  // Link handlers
  const handleAddLink = () => {
    setEditingLink(null)
    setLinkDialogOpen(true)
  }

  const handleEditLink = (link: LinkFormData) => {
    setEditingLink(link)
    setLinkDialogOpen(true)
  }

  const handleSaveLink = (data: CreateLinkFormData | LinkFormData) => {
    const links = content.links || []
    let updatedLinks: Link[]

    if (editingLink) {
      // Update existing
      updatedLinks = links.map((link) => (link.id === editingLink.id ? { ...link, ...data } : link))
    } else {
      // Add new
      const newLink: Link = {
        id: crypto.randomUUID(),
        ...data,
      } as Link
      updatedLinks = [...links, newLink]
    }

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            links: updatedLinks,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: editingLink ? "Link updated successfully" : "Link added successfully",
          })
          setLinkDialogOpen(false)
          setEditingLink(null)
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to save link: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  const handleDeleteLink = (id: string) => {
    const links = content.links || []
    const updatedLinks = links.filter((link) => link.id !== id)

    updateResume(
      {
        id: resumeId,
        data: {
          content: {
            links: updatedLinks,
          },
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Link deleted successfully",
          })
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to delete link: ${error.message}`,
            variant: "destructive",
          })
        },
      },
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Basic information about yourself. Changes are saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalInfoForm resumeId={resumeId} defaultValues={content.personalInfo} />
        </CardContent>
      </Card>

      <Separator />

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>
                Add your professional experience and accomplishments
              </CardDescription>
            </div>
            <Button onClick={handleAddExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ExperienceList
            experiences={content.experience || []}
            onEdit={handleEditExperience}
            onDelete={handleDeleteExperience}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Education Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Education</CardTitle>
              <CardDescription>Add your educational background and achievements</CardDescription>
            </div>
            <Button onClick={handleAddEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EducationList
            education={content.education || []}
            onEdit={handleEditEducation}
            onDelete={handleDeleteEducation}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            List your technical skills, languages, tools, and soft skills. Changes are saved
            automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SkillsForm resumeId={resumeId} skills={content.skills} />
        </CardContent>
      </Card>

      <Separator />

      {/* Certifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Add professional certifications and credentials</CardDescription>
            </div>
            <Button onClick={handleAddCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CertificationList
            certifications={content.certifications || []}
            onEdit={handleEditCertification}
            onDelete={handleDeleteCertification}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Links Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Links</CardTitle>
              <CardDescription>
                Add your portfolio, LinkedIn, GitHub, and other professional links
              </CardDescription>
            </div>
            <Button onClick={handleAddLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LinkList
            links={content.links || []}
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ExperienceFormDialog
        open={experienceDialogOpen}
        onOpenChange={setExperienceDialogOpen}
        onSubmit={handleSaveExperience}
        defaultValues={editingExperience || undefined}
      />

      <EducationFormDialog
        open={educationDialogOpen}
        onOpenChange={setEducationDialogOpen}
        onSubmit={handleSaveEducation}
        defaultValues={editingEducation || undefined}
      />

      <CertificationFormDialog
        open={certificationDialogOpen}
        onOpenChange={setCertificationDialogOpen}
        onSubmit={handleSaveCertification}
        defaultValues={editingCertification || undefined}
      />

      <LinkFormDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onSubmit={handleSaveLink}
        defaultValues={editingLink || undefined}
      />
    </div>
  )
}
