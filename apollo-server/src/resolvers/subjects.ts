import { dbClient, dbCollections, insertOneDocument, readAllDocuments } from '../db.js'
import { IQualification, ISubject, ITASIndex, IUnit } from './types.js';
import { SessionsCRUD } from './sessions.js';
const collectionName = dbCollections.subjects.name;

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

async function createSubject(
    code: string,
    title: string,
    term: string,
    department: string,
    block: string,
    qualification: IQualification,
    tasIndex: ITASIndex,
    units: [IUnit]): Promise<ISubject | null> {

    const subjectInit: ISubject = {
        tasIndex: {
            year: tasIndex.year,
            department: tasIndex.department,
            qualificationCode: tasIndex.qualificationCode,
        },
        code: code,
        title: title,
        term: term,
        department: department,
        block: block,
        qualification: {
            code: qualification.code,
            title: qualification.title,
        },
        deliveryMode: "",
        dateRange: {
            startDate: "",
            endDate: "",
        },
        units: units.map((unit) => {
            return {
                code: unit.code,
                title: unit.title,
                crn: "",
            }
        }),
        sessions: [],
    };
    return insertOneDocument<ISubject>(collectionName, subjectInit);
}
const SubjectsQuery = {
    Query: {
        subjects: async () => { return await readAllSubjects() },
        subject: (parent, args, context, info) => {
            const { orgId } = args;
            return readSubjectByOrgId(orgId);
        }
    },
    Mutation: {
        subjectCreate: async (parent, args, context, info) => {
            console.log("subjectCreate", args);
            const { code, title, term, department, block, qualification, tasIndex, units } = args;
            const _qualification = {
                code: qualification.code,
                title: qualification.title,
            };
            const _tasIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                qualificationCode: tasIndex.qualificationCode,
            };
            const _units = units.map((unit) => {
                return {
                    code: unit.code,
                    title: unit.title,
                }
            });
            return await createSubject(code, title, term, department, block, _qualification, _tasIndex, _units);
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
