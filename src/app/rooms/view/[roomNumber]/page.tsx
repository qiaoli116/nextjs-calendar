'use client'
import * as React from 'react';
import { RoomViewOneComponent } from '../../../../components/Sections/Room';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CRUDLinksComponent from '../../../../components/Controls/CRUDLinks';

export default function RoomsViewOnePage({ params }: { params: { roomNumber: string } }) {
    console.log("params", params);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.roomNumber} (view)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>View teacher</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/teachers"
                    resourceId={params.roomNumber}
                    createLink={false}
                    readLink={false}
                    hasText={false}
                />
            </Box>

            <RoomViewOneComponent
                roomNumber={params.roomNumber}
            />
        </>

    );
}
