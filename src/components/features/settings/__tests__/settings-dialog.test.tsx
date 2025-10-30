import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsDialog } from "../settings-dialog";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Bell: () => <svg data-testid="bell-icon" />,
  Check: () => <svg data-testid="check-icon" />,
  ChevronRight: () => <svg data-testid="chevron-right-icon" />,
  Globe: () => <svg data-testid="globe-icon" />,
  Home: () => <svg data-testid="home-icon" />,
  Keyboard: () => <svg data-testid="keyboard-icon" />,
  Link: () => <svg data-testid="link-icon" />,
  Lock: () => <svg data-testid="lock-icon" />,
  Menu: () => <svg data-testid="menu-icon" />,
  MessageCircle: () => <svg data-testid="message-circle-icon" />,
  Paintbrush: () => <svg data-testid="paintbrush-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  Video: () => <svg data-testid="video-icon" />,
  X: () => <svg data-testid="x-icon" />,
}));

describe("SettingsDialog", () => {
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Component Structure", () => {
    it("renders without crashing", () => {
      const { container } = render(<SettingsDialog />);
      expect(container).toBeInTheDocument();
    });

    it("renders dialog with settings title", () => {
      render(<SettingsDialog />);
      const settingsElements = screen.getAllByText("Settings");
      expect(settingsElements.length).toBeGreaterThan(0);
    });

    it("renders dialog description", () => {
      render(<SettingsDialog />);
      expect(screen.getByText("Customize your settings here.")).toBeInTheDocument();
    });
  });

  describe("Navigation Items", () => {
    it("renders all navigation menu items", () => {
      render(<SettingsDialog />);
      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Navigation")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Appearance")).toBeInTheDocument();
      const messagesMedia = screen.getAllByText("Messages & media");
      expect(messagesMedia.length).toBeGreaterThan(0);
      expect(screen.getByText("Language & region")).toBeInTheDocument();
      expect(screen.getByText("Accessibility")).toBeInTheDocument();
      expect(screen.getByText("Mark as read")).toBeInTheDocument();
      expect(screen.getByText("Audio & video")).toBeInTheDocument();
      expect(screen.getByText("Connected accounts")).toBeInTheDocument();
      expect(screen.getByText("Privacy & visibility")).toBeInTheDocument();
      expect(screen.getByText("Advanced")).toBeInTheDocument();
    });

    it("renders navigation icons", () => {
      render(<SettingsDialog />);
      expect(screen.getByTestId("bell-icon")).toBeInTheDocument();
      expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
      expect(screen.getByTestId("home-icon")).toBeInTheDocument();
      expect(screen.getByTestId("paintbrush-icon")).toBeInTheDocument();
      expect(screen.getByTestId("message-circle-icon")).toBeInTheDocument();
      expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
      expect(screen.getByTestId("keyboard-icon")).toBeInTheDocument();
      expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      expect(screen.getByTestId("video-icon")).toBeInTheDocument();
      expect(screen.getByTestId("link-icon")).toBeInTheDocument();
      expect(screen.getByTestId("lock-icon")).toBeInTheDocument();
      expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
    });
  });

  describe("Content", () => {
    it("renders content area", () => {
      const { container } = render(<SettingsDialog />);
      // Just verify the component renders without errors
      expect(container).toBeTruthy();
    });

    it("displays multiple Settings breadcrumb instances", () => {
      render(<SettingsDialog />);
      const settingsElements = screen.getAllByText("Settings");
      expect(settingsElements.length).toBeGreaterThan(0);
    });

    it("displays Messages & media breadcrumb", () => {
      render(<SettingsDialog />);
      const messagesMedia = screen.getAllByText("Messages & media");
      expect(messagesMedia.length).toBeGreaterThan(0);
    });
  });
});
