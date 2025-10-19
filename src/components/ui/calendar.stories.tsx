import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./calendar"

const meta: Meta<typeof Calendar> = {
  title: "ui/Calendar",
  component: Calendar,
  tags: ["autodocs"],
}
export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {},
}
