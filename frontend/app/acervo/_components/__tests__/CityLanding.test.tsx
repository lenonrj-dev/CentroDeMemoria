import { render, screen } from "@testing-library/react";
import CityLanding from "../CityLanding";
import { cities } from "../../cityData";

describe("CityLanding", () => {
  const city = cities[0];

  it("renderiza hero com título e descrição", () => {
    render(<CityLanding city={city} />);
    expect(screen.getByRole("heading", { level: 1, name: new RegExp(city.name, "i") })).toBeInTheDocument();
    expect(
      screen.getAllByText((content) => content.toLowerCase().includes("centro de mem")).length
    ).toBeGreaterThan(0);
  });

  it("lista sessões principais", () => {
    render(<CityLanding city={city} />);
    city.sections.forEach((section) => {
      expect(screen.getAllByText(section.title).length).toBeGreaterThan(0);
      expect(screen.getByText(section.description)).toBeInTheDocument();
    });
  });
});
