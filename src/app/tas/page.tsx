"use client"
import { TASViewAllComponent } from '../../components/Sections/TAS';
import React from 'react';


export default function TeachersViewAll() {
    return (
        <>
            <h2>View all TAS</h2>
            <TASViewAllComponent
                singleTASPath="/tas"
            />
        </>
    )
}