import { SessionCreateOrUpdateComponent, SessionViewOneComponent } from "../../../../../../../components/Sections/Session";
import { SubjectCreateComponent } from "../../../../../../../components/Sections/Subject";

export default function SubjectCreatePage({ params }: { params: { term: string, department: string } }) {
    return (
        <>
            <h1>Create a subject</h1>
            <p>{params.department.toUpperCase()} / {params.term}</p>
            <SubjectCreateComponent
                term={params.term}
                department={params.department.toLowerCase()}
            />
        </>
    )
}