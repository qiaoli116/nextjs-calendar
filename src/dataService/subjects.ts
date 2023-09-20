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

const getAllSessions = async (): Promise<ISubject[]> => {
    await sleep(1e3); // For demo purposes.
    return Subjects;
}

const getOneSessionByReference = async (reference: string): Promise<ISubject | undefined> => {
    await sleep(1e3); // For demo purposes.
    return Subjects.find((subject) => subject.reference === reference);
}

export default {
    getAllSessions,
    getOneSessionByReference
}