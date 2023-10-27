'use client'
import * as React from 'react';
import { RoomDeleteComponent } from '../../../../components/Sections/Room';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { ITeacher } from '../../../../types';
import Box from '@mui/material/Box';
import CRUDLinksComponent from '../../../../components/Controls/CRUDLinks';


export default function RoomsDeletePage({ params }: { params: { roomNumber: string } }) {
    console.log("params", params);
    // if deleted, the CRUD links will be hidden
    const [deleted, setDeleted] = React.useState(false);
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/rooms">
                    Teachers
                </Link>
                <Typography color="text.primary">{params.roomNumber} (delete)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>Delete room</h2>
                {!deleted && <>
                    <Box sx={{ px: "5px" }}></Box>
                    <CRUDLinksComponent
                        baseURL="/rooms"
                        resourceId={params.roomNumber}
                        createLink={false}
                        deleteLink={false}
                        hasText={false}
                    />
                </>

                }
            </Box>
            <RoomDeleteComponent
                roomNumber={params.roomNumber}
                onDeleteSuccess={(_deleted: boolean) => setDeleted(_deleted)}
            />
        </>

    );
}
