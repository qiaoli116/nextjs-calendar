'use client'
import * as React from 'react';
import { TeacherDeleteComponent } from '../../../../components/Sections/Teacher';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ITeacher } from '../../../../types';
import Box from '@mui/material/Box';



export default function TeachersDeletePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.orgId} (delete)</Typography>
            </Breadcrumbs>
            <h2>Delete teacher</h2>
            <TeacherDeleteComponent
                orgId={params.orgId}
            />
            <Box component="span" sx={{ mr: "10px" }} >
                <Link href={`/teachers/view/${params.orgId}`}>View</Link>
            </Box>
            <Box component="span" sx={{ mr: "10px" }} >
                <Link href={`/teachers/edit/${params.orgId}`}>Edit</Link>
            </Box>
            <Box component="span" sx={{ mr: "10px" }} >
                <Link href={`/teachers/delete/${params.orgId}`}>Delete</Link>
            </Box>
        </>

    );
}
