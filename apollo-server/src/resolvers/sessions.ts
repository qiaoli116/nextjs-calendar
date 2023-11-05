import { dbClient, dbCollections, readAllDocuments } from '../db.js'
import { ISession } from './types.js'
import { TeachersCRUD } from './teachers.js';
import { SubjectsCRUD } from './subjects.js';
import { RoomsCRUD } from './rooms.js';
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
        sessions: async () => {
            return await readAllSessions()
        },
        session: async (parent, args, context, info) => {
            const { reference } = args;
            return await readSessionByReference(reference);
        }
    },
    Children: {
        Session: {
            teacher: async (parent, args, context, info) => {
                console.log("Session teacher", parent);
                const { teacher } = parent;
                return await TeachersCRUD.readTeacherByOrgId(teacher);
            },
            room: async (parent, args, context, info) => {
                console.log("Session room", parent);
                const { room } = parent;
                return await RoomsCRUD.readRoomByRoomNumber(room);
            },
            subjects: async (parent, args, context, info) => {
                console.log("Session subject", parent);
                const { subject } = parent;
                return await SubjectsCRUD.readSubjectByOrgId(subject);
            }
        }
    }

}
const SessionsCRUD = {
    readAllSessions,
    readSessionByReference
}
export { SessionsQuery, SessionsCRUD };
