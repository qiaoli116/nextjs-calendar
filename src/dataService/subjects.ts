import Subjects from "../jsonDb/subjects"
import { sleep } from "./utils";

type TDeliveryMode = "" | "Online" | "Blended";

export interface ISubject {
    reference: string;
    code: string
    title: string;
    term: string;
    department: string;
    block: string;
    qualification: {
        code: string;
        title: string;
    };
    deliveryMode: TDeliveryMode;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    units: {
        crn: string;
        code: string;
        title: string;
    }[];
    sessions: {
        date: string;
        sessionReference: string;
    }[];
}

const getAllSubjects = async (): Promise<ISubject[]> => {
    await sleep(1e3);
    const subjects: ISubject[] = Subjects;
    const subjectsJSON = JSON.stringify(subjects);
    return JSON.parse(subjectsJSON);
}

const getOneSubjectByReference = async (reference: string): Promise<ISubject | undefined> => {
    await sleep(1e3);
    const subject: ISubject | undefined = Subjects.find((subject: ISubject) => subject.reference.toLowerCase() === reference.toLowerCase());
    const subjectJSON = JSON.stringify(subject);
    return JSON.parse(subjectJSON);
}

export default {
    getAllSubjects,
    getOneSubjectByReference
}