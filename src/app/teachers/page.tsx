"use client"
import Link from 'next/link';
import { TeacherViewAllComponent } from '../../components/Sections/Teacher';

export default function TeacherViewAll() {
    return (
        <>
            <h1>View all teachers</h1>
            <Link href="/teachers/create">Create</Link>
            <TeacherViewAllComponent
                singleTeacherPath="/teachers/view"
            />

        </>
    )
}