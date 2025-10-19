import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight, Cloud, Download, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Index (home) route
 * Main landing page for the application
 */
export const Route = createFileRoute("/")({
  component: IndexComponent,
})

function IndexComponent() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Resumier</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional resumes with ease using our modern resume builder. Build, customize,
            and download your perfect resume in minutes.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link to="/dashboard">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 pt-8">
          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Multiple Templates</h2>
            <p className="text-muted-foreground">
              Choose from a variety of professional templates tailored to different industries and
              experience levels.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Real-time Preview</h2>
            <p className="text-muted-foreground">
              See your resume come to life as you type. What you see is exactly what you'll get.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Export to PDF</h2>
            <p className="text-muted-foreground">
              Download your resume as a high-quality PDF, ready to send to employers or print.
            </p>
          </div>

          <div className="border rounded-lg p-6 space-y-3 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Cloud Storage</h2>
            <p className="text-muted-foreground">
              Save your resumes securely in the cloud. Access them from anywhere, anytime.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border rounded-lg p-8 text-center space-y-4 bg-muted/50">
          <h3 className="text-2xl font-semibold">Ready to create your resume?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of job seekers who have built their perfect resume with Resumier. Start
            for free today!
          </p>
          <Link to="/resume/new">
            <Button size="lg" className="mt-4">
              Create Your Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
