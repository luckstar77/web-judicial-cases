import React from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface Props { filesetId: number; }

const JudicialFilesetComments: React.FC<Props> = ({ filesetId }) => (
    <div>
        <CommentForm filesetId={filesetId} />
        <CommentList filesetId={filesetId} />
    </div>
);
export default JudicialFilesetComments;
