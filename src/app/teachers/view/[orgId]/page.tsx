'use client'
import * as React from 'react';
import { TeacherViewAllComponent } from '../../../../components/Sections/Teacher';




export default function SubjectSinglePage({ params }: { params: { termCode: string, department: string, teacher: string } }) {
    console.log("params", params);
    return (
        <>
            <TeacherViewAllComponent />
        </>

    );
}
