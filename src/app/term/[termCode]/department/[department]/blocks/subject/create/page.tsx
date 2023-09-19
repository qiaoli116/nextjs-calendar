import { SessionCreateOrUpdateComponent, SessionViewOneComponent } from "../../../../../../../../components/Sections/Session";
import { SubjectCreateOrUpdateComponent } from "../../../../../../../../components/Sections/Subject";

export default function SubjectCreatePage({ params }: { params: { termCode: string, department: string } }) {
    return (
        <>
            <h1>Blocks Page</h1>
            <p>Term Code: {params.termCode}</p>
            <p>Department: {params.department}</p>
            <SubjectCreateOrUpdateComponent />
        </>
    )
}