import type { Meta, StoryObj } from "@storybook/react"
import { Skeleton } from "./skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "ui/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: { className: "h-4 w-32" },
}
