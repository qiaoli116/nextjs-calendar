"use client"
import Link from 'next/link';
import { TeacherViewAllComponent } from '../../components/Sections/Teacher';
import Box from '@mui/material/Box';

export default function TeachersViewAll() {
    return (
        <>
            <h1>View all teachers</h1>
            <Box
                sx={{ pb: "15px" }}
            >
                <Link href="/teachers/create">Create New Teacher</Link>
            </Box>
            <TeacherViewAllComponent
                singleTeacherPath="/teachers"
            />

        </>
    )
}