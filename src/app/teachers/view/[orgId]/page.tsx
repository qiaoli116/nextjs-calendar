'use client'
import * as React from 'react';
import { TeacherViewOneComponent } from '../../../../components/Sections/Teacher';
import Link from 'next/link';
import Box from '@mui/material/Box';

export default function TeachersViewOnePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    return (
        <>
            <TeacherViewOneComponent
                orgId={params.orgId}
            />
            <Box component="span" sx={{ mr: "10px" }} >
                <Link href="/teachers">Teachers</Link>
            </Box>
            <Box component="span" sx={{ mr: "10px" }} >
                <Link href={`/teachers/edit${params.orgId}`}>Teachers</Link>
            </Box>

        </>

    );
}
