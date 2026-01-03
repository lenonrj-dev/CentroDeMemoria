import { render, screen } from "@testing-library/react";
import { DocumentCard } from "../ui";

describe("DocumentCard", () => {
  it("renderiza título, data e tags", () => {
    render(
      <DocumentCard
        title="Ata de Assembleia"
        summary="Deliberação sobre pauta salarial."
        date="1961-09-18"
        location="Volta Redonda"
        tags={["Documento", "Ata"]}
      />
    );

    expect(screen.getByText("Ata de Assembleia")).toBeInTheDocument();
    expect(screen.getByText("1961-09-18")).toBeInTheDocument();
    expect(screen.getByText("Volta Redonda")).toBeInTheDocument();
    expect(screen.getByText("Documento")).toBeInTheDocument();
    expect(screen.getByText("Ata")).toBeInTheDocument();
  });
});
