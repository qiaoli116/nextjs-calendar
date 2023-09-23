import { SubjectViewOneComponent } from "../../../../../../../../components/Sections/Subject"

export default function SubjectViewOnePage({ params }: { params: { term: string, department: string, subjectRef: string } }) {
    return (
        <>
            <h1>View a subject</h1>
            <p>{params.department.toUpperCase()} / {params.term} / {params.subjectRef}</p>
            <SubjectViewOneComponent
                reference={params.subjectRef}
            />
        </>
    )
}