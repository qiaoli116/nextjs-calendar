'use client'
import * as React from 'react';
import { TeacherUpdateComponent } from '../../../../components/Sections/Teacher';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ITeacher } from '../../../../types';



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
                <Typography color="text.primary">{params.orgId}</Typography>
            </Breadcrumbs>
            <h2>Edit teacher</h2>
            <TeacherUpdateComponent
                orgId={params.orgId}
                onUpdateSuccess={onTeacherUpdateSuccess}
            />
        </>

    );
}
