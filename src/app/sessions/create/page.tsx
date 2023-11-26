'use client'
import * as React from 'react';

import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { SessionCreateComponent } from '@/components/Sections/Session';


export default function SessionsCreatePage() {
    const router = useRouter();
    // const onRoomCreateSuccess = (room: IRoom) => {
    //     console.log("onRoomCreateSuccess - ", "room", room);
    //     router.push(`/rooms/view/${room.roomNumber}`);
    // }
    return (
        <>

            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/sessions">
                    Sessions
                </Link>
                <Typography color="text.primary">Create</Typography>
            </Breadcrumbs>
            <h2>Create a Session</h2>
            <SessionCreateComponent />

        </>

    );
}
