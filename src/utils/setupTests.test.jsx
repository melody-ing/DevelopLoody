import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";

import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Home component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("navigates to /entry on button click", () => {
    const navigate = vi.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const entryButton = screen.getByText(/加入遊戲/i);
    fireEvent.click(entryButton);

    expect(navigate).toHaveBeenCalledWith("/entry");
  });
});
