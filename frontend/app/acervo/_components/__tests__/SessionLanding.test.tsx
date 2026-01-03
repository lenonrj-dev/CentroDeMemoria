import { render, screen } from "@testing-library/react";
import SessionLanding from "../SessionLanding";
import { cities, getSection } from "../../cityData";

describe("SessionLanding", () => {
  const city = cities[0];
  const section = getSection(city, "documentos")!;

  it("exibe breadcrumb e título da sessão", () => {
    render(
      <SessionLanding
        city={city}
        section={section}
        breadcrumb={[
          { label: "Acervo", href: "/acervo" },
          { label: city.name, href: `/acervo/${city.slug}` },
          { label: section.title },
        ]}
      />
    );

    expect(screen.getByRole("heading", { level: 1, name: section.title })).toBeInTheDocument();
    expect(screen.getAllByText(city.name).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Breadcrumb/i)).toBeInTheDocument();
  });
});
