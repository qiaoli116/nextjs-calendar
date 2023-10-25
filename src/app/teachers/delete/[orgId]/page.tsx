'use client'
import * as React from 'react';
import { TeacherDeleteComponent } from '../../../../components/Sections/Teacher';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ITeacher } from '../../../../types';
import Box from '@mui/material/Box';
import CRUDLinksComponent from '../../../../components/Controls/CRUDLinks';


export default function TeachersDeletePage({ params }: { params: { orgId: string } }) {
    console.log("params", params);
    // if deleted, the CRUD links will be hidden
    const [deleted, setDeleted] = React.useState(false);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/teachers">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.orgId} (delete)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>Delete teacher</h2>
                {!deleted && <>
                    <Box sx={{ px: "5px" }}></Box>
                    <CRUDLinksComponent
                        baseURL="/teachers"
                        resourceId={params.orgId}
                        createLink={false}
                        deleteLink={false}
                        hasText={false}
                    />
                </>

                }
            </Box>
            <TeacherDeleteComponent
                orgId={params.orgId}
                onDeleteSuccess={(_deleted: boolean) => setDeleted(_deleted)}
            />
        </>

    );
}
