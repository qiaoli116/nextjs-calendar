"use client"
import { RoomViewAllComponent } from '../../components/Sections/Room';
import React from 'react';

export default function RoomsViewAll() {
    return (
        <>
            <h2>View all rooms</h2>
            <RoomViewAllComponent
                singleRoomPath="/rooms"
            />
        </>
    )
}