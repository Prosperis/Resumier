import type { Meta, StoryObj } from "@storybook/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Button } from "./button";

const meta: Meta<typeof Sheet> = {
  title: "ui/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Sheet>;

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
};
