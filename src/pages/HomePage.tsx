import { Box, Container, Typography } from '@mui/material';
import { RiskSection } from '@/features/judgments/components/RiskSection';
import { HowItWorks } from '@/features/home/components/HowItWorks';
import { LatestCasesSection } from '@/features/home/components/LatestCasesSection';
import { SearchHero } from '@/features/home/components/SearchHero';
import { TrustSection } from '@/features/home/components/TrustSection';
import { Seo } from '@/shared/components/Seo';

export function HomePage() {
  return (
    <>
      <Seo />
      <SearchHero />
      <HowItWorks />
      <Box component="section" aria-labelledby="risk-title" sx={{ backgroundColor: 'background.paper', borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Typography id="risk-title" variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
            高風險名單
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            依各縣市租賃判決中敗訴次數統計。名單僅供參考，同名同姓者眾，請務必點進判決自行查證。
          </Typography>
          <RiskSection />
        </Container>
      </Box>
      <LatestCasesSection />
      <TrustSection />
    </>
  );
}
