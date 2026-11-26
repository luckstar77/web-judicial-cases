import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { PageContainer } from '@/shared/components/PageContainer';
import { Seo } from '@/shared/components/Seo';
import { FAQ_ITEMS, type FaqItem } from '@/shared/content/faq';
import { FACEBOOK_PAGE_URL } from '@/shared/constants/site';

const FIRST_ITEM_ID = FAQ_ITEMS[0]?.id;

function FaqAnswer({ item }: { item: FaqItem }) {
  return (
    <Stack spacing={1.5}>
      {item.subItems?.map((sub) => (
        <Box key={sub.question}>
          <Typography variant="subtitle2" component="p">
            {sub.question}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sub.answer}
          </Typography>
        </Box>
      ))}
      {item.answers && (
        <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.75, color: 'text.secondary', typography: 'body2' } }}>
          {item.answers.map((answer) => (
            <li key={answer}>{answer}</li>
          ))}
        </Box>
      )}
    </Stack>
  );
}

export function FaqPage() {
  return (
    <PageContainer title="常見問題" subtitle="使用租屋通前，先了解這些事" maxWidth="md">
      <Seo title="常見問題" description="租屋通常見問題：判決資料來源、網友回報可信度、註冊與發文規範。" />
      <Box>
        {FAQ_ITEMS.map((item) => (
          <Accordion key={item.id} defaultExpanded={item.id === FIRST_ITEM_ID}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`faq-${item.id}-content`} id={`faq-${item.id}-header`}>
              <Typography variant="h5" component="h2">
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FaqAnswer item={item} />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <Paper
        variant="outlined"
        sx={{ mt: 4, p: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}
      >
        <Box>
          <Typography variant="subtitle1">還有其他問題？</Typography>
          <Typography variant="body2" color="text.secondary">
            歡迎到粉絲專頁留言或私訊，我們會盡快回覆。
          </Typography>
        </Box>
        <Button variant="contained" href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
          前往粉絲專頁
        </Button>
      </Paper>
    </PageContainer>
  );
}
