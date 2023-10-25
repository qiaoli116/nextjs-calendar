export interface ITeacher {
    orgId: string;
    userName: string;
    email: string;
    name: {
        first: string;
        last: string;
    };
}


export type TRoomType = "CAIT" | "General PC";
export interface IRoom {
    roomNumber: string;
    type: TRoomType;
}

export type MutationStatus = "idle" | "loading" | "success" | "error";