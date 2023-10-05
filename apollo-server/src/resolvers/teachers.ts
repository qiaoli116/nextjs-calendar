import { dbClient, dbCollections, readAllDocuments, readOneDocumentById, readOneDocumentByIndex } from '../db.js'
import { ITeacher } from './types.js'
const collectionName = dbCollections.teachers.name;

async function readAllTeachers(): Promise<ITeacher[] | null> {
    return await readAllDocuments<ITeacher>(collectionName);
}

async function readTeacherByOrgId(orgId: string): Promise<ITeacher | null> {
    return await readOneDocumentByIndex<ITeacher>(collectionName, { orgId: orgId });
}

async function createTeacher(teacher: ITeacher): Promise<ITeacher | null> {
    let teacherCreated = null;
    console.log("createTeacher", teacher);
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb');
        const collection = db.collection('teachers');

        const result = await collection.insertOne(teacher);
        console.log('Inserted result:', result);
        if (result.acknowledged) {
            teacherCreated = await readOneDocumentById<ITeacher>("teachers", result.insertedId.toString() as string);
            console.log('Inserted teacher:', teacherCreated);
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return teacherCreated;
}

const TeachersQuery = {
    Query: {
        teachers: async () => { return await readAllTeachers() },
        teacher: (parent, args, context, info) => {
            const { orgId } = args;
            return readTeacherByOrgId(orgId);
        }
    },
    Mutation: {
        teacherCreate: (parent, args, context, info) => {
            console.log("addTeacher", args);
            const teacher: ITeacher = {
                orgId: args.orgId,
                userName: args.userName,
                email: args.email,
                name: {
                    first: args.firstName,
                    last: args.lastName
                }
            };
            return createTeacher(teacher);
        }
    },
    Children: {

    }

}
const TeachersCRUD = {
    readAllTeachers,
    readTeacherByOrgId
}
export { TeachersQuery, TeachersCRUD };
