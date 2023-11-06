'use client'
import * as React from 'react';
import { SubjectCreateComponent } from '@/components/Sections/Subject';
import { IRoom } from '@/types';
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


export default function RoomsCreatePage() {
    const router = useRouter();
    // const onRoomCreateSuccess = (room: IRoom) => {
    //     console.log("onRoomCreateSuccess - ", "room", room);
    //     router.push(`/rooms/view/${room.roomNumber}`);
    // }
    return (
        <>

            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/subjects">
                    Subjects
                </Link>
                <Typography color="text.primary">Create</Typography>
            </Breadcrumbs>
            <h2>Create a Subject</h2>
            <SubjectCreateComponent />

        </>

    );
}
