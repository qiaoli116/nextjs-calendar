"use client"
import { TeacherViewAllComponent } from '../../components/Sections/Teacher';
import React from 'react';


export default function TeachersViewAll() {
    return (
        <>
            <h2>View all teachers</h2>
            <TeacherViewAllComponent
                singleTeacherPath="/teachers"
            />
        </>
    )
}