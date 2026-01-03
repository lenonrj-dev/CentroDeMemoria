import { fireEvent, render, screen } from "@testing-library/react";
import { ReferenciaCard } from "../ui";

describe("ReferenciaCard", () => {
  it("exibe dados e copia citação", async () => {
    // mock seguro para clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(
      <ReferenciaCard
        title="Memória Operária"
        authors="Equipe CM"
        year="1984"
        type="Livro"
        source="Editora do Sindicato"
        citation="EQUIPE CM. Memória Operária, 1984."
      />
    );

    expect(screen.getByText("Memória Operária")).toBeInTheDocument();
    expect(screen.getByText("Equipe CM")).toBeInTheDocument();
    expect(screen.getByText("1984")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /copiar/i });
    fireEvent.click(button);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("EQUIPE CM. Memória Operária, 1984.");
  });
});
