'use client'
import * as React from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CRUDLinksComponent from '@/components/Controls/CRUDLinks';
import { SessionViewOneComponent } from '@/components/Sections/Session';

export default function SessionsViewOnePage({ params }: { params: { sessionId: string } }) {
    console.log("params", params);
    const { sessionId } = params;
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/sessions">
                    Sessions
                </Link>
                <Typography color="text.primary">{`${sessionId.toUpperCase().slice(-8)}`} (view)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>View Session</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/sessions"
                    resourceId={`${sessionId.toLowerCase()}`}
                    createLink={false}
                    readLink={false}
                    hasText={false}
                />
            </Box>

            <SessionViewOneComponent
                sessionId={sessionId}
            />


        </>

    );
}
