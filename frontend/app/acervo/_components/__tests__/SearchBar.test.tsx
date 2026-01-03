import { render, screen } from "@testing-library/react";
import { SearchBar } from "../ui";

describe("SearchBar", () => {
  it("renderiza input com placeholder", () => {
    render(<SearchBar placeholder="Buscar..." ariaLabel="Busca" />);
    const input = screen.getByLabelText("Busca");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Buscar...");
  });
});
