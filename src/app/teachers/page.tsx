"use client"
import Link from '@mui/material/Link';
import { TeacherViewAllComponent } from '../../components/Sections/Teacher';
import Box from '@mui/material/Box';

export default function TeachersViewAll() {
    return (
        <>
            <h2>View all teachers</h2>
            <Box
                sx={{ pb: "15px" }}
            >
                <Link underline="hover" href="/teachers/create">Create Teacher</Link>
            </Box>
            <TeacherViewAllComponent
                singleTeacherPath="/teachers"
            />


        </>
    )
}