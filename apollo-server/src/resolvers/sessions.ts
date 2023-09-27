import { dbClient, dbCollections, readAllDocuments } from '../db.js'
import { ISession } from './types.js'
import { TeachersCRUD } from './teachers.js';
import { SubjectsCRUD } from './subjects.js';
const collectionName = dbCollections.sessions.name;
async function readAllSessions(query: any = {}): Promise<ISession[] | null> {
    return await readAllDocuments<ISession>(collectionName, query);
}
async function readSessionByReference(reference: string): Promise<ISession | null> {
    let session = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('teachers'); // Replace with your collection name

        const docs = await collection.find({ reference: reference }).toArray();
        console.log('Found documents:', docs);
        if (docs.length > 0) {
            session = docs[0];
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return session;
}
const SessionsQuery = {
    Query: {
        sessions: async () => { return await readAllSessions() },
        session: (parent, args, context, info) => {
            const { reference } = args;
            return readSessionByReference(reference);
        }
    },
    Children: {
        Session: {
            teacher: (parent, args, context, info) => {
                console.log("Session teacher", parent);
                const { teacher: _teacher } = parent;
                return TeachersCRUD.readTeacherByOrgId(_teacher);
            },
            subjects: (parent, args, context, info) => {
                console.log("Session subject", parent);
                const { subject: _subject } = parent;
                return SubjectsCRUD.readSubjectByOrgId(_subject);
            }
        }
    }

}
const SessionsCRUD = {
    readAllSessions,
    readSessionByReference
}
export { SessionsQuery, SessionsCRUD };
