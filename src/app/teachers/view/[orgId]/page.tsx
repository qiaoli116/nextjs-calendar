'use client'
import * as React from 'react';
import { TeacherViewOneComponent } from '../../../../components/Sections/Teacher';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CRUDLinksComponent from '../../../../components/Controls/CRUDLinks';

export default function TeachersViewOnePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.orgId} (view)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>View teacher</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/teachers"
                    resourceId={params.orgId}
                    createLink={false}
                    readLink={false}
                    hasText={false}
                />
            </Box>

            <TeacherViewOneComponent
                orgId={params.orgId}
            />


        </>

    );
}
