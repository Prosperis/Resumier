import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PdfViewer } from "../pdf-viewer";

describe("PdfViewer", () => {
  describe("Rendering", () => {
    it("renders an iframe", () => {
      const { container } = render(<PdfViewer />);

      const iframe = container.querySelector("iframe");
      expect(iframe).toBeInTheDocument();
    });

    it("renders with correct source", () => {
      const { container } = render(<PdfViewer />);

      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("src", "/blank.pdf");
    });

    it("has resume preview title", () => {
      const { container } = render(<PdfViewer />);

      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveAttribute("title", "Resume Preview");
    });
  });

  describe("Styling", () => {
    it("has full width and height", () => {
      const { container } = render(<PdfViewer />);

      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveClass("h-full");
      expect(iframe).toHaveClass("w-full");
    });

    it("has no border", () => {
      const { container } = render(<PdfViewer />);

      const iframe = container.querySelector("iframe");
      expect(iframe).toHaveClass("border-0");
    });
  });

  describe("Accessibility", () => {
    it("has descriptive title attribute", () => {
      render(<PdfViewer />);

      const iframe = screen.getByTitle("Resume Preview");
      expect(iframe).toBeInTheDocument();
    });

    it("iframe is accessible", () => {
      render(<PdfViewer />);

      // Iframe should have title for accessibility
      const iframe = screen.getByTitle("Resume Preview");
      expect(iframe.tagName).toBe("IFRAME");
    });
  });
});
