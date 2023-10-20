'use client'
import * as React from 'react';
import { TeacherDeleteComponent } from '../../../../components/Sections/Teacher';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ITeacher } from '../../../../types';



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
        </>

    );
}
