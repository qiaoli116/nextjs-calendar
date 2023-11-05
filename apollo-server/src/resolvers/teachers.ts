import {
    dbClient,
    dbCollections,
    readAllDocuments,
    readOneDocumentById,
    readOneDocumentByIndex,
    deleteOneDocumentByIndex,
    insertOneDocument,
    udpateOneDocument
} from '../db.js'
import { ITeacher } from './types.js'
const collectionName = dbCollections.teachers.name;

async function readAllTeachers(): Promise<ITeacher[] | null> {
    return await readAllDocuments<ITeacher>(collectionName);
}

async function readTeacherByOrgId(orgId: string): Promise<ITeacher | null> {
    return await readOneDocumentByIndex<ITeacher>(collectionName, { orgId: orgId });
}

async function createTeacher(teacher: ITeacher): Promise<ITeacher | null> {
    return await insertOneDocument<ITeacher>(collectionName, teacher);
}

async function updateTeacher(orgId: string, updates: {}): Promise<ITeacher | null> {
    const updateObj = { "$set": updates }
    return await udpateOneDocument<ITeacher>(collectionName, { orgId: orgId }, updateObj);
}

async function deleteTeacherByOrgId(orgId: string): Promise<boolean> {
    return await deleteOneDocumentByIndex(collectionName, { orgId: orgId });
}
const TeachersQuery = {
    Query: {
        teachers: async () => { return await readAllTeachers() },
        teacher: async (parent, args, context, info) => {
            const { orgId } = args;
            return await readTeacherByOrgId(orgId);
        }
    },
    Mutation: {
        teacherCreate: async (parent, args, context, info) => {
            console.log("addTeacher", args);
            const teacher: ITeacher = {
                orgId: args.orgId,
                userName: args.userName,
                email: args.email,
                name: {
                    first: args.name.first,
                    last: args.name.last
                }
            };
            return await createTeacher(teacher);
        },
        teacherUpdate: async (parent, args, context, info) => {
            console.log("updateTeacher", args);
            const { orgId } = args;
            const updates: any = {
                userName: args.userName,
                email: args.email,
                name: {
                    first: args.name.first,
                    last: args.name.last
                }
            };
            return await updateTeacher(orgId, updates);
        },
        teacherDelete: async (parent, args, context, info) => {
            console.log("deleteTeacher", args);
            const { orgId } = args;
            return await deleteTeacherByOrgId(orgId);
        }
    },
    Children: {

    }
}

const TeachersCRUD = {
    readAllTeachers,
    readTeacherByOrgId,
    createTeacher,
    updateTeacher,
    deleteTeacherByOrgId
}
export { TeachersQuery, TeachersCRUD };
