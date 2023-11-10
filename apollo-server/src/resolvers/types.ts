export interface ITeacher {
    orgId: string;
    userName: string;
    email: string;
    name: {
        first: string;
        last: string;
    };
}

export interface IRoom {
    roomNumber: string;
    type: string;
}

export interface IUnit {
    code: string;
    title: string;
}

export interface ITASUnit extends IUnit {
    // code: string;
    // title: string;
}

export interface ISubjectUnit extends IUnit {
    // code: string;
    // title: string;
    crn: string;
}

export interface ITASSubject {
    code: string;
    title: string;
    units: ITASUnit[];
}

export interface IQualification {
    code: string;
    title: string;
}

export interface ITASQualification extends IQualification {
    // code: string;
    // title: string;
}
export interface ITASIndex {
    year: string;
    department: string;
    qualificationCode: string;

}
export interface ITASDBIndex {
    year: string;
    department: string;
    "qualification.code": string;
}
export interface ITAS {
    year: string;
    department: string;
    qualification: ITASQualification;
    subjects: ITASSubject[];
}

type TDeliveryMode = "" | "Online" | "Blended";
export interface IDateRange {
    startDate: string;
    endDate: string;
}
export interface ISubjectIndex {
    term: string;
    department: string;
    block: string;
    code: string;
}

export interface ISubjectFilter {

}

export interface ISubject {
    tasIndex: ITASIndex
    code: string
    title: string;
    term: string;
    department: string;
    block: string;
    qualification: ITASQualification;
    deliveryMode: TDeliveryMode;
    dateRange: IDateRange;
    units: ISubjectUnit[];
    sessions: string[];
}
export interface ISession {
    sessionId: string;
    date: string;
    teacher: string;
    room: string;
    timeslots: string[];
    subjects: ISubjectIndex[];
}

export const refPrefix = {
    subject: "SUBJECT.",
    session: "SESSION."
}

export default {

}