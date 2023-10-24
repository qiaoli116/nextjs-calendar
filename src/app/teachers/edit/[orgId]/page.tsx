'use client'
import * as React from 'react';
import { TeacherUpdateComponent } from '../../../../components/Sections/Teacher';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ITeacher } from '../../../../types';
import Box from '@mui/material/Box';
import CRUDLinksComponent from '../../../../components/Controls/CRUDLinks';



export default function TeachersUpdatePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    const onTeacherUpdateSuccess = (teacher: ITeacher) => {
        console.log("onTeacherCreateSuccess - ", "teacher", teacher);
    }
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.orgId} (edit)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>Edit teacher</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/teachers"
                    resourceId={params.orgId}
                    createLink={false}
                    updateLink={false}
                    hasText={false}
                />
            </Box>
            <TeacherUpdateComponent
                orgId={params.orgId}
                onUpdateSuccess={onTeacherUpdateSuccess}
            />

        </>

    );
}
