import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form"
import { Input } from "./input"

// Mock animation hook
vi.mock("@/lib/animations/hooks/use-reduced-motion", () => ({
  useReducedMotion: () => false,
}))

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof formSchema>

function TestForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" data-testid="username-input" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" data-testid="email-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe("Form", () => {
  describe("rendering", () => {
    it("renders form fields", () => {
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      expect(screen.getByText("Username")).toBeInTheDocument()
      expect(screen.getByText("Email")).toBeInTheDocument()
      expect(screen.getByTestId("username-input")).toBeInTheDocument()
      expect(screen.getByTestId("email-input")).toBeInTheDocument()
    })

    it("renders FormDescription", () => {
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      expect(screen.getByText("This is your public display name.")).toBeInTheDocument()
    })

    it("associates label with input via htmlFor", () => {
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameLabel = screen.getByText("Username")
      const usernameInput = screen.getByTestId("username-input")

      expect(usernameLabel).toHaveAttribute("for", usernameInput.id)
    })
  })

  describe("validation", () => {
    it("shows validation error for short username", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const submitButton = screen.getByText("Submit")

      await user.type(usernameInput, "a")
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText("Username must be at least 2 characters")).toBeInTheDocument()
      })

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it("shows validation error for invalid email", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const emailInput = screen.getByTestId("email-input")
      const submitButton = screen.getByText("Submit")

      await user.type(usernameInput, "testuser")
      await user.type(emailInput, "invalid-email")
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument()
      })

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it("submits form with valid data", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const emailInput = screen.getByTestId("email-input")
      const submitButton = screen.getByText("Submit")

      await user.type(usernameInput, "testuser")
      await user.type(emailInput, "test@example.com")
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          email: "test@example.com",
        }),
        expect.anything(), // event object
      )
    })

    it("clears error when input becomes valid", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const submitButton = screen.getByText("Submit")

      // Submit with invalid data
      await user.type(usernameInput, "a")
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText("Username must be at least 2 characters")).toBeInTheDocument()
      })

      // Fix the input
      await user.clear(usernameInput)
      await user.type(usernameInput, "validuser")

      await waitFor(() => {
        expect(screen.queryByText("Username must be at least 2 characters")).not.toBeInTheDocument()
      })
    })
  })

  describe("accessibility", () => {
    it("sets aria-invalid on field with error", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const submitButton = screen.getByText("Submit")

      await user.type(usernameInput, "a")
      await user.click(submitButton)

      await waitFor(() => {
        expect(usernameInput).toHaveAttribute("aria-invalid", "true")
      })
    })

    it("sets aria-describedby to description id", () => {
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const description = screen.getByText("This is your public display name.")

      expect(usernameInput).toHaveAttribute("aria-describedby")
      const ariaDescribedby = usernameInput.getAttribute("aria-describedby")
      expect(ariaDescribedby).toBe(description.id)
    })

    it("includes error message id in aria-describedby when there's an error", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const submitButton = screen.getByText("Submit")

      await user.type(usernameInput, "a")
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText("Username must be at least 2 characters")
        const ariaDescribedby = usernameInput.getAttribute("aria-describedby")
        expect(ariaDescribedby).toContain(errorMessage.id)
      })
    })
  })

  describe("FormMessage", () => {
    it("renders error message from validation", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const submitButton = screen.getByText("Submit")

      await user.type(usernameInput, "a")
      await user.click(submitButton)

      await waitFor(() => {
        const errorMessage = screen.getByText("Username must be at least 2 characters")
        expect(errorMessage).toHaveClass("text-destructive")
      })
    })

    it("does not render when there's no error", () => {
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      // No error messages should be present initially
      expect(screen.queryByText("Username must be at least 2 characters")).not.toBeInTheDocument()
      expect(screen.queryByText("Invalid email address")).not.toBeInTheDocument()
    })
  })

  describe("FormLabel", () => {
    it("adds error styling when field has error", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<TestForm onSubmit={onSubmit} />)

      const usernameInput = screen.getByTestId("username-input")
      const submitButton = screen.getByText("Submit")
      const usernameLabel = screen.getByText("Username")

      await user.type(usernameInput, "a")
      await user.click(submitButton)

      await waitFor(() => {
        expect(usernameLabel).toHaveClass("text-destructive")
      })
    })
  })
})
