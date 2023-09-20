import { SessionCreateOrUpdateComponent, SessionViewOneComponent } from "../../../../../../../components/Sections/Session";
import { SubjectCreateOrUpdateComponent } from "../../../../../../../components/Sections/Subject";

export default function SubjectCreatePage({ params }: { params: { term: string, department: string } }) {
    return (
        <>
            <h1>Create a subject</h1>
            <p>{params.department.toUpperCase()} / {params.term}</p>
            <SubjectCreateOrUpdateComponent
                create
                term={params.term}
                department={params.department.toLowerCase()}
            />
        </>
    )
}