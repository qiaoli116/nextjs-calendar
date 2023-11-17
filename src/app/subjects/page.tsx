"use client"
import { SubjectViewAllComponent } from '../../components/Sections/Subject';
import React from 'react';


export default function SubjectsUpdate() {
    return (
        <>
            <h2>View all Subjects</h2>
            <SubjectViewAllComponent
                singleSubjectPath="/subjects"
            />
        </>
    )
}