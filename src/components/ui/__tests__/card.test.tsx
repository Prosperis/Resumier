import { render } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders Card component", () => {
    const { container } = render(<Card>Card content</Card>);
    const card = container.querySelector("[data-slot='card']");
    expect(card).toBeInTheDocument();
  });
  it("renders CardHeader with CardTitle", () => {
    const { getByTestId, getByText } = render(
      <CardHeader data-testid="header">
        <CardTitle>Test Title</CardTitle>
      </CardHeader>
    );
    expect(getByTestId("header")).toBeInTheDocument();
    expect(getByText("Test Title")).toBeInTheDocument();
  });
  it("renders CardDescription", () => {
    const { getByText } = render(<CardDescription>Test description</CardDescription>);
    expect(getByText("Test description")).toBeInTheDocument();
  });
  it("renders CardContent", () => {
    const { getByTestId } = render(
      <CardContent data-testid="content">Card body content</CardContent>
    );
    expect(getByTestId("content")).toBeInTheDocument();
  });
  it("renders CardFooter", () => {
    const { getByTestId } = render(<CardFooter data-testid="footer">Card footer</CardFooter>);
    expect(getByTestId("footer")).toBeInTheDocument();
  });
  it("renders all subcomponents together", () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Description")).toBeInTheDocument();
    expect(getByText("Body")).toBeInTheDocument();
    expect(getByText("Footer")).toBeInTheDocument();
  });
  it("applies interactive prop correctly", () => {
    const { container } = render(<Card interactive>Interactive card</Card>);
    const card = container.querySelector("[data-slot='card']");
    expect(card).toHaveClass("cursor-pointer");
  });
});
