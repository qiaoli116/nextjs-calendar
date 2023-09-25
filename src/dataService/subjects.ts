import Subjects from "../jsonDb/subjects"
import { sleep } from "./utils";
import SessionsDateService, { ISession } from "./sessions";
import TeachersDataServie, { ITeacher } from "./teachers";
import Teachers from "../jsonDb/teachers";

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
    sessions: string[];
}

export interface ISessionFull extends Omit<ISession, "teacher"> {
    teacher: {
        orgId: string;
        firstName: string;
        lastName: string;
    } | null;
}

export interface ISubjectFull extends Omit<ISubject, "sessions"> {
    sessions: ISessionFull[];
}

const getAllSubjects = async (): Promise<ISubject[]> => {
    await sleep(1e3);
    const subjects: ISubject[] = Subjects;
    const subjectsJSON = JSON.stringify(subjects);
    const _subjects: ISubject[] = JSON.parse(subjectsJSON);
    return _subjects;
}

const getOneSubjectFullByReference = async (reference: string): Promise<ISubjectFull | undefined> => {

    const subject: ISubject | undefined = await getOneSubjectByReference(reference);
    if (subject === undefined) {
        return undefined;
    }
    const subjectFull: ISubjectFull = {
        ...subject,
        sessions: []
    }
    for (let i = 0; i < subject.sessions.length; i++) {
        let session: ISession | undefined = Subjects.find((subject: ISubject) => subject.reference.toLowerCase() === reference.toLowerCase());
        let sessionFull: ISessionFull;
        if (session === undefined) {
            sessionFull = {
                reference: subject.sessions[i],
                date: "",
                teacher: null,
                room: null,
                timeslots: [],
                subjects: []
            }
        } else {
            if (session.teacher !== null) {
                let teacher: ITeacher | undefined = await TeachersDataServie.getOneTeacherByOrgId(session.teacher);
                if (teacher !== undefined) {
                    sessionFull = {
                        ...session,
                        teacher: {
                            orgId: teacher.orgId,
                            firstName: teacher.name.first,
                            lastName: teacher.name.last
                        }
                    }
                } else {
                    sessionFull = {
                        ...session,
                        teacher: {
                            orgId: session.teacher,
                            firstName: "",
                            lastName: ""
                        }
                    }
                }
            } else {
                sessionFull = {
                    ...session,
                    teacher: null
                }
            }
        }
        subjectFull.sessions[i] = sessionFull;
    }
    const subjectFullJSON = JSON.stringify(subjectFull);
    const _subjectFull: ISubjectFull = JSON.parse(subjectFullJSON);
    return _subjectFull;
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
    getOneSubjectByReference,
    getOneSubjectFullByReference
}