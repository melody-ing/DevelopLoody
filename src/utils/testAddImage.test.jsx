// src/components/Part.test.jsx
import Part from "@/pages/Part";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

describe("Part component", () => {
  it("should not allow entering spaces", () => {
    render(
      <BrowserRouter>
        <Part />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("暱稱");
    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");
  });

  it("should not allow more than 10 characters", () => {
    render(
      <BrowserRouter>
        <Part />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("暱稱");
    fireEvent.change(input, { target: { value: "12345678901" } });
    expect(input.value).toBe("1234567890");
  });

  it("should display character count correctly", () => {
    render(
      <BrowserRouter>
        <Part />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("暱稱");
    const warningText = screen.getByText("0/10");

    fireEvent.change(input, { target: { value: "test" } });
    expect(warningText.textContent).toBe("4/10");
  });
});
