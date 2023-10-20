'use client'
import * as React from 'react';
import { TeacherCreateComponent } from '../../../components/Sections/Teacher';
import { ITeacher } from '../../../types';
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


export default function TeachersCreatePage({ params }: { params: { orgId: string } }) {
    const router = useRouter();
    const onTeacherCreateSuccess = (teacher: ITeacher) => {
        console.log("onTeacherCreateSuccess - ", "teacher", teacher);
        router.push(`/teachers/view/${teacher.orgId}`);
    }
    console.log("params", params);
    return (
        <>

            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">Create</Typography>
            </Breadcrumbs>
            <h2>Create a teacher</h2>
            <TeacherCreateComponent
                onCreateSuccess={onTeacherCreateSuccess}
            />

        </>

    );
}
