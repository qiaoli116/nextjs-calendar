'use client'
import * as React from 'react';




export default function SubjectSinglePage({ params }: { params: { termCode: string, department: string, teacher: string } }) {
    console.log("params", params);
    return (
        <>
            <div>hello teacher page</div>
        </>

    );
}
