import React from 'react';
import {
    Container,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';

const preRegisterInfo = [
    '我們依照用戶回饋全面優化，再次感謝您的支持！',
    '申請帳號時須完成手機簡訊驗證。',
    '本平台並非法律機構，若有疑問請透過留言板提問。',
];

const releaseNotes = [
    { date: '2025-06-04', ver: 'V1.0', note: '核心功能到位，現已開放註冊、留言與關注機制' },
];

export default function AboutPage() {
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                關於我們
            </Typography>

            <Typography variant="body1" paragraph>
                「租屋通」是由站長自發籌組並共同維護，
                採開源模式運作。我們以「資訊互通、風險減少」為核心理念，
                協助房東與租客在整個租賃流程中快速掌握可能的風險，
                同步促進租屋市場的透明與公平。
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                加入前請先了解
            </Typography>
            <List dense>
                {preRegisterInfo.map((txt, idx) => (
                    <ListItem key={idx}>
                        <ListItemText primary={txt} />
                    </ListItem>
                ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom>
                版本更新
            </Typography>
            {releaseNotes.map((r, idx) => (
                <Box key={idx} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">
                        {r.date} – {r.ver}
                    </Typography>
                    <Typography variant="body2">{r.note}</Typography>
                </Box>
            ))}

            <Divider sx={{ my: 3 }} />

            <Typography variant="caption" color="text.secondary">
                免責聲明：本網站僅為資訊交流之用，對使用者所張貼的內容不承擔法律責任。
                若您對個別案例有進一步意見，歡迎透過留言留下你的意見。
            </Typography>
        </Container>
    );
}
