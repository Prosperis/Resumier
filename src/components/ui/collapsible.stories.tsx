import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"

const meta: Meta<typeof Collapsible> = {
  title: "ui/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button>Toggle</Button>
      </CollapsibleTrigger>
      <CollapsibleContent>Hidden content</CollapsibleContent>
    </Collapsible>
  ),
}
