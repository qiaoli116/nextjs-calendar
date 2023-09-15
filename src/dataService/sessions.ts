import Sessions from "../jsonDb/sessions"
import { sleep } from "./utils";

export interface ISession {
    reference: string;
    date: string;
    teacher: string | null;
    room: string | null;
    timeslots: string[];
    subjects: string[];
}

const getAllSessions = async (): Promise<ISession[]> => {
    await sleep(1e3); // For demo purposes.
    return Sessions;
}

const getOneSessionByReference = async (reference: string): Promise<ISession | undefined> => {
    await sleep(1e3); // For demo purposes.
    return Sessions.find((session) => session.reference === reference);
}

export default {
    getAllSessions,
    getOneSessionByReference
}