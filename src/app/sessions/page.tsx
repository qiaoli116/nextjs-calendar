"use client"
import { SessionViewAllComponent } from '../../components/Sections/Session';
import React from 'react';


export default function SessionsViewAll() {
    return (
        <>
            <h2>View all Sessions</h2>
            <SessionViewAllComponent
                singleSessionPath='/sessions'
                singleTeacherPath='/teachers'
                singleRoomPath='/rooms'
            />
        </>
    )
}