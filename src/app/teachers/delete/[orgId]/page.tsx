'use client'
import * as React from 'react';
import { TeacherDeleteComponent } from '../../../../components/Sections/Teacher';
import Link from 'next/link';
import { ITeacher } from '../../../../types';



export default function TeachersDeletePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <TeacherDeleteComponent
                orgId={params.orgId}
            />
            <Link href="/teachers">Teachers</Link>
        </>

    );
}
