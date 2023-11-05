import { dbClient, dbCollections, insertOneDocument, readAllDocuments } from '../db.js'
import { IQualification, ISession, ISubject, ITASIndex, IUnit } from './types.js';
import { SessionsCRUD } from './sessions.js';
import sessions from '../dataSource/sessions.js';
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
        subjects: async () => {
            return await readAllSubjects()
        },
        subject: async (parent, args, context, info) => {
            const { orgId } = args;
            return await readSubjectByOrgId(orgId);
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
            sessions: async (parent, args, context, info) => {
                const { code, sessions } = parent;
                console.log("Subject.sessions _sessions", sessions, sessions.length);

                if (sessions === null || sessions === undefined || sessions.length === 0) {
                    console.log("Subject.sessions sessions is null or undefined or empty")
                    return [] as ISession[];
                }
                const query = {
                    "reference": {
                        "$in": sessions
                    }
                }
                console.log("Subject.sessions query", query);
                const sessionsQueryResult = await SessionsCRUD.readAllSessions(query);
                console.log("Subject.sessions sessionsQueryResult", code, sessions, sessionsQueryResult);
                return sessionsQueryResult === null ? [] : sessionsQueryResult;
            }
        }

    }

}
const SubjectsCRUD = {
    readAllSubjects,
    readSubjectByOrgId
}
export { SubjectsQuery, SubjectsCRUD };
