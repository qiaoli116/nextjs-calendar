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
    const _subjects: ISubject[] = JSON.parse(subjectsJSON);
    return _subjects;
}

const getOneSubjectByReference = async (reference: string): Promise<ISubject | undefined> => {
    await sleep(1e3);
    const subject: ISubject | undefined = Subjects.find((subject: ISubject) => subject.reference.toLowerCase() === reference.toLowerCase());
    if (subject === undefined) {
        return undefined;
    }

    const subjectJSON = JSON.stringify(subject);
    const _subject: ISubject = JSON.parse(subjectJSON);
    return _subject;
}

export default {
    getAllSubjects,
    getOneSubjectByReference
}