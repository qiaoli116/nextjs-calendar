"use client"
import Link from '@mui/material/Link';
import { TeacherViewAllComponent } from '../../components/Sections/Teacher';
import Box from '@mui/material/Box';

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