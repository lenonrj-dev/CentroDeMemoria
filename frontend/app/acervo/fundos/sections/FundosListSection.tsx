import { ContentContainer, Section } from "../../_components/ui";
import { FundCard } from "../components/FundCard";
import type { Fund } from "../types";

export function FundosListSection({ funds }: { funds: Fund[] }) {
  return (
    <Section className="pt-0 pb-16">
      <ContentContainer>
        <div className="space-y-10">
          {funds.map((fund) => (
            <FundCard key={fund.slug} fund={fund} />
          ))}
        </div>
      </ContentContainer>
    </Section>
  );
}
