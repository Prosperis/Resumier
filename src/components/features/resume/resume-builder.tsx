import { useResumeStore } from "@/stores"

export function ResumeBuilder() {
  const userInfo = useResumeStore((state) => state.userInfo)

  const experiences = userInfo.experiences ?? []
  const education = userInfo.education ?? []
  const skills = userInfo.skills ?? []
  const certifications = userInfo.certifications ?? []

  return (
    <div className="mx-auto w-full max-w-2xl bg-background p-8 rounded-md shadow">
      <header className="text-center space-y-1 mb-6">
        <h1 className="text-3xl font-bold">{userInfo.name || "Your Name"}</h1>
        <p>{userInfo.email}</p>
        <p>{userInfo.phone}</p>
        <p>{userInfo.address}</p>
      </header>

      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Experience</h2>
          <ul className="space-y-4">
            {experiences.map((exp, i) => (
              <li key={i} className="border-b pb-2">
                <div className="font-medium">
                  {exp.title || "Role"} - {exp.company || "Company"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </div>
                {exp.description && <p>{exp.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Education</h2>
          <ul className="space-y-4">
            {education.map((ed, i) => (
              <li key={i} className="border-b pb-2">
                <div className="font-medium">
                  {ed.degree || "Degree"} - {ed.school || "School"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ed.startDate} - {ed.endDate}
                </div>
                {ed.description && <p>{ed.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <li key={i} className="border px-2 py-1 rounded text-sm">
                {typeof skill === "string" ? skill : skill.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Certifications</h2>
          <ul className="space-y-2">
            {certifications.map((cert, i) => (
              <li key={i} className="text-sm">
                {cert.name}
                {cert.expiration && (
                  <span className="text-muted-foreground"> - {cert.expiration}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
