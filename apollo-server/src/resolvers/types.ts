export interface ITeacher {
    orgId: string;
    name: {
        first: string;
        last: string;
    };
    subjects: string[];
}

export interface IRoom {
    roomNum: string;
    type: string;
}

export interface IUnit {
    code: string;
    title: string;
}

export interface ITASUnit extends IUnit {

}

export interface ISubjectUnit extends IUnit {
    crn: string;
}

export interface ITASSubject {
    code: string;
    title: string;
    units: ITASUnit[];
}

export interface ITASQualification {
    code: string;
    title: string;
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
export interface ISubject {
    reference: string;
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
    reference: string;
    date: string;
    teacher: string | null;
    room: string | null;
    timeslots: string[];
    subjects: string[];
}

export default {

}