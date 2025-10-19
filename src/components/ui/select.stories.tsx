import type { Meta, StoryObj } from "@storybook/react"
import { Select } from "./select"

const meta: Meta<typeof Select> = {
  title: "ui/Select",
  component: Select,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {},
}
