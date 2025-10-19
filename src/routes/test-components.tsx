import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/test-components")({
  component: TestComponents,
})

function TestComponents() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">shadcn/ui Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Testing all installed components with the new router setup
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>Testing all button styles</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>Input fields with labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
          <CardDescription>Different badge styles</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Test</CardTitle>
          <CardDescription>Verify Tailwind v4 theming works</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-primary-foreground rounded-lg p-4">Primary</div>
            <div className="bg-secondary text-secondary-foreground rounded-lg p-4">Secondary</div>
            <div className="bg-muted text-muted-foreground rounded-lg p-4">Muted</div>
            <div className="bg-accent text-accent-foreground rounded-lg p-4">Accent</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
