'use client'
import * as React from 'react';
import { RoomUpdateComponent } from '../../../../components/Sections/Room';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { IRoom } from '../../../../types';
import Box from '@mui/material/Box';
import CRUDLinksComponent from '../../../../components/Controls/CRUDLinks';



export default function RoomUpdatePage({ params }: { params: { roomNumber: string } }) {
    console.log("params", params);
    const onRoomUpdateSuccess = (room: IRoom) => {
        console.log("onRoomCreateSuccess - ", "room", room);
    }
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/rooms">
                    Rooms
                </Link>
                <Typography color="text.primary">{params.roomNumber} (edit)</Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <h2>Edit room</h2>
                <Box sx={{ px: "5px" }}></Box>
                <CRUDLinksComponent
                    baseURL="/rooms"
                    resourceId={params.roomNumber}
                    createLink={false}
                    updateLink={false}
                    hasText={false}
                />
            </Box>
            <RoomUpdateComponent
                roomNumber={params.roomNumber}
                onUpdateSuccess={onRoomUpdateSuccess}
            />

        </>

    );
}
