import { SubjectUpdateComponent } from "../../../../../../../../components/Sections/Subject"

export default function SubjectUpdatePage({ params }: { params: { term: string, department: string, subjectRef: string } }) {
    return (
        <>
            <h1>Update a subject</h1>
            <p>{params.department.toUpperCase()} / {params.term} / {params.subjectRef}</p>
            <SubjectUpdateComponent
                reference={params.subjectRef}
            />
        </>
    )
}