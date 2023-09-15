
import React from 'react';
import { ISubject } from '../../dataService/subjects';
import { v4 as uuidv4 } from 'uuid';

const generateSubjectReference = () => {
    return "Subject#" + uuidv4();
}

const generateInitialSubject = (): ISubject => {
    return {
        reference: generateSubjectReference(),
        code: "",
        title: "",
        term: "",
        department: "",
        block: "",
        qualification: {
            code: "",
            title: "",
        },
        deliveryMode: "",
        dateRange: {
            startDate: "",
            endDate: "",
        },
        units: [],
        sessions: [],
    }
}

const SubjectCreateOrUpdateComponent = ({ reference, create = false }:
    { reference?: string, create?: boolean }) => {
    const [subject, setSubject] = React.useState<ISubject>(generateInitialSubject());
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setSubject({
            ...subject,
            [name]: value
        });
    };
    const resetForm = () => {
        console.log("resetForm called");
        setSubject(generateInitialSubject());
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subject);
        console.log("handleSubmit", JSON.stringify(subject, null, 2));

    };
    return (
        <>
            <form onSubmit={handleSubmit}>

            </form>
        </>
    )
}