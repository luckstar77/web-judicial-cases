import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { Alert, AlertTitle, Box } from '@mui/material';
import { CASE_GUIDELINES } from '../constants';

export function CaseGuidelines() {
  return (
    <Alert
      severity="warning"
      icon={<GppMaybeOutlinedIcon />}
      sx={{ borderRadius: '12px', border: '1px solid #F3D9AE', '& .MuiAlert-message': { width: '100%' } }}
    >
      <AlertTitle sx={{ fontWeight: 700 }}>發文規範</AlertTitle>
      <Box component="ul" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
        {CASE_GUIDELINES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </Box>
    </Alert>
  );
}
