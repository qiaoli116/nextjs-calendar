'use client'
import * as React from 'react';
import { TeacherViewOneComponent } from '../../../../components/Sections/Teacher';
import Link from 'next/link';



export default function TeachersViewOnePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <TeacherViewOneComponent
                orgId={params.orgId}
            />
            <Link href="/teachers">Teachers</Link>
        </>

    );
}
