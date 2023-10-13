export interface ITeacher {
    orgId: string;
    userName: string;
    email: string;
    name: {
        first: string;
        last: string;
    };
}

export type MutationStatus = "idle" | "loading" | "success" | "error";