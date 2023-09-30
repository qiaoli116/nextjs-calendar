"use client"
import Link from 'next/link';
import { TeacherViewAllComponent } from '../../components/Sections/Teacher';

export default function TeacherViewAll() {
    return (
        <>
            <TeacherViewAllComponent
                singleTeacherPath="/teachers/view"
            />

        </>
    )
}