'use client'
import * as React from 'react';
import { TeacherUpdateComponent } from '../../../../components/Sections/Teacher';
import Link from 'next/link';
import { ITeacher } from '../../../../types';



export default function TeachersUpdatePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    const onTeacherUpdateSuccess = (teacher: ITeacher) => {
        console.log("onTeacherCreateSuccess - ", "teacher", teacher);
    }
    return (
        <>
            <TeacherUpdateComponent
                orgId={params.orgId}
                onUpdateSuccess={onTeacherUpdateSuccess}
            />
            <Link href="/teachers">Teachers</Link>
        </>

    );
}
