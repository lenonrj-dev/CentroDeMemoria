import { fireEvent, render, screen } from "@testing-library/react";
import { PhotoMasonryGrid } from "../ui";

const photos = [
  {
    src: "/hero.png",
    alt: "Foto 1",
    year: "1948",
    location: "VR",
    description: "Cena de fábrica",
    tags: ["Cotidiano"],
  },
  {
    src: "/CUT.png",
    alt: "Foto 2",
    year: "1950",
    location: "Praça",
    description: "Assembleia",
    tags: ["Mobilização"],
  },
];

describe("PhotoMasonryGrid", () => {
  it("renderiza cards e abre lightbox", () => {
    render(<PhotoMasonryGrid photos={photos} />);
    expect(screen.getByText("Foto 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Foto 1"));
    expect(screen.getAllByText(/Cena de fábrica/).length).toBeGreaterThan(0);
  });
});
