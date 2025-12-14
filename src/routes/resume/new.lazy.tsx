import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Create new resume route component (lazy loaded)
 * Creates a new resume and navigates to editor
 */
export const Route = createLazyFileRoute("/resume/new")({
  component: NewResumeComponent,
});

function NewResumeComponent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate: createResume, isPending } = useCreateResume();
  const [title, setTitle] = useState("");

  // Auto-focus title input on mount
  useEffect(() => {
    const input = document.querySelector('input[name="title"]') as HTMLInputElement;
    input?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a resume title",
        variant: "destructive",
      });
      return;
    }

    createResume(
      { title: title.trim() },
      {
        onSuccess: (newResume) => {
          toast({
            title: "Success",
            description: "Resume created successfully",
          });
          // Navigate to the new resume editor
          navigate({ to: "/resume/$id", params: { id: newResume.id } });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to create resume: ${error.message}`,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Resume</CardTitle>
          <CardDescription>Give your resume a title to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Software Engineer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                required
              />
              <p className="text-sm text-muted-foreground">You can change this later</p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Creating..." : "Create Resume"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/dashboard" })}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
