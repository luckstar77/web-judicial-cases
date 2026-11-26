import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Link as RouterLink } from 'react-router-dom';
import { SourceBadge } from '@/shared/components/SourceBadge';
import { FAQ_ITEMS } from '@/shared/content/faq';
import { ROUTES } from '@/shared/constants/routes';
import { DISCLAIMER_TEXT } from '@/shared/constants/site';
import { SOURCE_TYPES } from '@/shared/constants/source';

const TEASER_IDS = ['judgment-source', 'community-trust', 'forged-info'];
const TEASER_ITEMS = FAQ_ITEMS.filter((item) => TEASER_IDS.includes(item.id));

export function TrustSection() {
  return (
    <Box component="section" aria-labelledby="trust-title" sx={{ backgroundColor: 'background.paper', borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <VerifiedUserOutlinedIcon color="primary" aria-hidden />
                <Typography id="trust-title" variant="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                  資料來源，一眼分清
                </Typography>
              </Stack>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '16px' }}>
                <SourceBadge source={SOURCE_TYPES.judgment} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  整理自司法院公開的租賃糾紛判決，提供案號、裁判日期與勝訴方，內容以官方公告為準。
                </Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '16px' }}>
                <SourceBadge source={SOURCE_TYPES.community} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  由實名驗證會員分享的經驗，平台未經查證，個資自動遮罩，請當作參考線索。
                </Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary">
                {DISCLAIMER_TEXT}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Typography variant="h3" component="h2">
                常見問題
              </Typography>
              <Box>
                {TEASER_ITEMS.map((item) => (
                  <Accordion key={item.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {item.answers?.map((answer) => (
                        <Typography key={answer} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {answer}
                        </Typography>
                      ))}
                      {item.subItems?.map((sub) => (
                        <Typography key={sub.question} variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>{sub.question}：</strong>
                          {sub.answer}
                        </Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              <Box>
                <Button component={RouterLink} to={ROUTES.faq} endIcon={<ArrowForwardIcon />}>
                  看更多常見問題
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
