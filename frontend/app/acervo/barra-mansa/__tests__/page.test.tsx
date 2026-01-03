import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("Page /acervo/barra-mansa", () => {
  it("renderiza a landing com título da cidade", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: /acervo de barra mansa/i })).toBeInTheDocument();
    expect(screen.getByText(/Sessões principais/i)).toBeInTheDocument();
  });
});
