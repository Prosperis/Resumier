import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

const meta: Meta<typeof Tooltip> = {
  title: "ui/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip text</TooltipContent>
    </Tooltip>
  ),
}
