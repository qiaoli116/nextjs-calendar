export interface ITeacher {
    orgId: string;
    userName: string;
    email: string;
    name: {
        first: string;
        last: string;
    };
}


export const RoomTypes = ["Unknown", "CAIT", "General PC"] as const;
export type TRoomType = typeof RoomTypes[number];
export interface IRoom {
    roomNumber: string;
    type: TRoomType;
}

export interface IUnit {
    code: string;
    title: string;
}

export interface ITASUnit extends IUnit {
    // code: string;
    // title: string;
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

export interface ITASCreateInput {
    year: string;
    department: string;
    qualification: ITASQualification;
}

export interface ITASIndex {
    year: string;
    department: string;
    qualificationCode: string;
}

export interface ITAS {
    year: string;
    department: string;
    qualification: ITASQualification;
    subjects: ITASSubject[];
}

export interface ITASSubject {
    code: string;
    title: string;
    units: ITASUnit[];
}

export interface ISubjectUnit extends IUnit {
    // code: string;
    // title: string;
    crn: string;
}

export interface ISubjectIndex {
    term: string;
    department: string;
    block: string;
    code: string;
}
export interface ISubjectCreateInput {
    tasIndex: ITASIndex;
    code: string;
    title: string;
    term: string;
    department: string;
    block: string;
    qualification: IQualification;
    units: ITASUnit[];
}

export interface IDateRange {
    startDate: string;
    endDate: string;
}

export interface ISubject {
    tasIndex: ITASIndex;
    code: string;
    title: string;
    term: string;
    department: string;
    block: string;
    qualification: IQualification;
    deliveryMode: string;
    dateRange: {
        startDate: string;
        endDate: string;
    };
    units: ISubjectUnit[];
    sessions: string[];
}

export interface ISubjectExtended extends Omit<ISubject, "sessions"> {
    sessions: {
        sessionId: string;
        date: string;
        teacher: {
            orgId: string;
            email: string;
            name: {
                first: string;
                last: string;
            };
        };
        room: {
            roomNumber: string;
            type: string;
        };
        timeslots: string[];
    }[]
}

export interface ISession {
    sessionId: string;
    date: string;
    teacher: string;
    room: string;
    timeslots: string[];
    subjects: string[];
}
export interface ISessionExtended {
    sessionId: string;
    date: string;
    teacher: {
        orgId: string;
        email: string;
        name: {
            first: string;
            last: string;
        };
    };
    room: {
        roomNumber: string;
        type: string;
    };
    timeslots: string[];
    subjects: {
        term: string;
        department: string;
        block: string;
        code: string;
        title: string;
        qualification: IQualification;
        deliveryMode: string;
        tasIndex: {
            year: string;
            department: string;
            qualificationCode: string;
        };
        units: {
            code: string;
            title: string;
            crn: string;
        }[];
        dateRange: {
            startDate: string;
            endDate: string;
        };
        sessions: {
            sessionId: string;
            date: string;
            teacher: {
                orgId: string;
                email: string;
                name: {
                    first: string;
                    last: string;
                };
            };
            room: {
                roomNumber: string;
                type: string;
            };
            timeslots: string[];
        }[];
    }[];
}

export type MutationStatus = "idle" | "loading" | "success" | "error";