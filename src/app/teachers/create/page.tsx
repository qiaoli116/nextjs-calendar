'use client'
import * as React from 'react';
import { TeacherCreateComponent } from '../../../components/Sections/Teacher';
import Link from 'next/link';
import { ITeacher } from '../../../types';
import { useRouter } from 'next/navigation'



export default function SubjectSinglePage({ params }: { params: { orgId: string } }) {
    const router = useRouter();
    const onTeacherCreateSuccess = (teacher: ITeacher) => {
        console.log("onTeacherCreateSuccess - ", "teacher", teacher);
        router.push(`/teachers/view/${teacher.orgId}`);
    }
    console.log("params", params);
    return (
        <>
            <h1>View teacher</h1>
            <Link href="/teachers">Teachers</Link>
            <TeacherCreateComponent
                onCreateSuccess={onTeacherCreateSuccess}
            />

        </>

    );
}
