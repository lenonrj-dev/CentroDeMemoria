import type { SiteContent } from "./content-types";
import { aboutContent } from "../app/api/content/about/data";
import { acervoContent } from "../app/api/content/acervo/data";
import { accessContent } from "../app/api/content/access/data";
import { boardContent } from "../app/api/content/board/data";
import { contactContent } from "../app/api/content/contact/data";
import { globalContent } from "../app/api/content/global/data";
import { homeContent } from "../app/api/content/home/data";
import { journalsContent } from "../app/api/content/journals/data";
import { personalContent } from "../app/api/content/personal/data";
import { politicsContent } from "../app/api/content/politics/data";
import { productionContent } from "../app/api/content/production/data";
import { teamContent } from "../app/api/content/team/data";
import { transparencyContent } from "../app/api/content/transparency/data";

export const siteContent: SiteContent = {
  home: homeContent,
  about: aboutContent,
  acervo: acervoContent,
  politics: politicsContent,
  access: accessContent,
  contact: contactContent,
  personal: personalContent,
  global: globalContent,
  transparency: transparencyContent,
  board: boardContent,
  team: teamContent,
  production: productionContent,
  journals: journalsContent,
};

export async function getSiteContent(): Promise<SiteContent> {
  return siteContent;
}
