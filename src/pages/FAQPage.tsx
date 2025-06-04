import React from 'react';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqData = [
    {
        q: '若碰上租客提交偽造資訊？',
        sub: [
            { q: '姓名或身分證號不實', a: '簽約時一定要當場核對承租人身分證正本。' },
            { q: '電話號碼不實', a: '於簽約現場立刻撥打其手機以確認門號有效。' },
        ],
    },
    {
        q: '給房東的提醒',
        a: [
            '請以真實身份完成平台驗證，確保整體服務水準。',
            '您應對所張貼的內容負責；如遇檢調機關調查，平台將依法配合。',
            '建議在租約備註：「發生爭議時，房東可將事件與房客資料上傳至網路相關平台」。',
            '切勿縱容慣犯，及時紀錄並分享案例，可降低其他房東受害風險。',
        ],
    },
    {
        q: '註冊前須知',
        a: [
            '新版已依會員意見大幅優化介面及資料安全。',
            '因後續資訊較為敏感，註冊時需先完成手機驗證程序。',
            '平台規範將不定期調整，請以官網最新公告為準。',  
        ],
    },
];

export default function FAQPage() {
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                常見問題 FAQ
            </Typography>

            {faqData.map((item, idx) => (
                <Accordion key={idx} defaultExpanded={idx === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{item.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* 若有子題目格式 */}
                        {item.sub && (
                            <List dense>
                                {item.sub.map((sub, sIdx) => (
                                    <ListItem key={sIdx}>
                                        <ListItemText
                                            primary={sub.q}
                                            secondary={sub.a}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        {/* 一般條列 */}
                        {item.a && (
                            <List dense>
                                {item.a.map((txt, aIdx) => (
                                    <ListItem key={aIdx}>
                                        <ListItemText primary={txt} />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}
