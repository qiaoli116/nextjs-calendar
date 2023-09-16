"use client"

import { FilterComponet } from "../../../../../../components/Calendar/calendar";
import { SessionCreateOrUpdateComponent, SessionViewOneComponent } from "../../../../../../components/Session/Session";
import { SubjectCreateOrUpdateComponent } from "../../../../../../components/Sections/Subject";

export default function BlocksPage({ params }: { params: { termCode: string, department: string } }) {
    return (
        <>
            <h1>Blocks Page</h1>
            <p>Term Code: {params.termCode}</p>
            <p>Department: {params.department}</p>
            <SubjectCreateOrUpdateComponent />
            <SessionViewOneComponent
                reference="Session#617553ca-92b2-4027-b536-9bf7ad71ec28"
            />
            <SessionCreateOrUpdateComponent
                reference="Session#617553ca-92b2-4027-b536-9bf7ad71ec28"
            />
        </>
    )
}