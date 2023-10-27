'use client'
import * as React from 'react';
import { RoomCreateComponent } from '../../../components/Sections/Room';
import { IRoom } from '../../../types';
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


export default function RoomsCreatePage({ params }: { params: { orgId: string } }) {
    const router = useRouter();
    const onRoomCreateSuccess = (room: IRoom) => {
        console.log("onRoomCreateSuccess - ", "room", room);
        router.push(`/rooms/view/${room.roomNumber}`);
    }
    console.log("params", params);
    return (
        <>

            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/rooms">
                    Rooms
                </Link>
                <Typography color="text.primary">Create</Typography>
            </Breadcrumbs>
            <h2>Create a Room</h2>
            <RoomCreateComponent
                onCreateSuccess={onRoomCreateSuccess}
            />

        </>

    );
}
