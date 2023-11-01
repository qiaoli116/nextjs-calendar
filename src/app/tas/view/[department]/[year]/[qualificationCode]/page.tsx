'use client'
import * as React from 'react';
import { TASViewOneComponent } from '../../../../../../components/Sections/TAS';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import CRUDLinksComponent from '../../../../../../components/Controls/CRUDLinks';

export default function TASViewOnePage({ params }: { params: { department: string, year: string, qualificationCode: string } }) {
    console.log("params", params);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/tas">
                    TAS List
                </Link>
                <Typography color="text.primary">{`${params.department.toUpperCase()}_${params.year}_${params.qualificationCode.toUpperCase()}`} (view)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>View TAS</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/tas"
                    resourceId={`${params.department.toLowerCase()}/${params.year}/${params.qualificationCode.toLowerCase()}`}
                    createLink={false}
                    readLink={false}
                    hasText={false}
                />
            </Box>

            <TASViewOneComponent
                department={params.department}
                year={params.year}
                qualificationCode={params.qualificationCode}
            />


        </>

    );
}
