import CodeIcon from '@mui/icons-material/Code';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { ReactElement } from 'react';
import { BRAND_COLORS } from '@/app/theme';
import { PageContainer } from '@/shared/components/PageContainer';
import { Seo } from '@/shared/components/Seo';
import { FACEBOOK_PAGE_URL, GITHUB_API_REPO_URL, GITHUB_WEB_REPO_URL } from '@/shared/constants/site';

/** 移植自舊版 AboutPage。 */
const PRE_REGISTER_INFO = [
  '我們依照用戶回饋全面優化，再次感謝您的支持！',
  '申請帳號時須完成手機簡訊驗證。',
  '本平台並非法律機構，若有疑問請透過粉絲專頁提問。',
];

const VALUES: { icon: ReactElement; title: string; description: string }[] = [
  { icon: <VisibilityOutlinedIcon />, title: '資訊互通', description: '整理公開判決與會員經驗，讓租屋資訊不再不對等。' },
  { icon: <HandshakeOutlinedIcon />, title: '風險減少', description: '簽約前先查詢，協助房東與房客快速掌握可能的風險。' },
  { icon: <CodeIcon />, title: '開源透明', description: '由站長自發籌組維護，程式碼公開於 GitHub。' },
];

export function AboutPage() {
  return (
    <PageContainer title="關於我們" subtitle="資訊互通、風險減少" maxWidth="md">
      <Seo title="關於我們" description="租屋通由站長自發籌組維護、採開源模式運作，協助房東與租客在租屋流程中快速掌握可能的風險。" />
      <Stack spacing={4}>
        <Typography variant="body1" sx={{ fontSize: '1.0625rem', lineHeight: 1.9 }}>
          「租屋通」是由站長自發籌組維護，採開源模式運作。以「資訊互通、風險減少」為核心理念，協助房東與租客在租屋流程中快速掌握可能的風險，同步促進租屋市場的透明與公平。
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' } }}>
          {VALUES.map((value) => (
            <Paper key={value.title} variant="outlined" sx={{ p: 2.5, borderRadius: '16px' }}>
              <Box
                aria-hidden
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'primary.main',
                  backgroundColor: BRAND_COLORS.primaryLight,
                  mb: 1.5,
                }}
              >
                {value.icon}
              </Box>
              <Typography variant="h5" component="h2">
                {value.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {value.description}
              </Typography>
            </Paper>
          ))}
        </Box>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '16px' }}>
          <Typography variant="h4" component="h2" sx={{ mb: 1.5 }}>
            加入前請先了解
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 1, color: 'text.secondary' } }}>
            {PRE_REGISTER_INFO.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </Box>
        </Paper>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button variant="contained" href={FACEBOOK_PAGE_URL} target="_blank" rel="noopener noreferrer">
            粉絲專頁
          </Button>
          <Button variant="outlined" href={GITHUB_WEB_REPO_URL} target="_blank" rel="noopener noreferrer" startIcon={<CodeIcon />}>
            前端原始碼
          </Button>
          <Button variant="outlined" href={GITHUB_API_REPO_URL} target="_blank" rel="noopener noreferrer" startIcon={<CodeIcon />}>
            後端原始碼
          </Button>
        </Stack>
        <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ borderRadius: '12px' }}>
          免責聲明：本網站僅為資訊交流之用，對使用者所張貼的內容不承擔法律責任。若您對個別案例有進一步意見，歡迎透過留言留下你的意見。
        </Alert>
      </Stack>
    </PageContainer>
  );
}
