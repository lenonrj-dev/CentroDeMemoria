import { render, screen } from "@testing-library/react";
import { DepoimentoCard } from "../ui";

describe("DepoimentoCard", () => {
  it("mostra autor, papel e trecho", () => {
    render(
      <DepoimentoCard
        author="Maria"
        role="Trabalhadora"
        excerpt="Participamos da greve de 1979."
        date="1979-04-20"
        theme="Greve"
        avatar="/hero.png"
      />
    );

    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("Trabalhadora")).toBeInTheDocument();
    expect(screen.getByText(/1979-04-20/)).toBeInTheDocument();
    expect(screen.getAllByText(/greve/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Participamos da greve/)).toBeInTheDocument();
  });
});
