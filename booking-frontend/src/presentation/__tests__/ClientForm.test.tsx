import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ClientForm } from "../components/ClientForm";

describe("ClientForm", () => {
  const mockOnCreateClient = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form fields and submit button", () => {
    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    expect(screen.getByText("Create New Client")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Client full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("client@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("809-000-5555")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create client/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error when fields are empty", async () => {
    const user = userEvent.setup();

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.click(screen.getByRole("button", { name: /create client/i }));

    expect(screen.getByText("All fields are required")).toBeInTheDocument();
    expect(mockOnCreateClient).not.toHaveBeenCalled();
  });

  it("calls onCreateClient with trimmed values", async () => {
    const user = userEvent.setup();

    mockOnCreateClient.mockResolvedValue({
      success: true,
      message: "Client created successfully",
    });

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.type(screen.getByPlaceholderText("Client full name"), " Tony ");
    await user.type(
      screen.getByPlaceholderText("client@email.com"),
      " tony@email.com ",
    );
    await user.type(
      screen.getByPlaceholderText("809-000-5555"),
      " 8091234567 ",
    );

    await user.click(screen.getByRole("button", { name: /create client/i }));

    await waitFor(() => {
      expect(mockOnCreateClient).toHaveBeenCalledWith(
        "Tony",
        "tony@email.com",
        "8091234567",
      );
    });
  });

  it("shows error message when onCreateClient returns success false", async () => {
    const user = userEvent.setup();

    mockOnCreateClient.mockResolvedValue({
      success: false,
      message: "Client already exists",
    });

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.type(screen.getByPlaceholderText("Client full name"), "Tony");
    await user.type(
      screen.getByPlaceholderText("client@email.com"),
      "tony@email.com",
    );
    await user.type(screen.getByPlaceholderText("809-000-5555"), "8091234567");

    await user.click(screen.getByRole("button", { name: /create client/i }));

    expect(
      await screen.findByText("Client already exists"),
    ).toBeInTheDocument();
  });

  it("shows default error message when success is false and no message is returned", async () => {
    const user = userEvent.setup();

    mockOnCreateClient.mockResolvedValue({
      success: false,
    });

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.type(screen.getByPlaceholderText("Client full name"), "Tony");
    await user.type(
      screen.getByPlaceholderText("client@email.com"),
      "tony@email.com",
    );
    await user.type(screen.getByPlaceholderText("809-000-5555"), "8091234567");

    await user.click(screen.getByRole("button", { name: /create client/i }));

    expect(
      await screen.findByText("Failed to create client"),
    ).toBeInTheDocument();
  });

  it("shows success message and clears inputs when client is created successful", async () => {
    const user = userEvent.setup();

    mockOnCreateClient.mockResolvedValue({
      success: true,
      message: "Client created successfully",
    });

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    const nameInput = screen.getByPlaceholderText(
      "Client full name",
    ) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(
      "Client@email.com",
    ) as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText(
      "809-000-5555",
    ) as HTMLInputElement;

    await user.type(nameInput, "Tony");
    await user.type(emailInput, "tony@email.com");
    await user.type(phoneInput, "8091234567");

    await user.click(screen.getByRole("button", { name: /create client/i }));

    expect(
      await screen.findByText("Client created successfully"),
    ).toBeInTheDocument();

    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(phoneInput.value).toBe("");
  });

  it("shows default success message when success is true and no message is returned", async () => {
    const user = userEvent.setup();

    mockOnCreateClient.mockResolvedValue({
      success: true,
    });

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.type(screen.getByPlaceholderText("Client full name"), "Tony");
    await user.type(
      screen.getByPlaceholderText("client@email.com"),
      "tony@email.com",
    );
    await user.type(screen.getByPlaceholderText("809-000-5555"), "8091234567");

    await user.click(screen.getByRole("button", { name: /create client/i }));

    expect(
      await screen.findByText("Client created successfully"),
    ).toBeInTheDocument();
  });

  it("shows unexpected error message when onCreatedClient throws", async () => {
    const user = userEvent.setup();

    mockOnCreateClient.mockRejectedValue(new Error("Network error"));

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.type(screen.getByPlaceholderText("Client full name"), "Tony");
    await user.type(
      screen.getByPlaceholderText("client@email.com"),
      "tony@email.com",
    );
    await user.type(screen.getByPlaceholderText("809-000-5555"), "8091234567");

    await user.click(screen.getByRole("button", { name: /created client/i }));

    expect(
      await screen.findByText("Unexpected error while creating client"),
    ).toBeInTheDocument();
  });

  it("disables the button and shows 'creating...' while submitting", async () => {
    const user = userEvent.setup();

    let resolvePromise: (value: {
      success: boolean;
      message?: string;
    }) => void = () => {};

    mockOnCreateClient.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(<ClientForm onCreateClient={mockOnCreateClient} />);

    await user.type(screen.getByPlaceholderText("Client full name"), "Tony");
    await user.type(
      screen.getByPlaceholderText("client@email.com"),
      "tony@email.com",
    );
    await user.type(screen.getByPlaceholderText("809-000-5555"), "8091234567");

    await user.click(screen.getByRole("button", { name: /create client/i }));

    expect(screen.getByRole("button", { name: /creating.../i })).toBeDefined();

    resolvePromise({ success: true, message: "created" });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /create client/i }),
      ).toBeInTheDocument();
    });
  });
});
