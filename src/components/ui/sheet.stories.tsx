import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"

const meta: Meta<typeof Sheet> = {
  title: "ui/Sheet",
  component: Sheet,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}
