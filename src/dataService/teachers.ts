import Teachers from "../jsonDb/teachers"
import { sleep } from "./utils";

export interface ITeacher {
    orgId: string;
    userName: string;
    email: string;
    name: {
        first: string;
        last: string;
    };
}

const getAllTeachers = async (): Promise<ITeacher[]> => {
    await sleep(1e3); // For demo purposes.
    return Teachers;
}

const getOneTeacherByOrgId = async (orgId: string): Promise<ITeacher | undefined> => {
    return Teachers.find((teacher) => teacher.orgId === orgId);
}

export default {
    getAllTeachers,
    getOneTeacherByOrgId
}