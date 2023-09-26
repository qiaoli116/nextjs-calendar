import dbClient from '../db.js'
import { ITeacher } from './types.js'
async function readAllTeachers(): Promise<ITeacher[] | null> {
    let teachers = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('teachers'); // Replace with your collection name

        const docs = await collection.find({}).toArray();
        console.log('Found documents:', docs);
        teachers = docs;
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return teachers;
}
async function readTeacherByOrgId(orgId: string): Promise<ITeacher | null> {
    let teacher = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('teachers'); // Replace with your collection name

        const docs = await collection.find({ orgId: orgId }).toArray();
        console.log('Found documents:', docs);
        if (docs.length > 0) {
            teacher = docs[0];
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return teacher;
}
const TeachersQuery = {
    Teachers: async () => { return await readAllTeachers() },
    Teacher: (parent, args, context, info) => {
        const { orgId } = args;
        return readTeacherByOrgId(orgId);
    }
}
const TeachersCRUD = {
    readAllTeachers,
    readTeacherByOrgId
}
export { TeachersQuery, TeachersCRUD };
