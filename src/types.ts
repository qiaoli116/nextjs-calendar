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

export interface ITASQualification {
    code: string;
    title: string;
}

export interface ITASCreateInput {
    year: string;
    department: string;
    qualification: ITASQualification;
}

export interface ITAS {
    year: string;
    department: string;
    qualification: ITASQualification;
    subjects: ITASSubject[];
}

export type MutationStatus = "idle" | "loading" | "success" | "error";