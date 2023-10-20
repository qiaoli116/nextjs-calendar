'use client'
import * as React from 'react';
import { TeacherViewOneComponent } from '../../../../components/Sections/Teacher';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export default function TeachersViewOnePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.orgId}</Typography>
            </Breadcrumbs>
            <h2>View teacher</h2>
            <TeacherViewOneComponent
                orgId={params.orgId}
            />
            <Box component="span" sx={{ mr: "10px" }} >
                <Link href={`/teachers/edit/${params.orgId}`}>Edit</Link>
            </Box>


        </>

    );
}
