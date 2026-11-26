import { HowItWorks } from '@/features/home/components/HowItWorks';
import { LatestCasesSection } from '@/features/home/components/LatestCasesSection';
import { SearchHero } from '@/features/home/components/SearchHero';
import { TrustSection } from '@/features/home/components/TrustSection';
import { Seo } from '@/shared/components/Seo';

/** 首頁。高風險名單（RiskSection）暫不呈現，元件保留在 features/judgments 以便日後恢復。 */
export function HomePage() {
  return (
    <>
      <Seo />
      <SearchHero />
      <HowItWorks />
      <LatestCasesSection />
      <TrustSection />
    </>
  );
}
