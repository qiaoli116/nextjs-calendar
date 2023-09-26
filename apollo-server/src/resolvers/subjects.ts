import { dbClient, dbCollections, readAllDocuments } from '../db.js'
import { ISubject } from './types.js';
import { SessionsCRUD } from './sessions.js';
const collectionName = dbCollections.subjects;

async function readAllSubjects(query: any = {}): Promise<ISubject[] | null> {
    return await readAllDocuments<ISubject>(collectionName, query);
}

async function readSubjectByOrgId(reference: string): Promise<ISubject | null> {
    let subject = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('teachers'); // Replace with your collection name

        const docs = await collection.find({ reference: reference }).toArray();
        console.log('Found documents:', docs);
        if (docs.length > 0) {
            subject = docs[0];
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return subject;
}
const SubjectsQuery = {
    Query: {
        subjects: async () => { return await readAllSubjects() },
        subject: (parent, args, context, info) => {
            const { orgId } = args;
            return readSubjectByOrgId(orgId);
        }
    },
    Children: {
        Subject: {
            sessions: (parent, args, context, info) => {
                console.log("Subject.sessions", parent);
                const { sessions: _sessions } = parent;
                return SessionsCRUD.readAllSessions({ sessions: { $in: _sessions } });
            }
        }

    }

}
const SubjectsCRUD = {
    readAllSubjects,
    readSubjectByOrgId
}
export { SubjectsQuery, SubjectsCRUD };
