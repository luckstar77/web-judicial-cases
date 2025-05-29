import React from 'react';
import { Box } from '@mui/material';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface Props {
  filesetId: number;
}

const JudicialFilesetComments: React.FC<Props> = ({ filesetId }) => (
    <Box>
        <CommentForm filesetId={filesetId} />
        <CommentList filesetId={filesetId} />
    </Box>
);

export default JudicialFilesetComments;
