"use client"
import { SubjectViewAllComponent } from '../../components/Sections/Subject';
import React from 'react';


export default function SubjectsViewAll() {
    return (
        <>
            <h2>View all Subjects</h2>
            <SubjectViewAllComponent
                singleSubjectPath="/subjects"
            />
        </>
    )
}