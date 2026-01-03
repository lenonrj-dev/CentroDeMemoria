import type { CityData } from "../../cityData";
import type {
  DocumentContent,
  JournalContent,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "@/lib/backend-types";

export type CityPreviews = {
  documents?: DocumentContent[];
  testimonials?: TestimonialContent[];
  references?: ReferenceContent[];
  journals?: JournalContent[];
  photoArchives?: PhotoArchiveContent[];
};

export type CityLandingProps = { city: CityData; previews?: CityPreviews };
