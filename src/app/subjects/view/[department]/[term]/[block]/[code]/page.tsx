'use client'
import * as React from 'react';
import { SubjectViewOneComponent } from '@/components/Sections/Subject';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CRUDLinksComponent from '@/components/Controls/CRUDLinks';

export default function SubjectsViewOnePage({ params }: { params: { department: string, term: string, block: string, code: string } }) {
    console.log("params", params);
    const subjectIndex = {
        department: params.department,
        term: params.term,
        block: params.block,
        code: params.code
    }
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/subjects">
                    Subjects
                </Link>
                <Typography color="text.primary">{`${params.department.toUpperCase()}_${params.term}_${params.block.toUpperCase()}_${params.code.toUpperCase()}`} (view)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>View Subject</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/subjects"
                    resourceId={`${params.department.toLowerCase()}/${params.term}/${params.block.toLowerCase()}/${params.code.toLowerCase()}`}
                    createLink={false}
                    readLink={false}
                    hasText={false}
                />
            </Box>

            <SubjectViewOneComponent
                subjectIndex={subjectIndex}
                singleSessionPath="/sessions"
            />


        </>

    );
}
