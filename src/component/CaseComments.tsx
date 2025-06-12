import React from "react";
import { Box } from "@mui/material";
import CaseCommentForm from "./CaseCommentForm";
import CaseCommentList from "./CaseCommentList";

interface Props {
    caseId: number;
}

const CaseComments: React.FC<Props> = ({ caseId }) => (
    <Box>
        <CaseCommentForm caseId={caseId} />
        <CaseCommentList caseId={caseId} />
    </Box>
);

export default CaseComments;
