'use client'
import * as React from 'react';
import { TeacherCreateComponent } from '../../../components/Sections/Teacher';
import Link from 'next/link';



export default function SubjectSinglePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <TeacherCreateComponent />
            <Link href="/teachers">Teachers</Link>
        </>

    );
}
