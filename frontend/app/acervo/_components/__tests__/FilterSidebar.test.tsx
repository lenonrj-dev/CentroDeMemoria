import { fireEvent, render, screen } from "@testing-library/react";
import { FilterSidebar } from "../ui";

describe("FilterSidebar", () => {
  it("alterna seleção de filtros", () => {
    render(<FilterSidebar filters={{ label: "Categorias", options: ["Atas", "Relatórios"] }} />);
    const btn = screen.getByRole("button", { name: "Atas" });
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });
});
