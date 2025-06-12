import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import CaseCardList from "../component/CaseCardList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchData } from "../redux/dataSlice";

export default function DiscussionPage() {
    const dispatch = useAppDispatch();
    const cases = useAppSelector((s) => s.data.list);

    useEffect(() => {
        dispatch(fetchData({}));
    }, [dispatch]);

    return (
        <Box sx={{ mt: "-48px", p: 2 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                討論區
            </Typography>
            <CaseCardList items={cases} />
        </Box>
    );
}
