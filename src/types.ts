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

export type MutationStatus = "idle" | "loading" | "success" | "error";