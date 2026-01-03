import { render, screen } from "@testing-library/react";
import Page from "../page";

describe("Page /acervo/volta-redonda", () => {
  it("renderiza a landing com título da cidade", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: /acervo de volta redonda/i })).toBeInTheDocument();
    expect(screen.getByText(/Sessões principais/i)).toBeInTheDocument();
  });
});
