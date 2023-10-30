import {
    dbClient,
    dbCollections,
    readAllDocuments,
    insertOneDocument,
    udpateOneDocument,
} from '../db.js'

import { ITAS, ITASIndex, ITASSubject } from './types.js'
const collectionName = dbCollections.tas.name;
async function readAllTAS(): Promise<ITAS[] | null> {
    return await readAllDocuments<ITAS>(collectionName);
}
async function readTAS(year: string, department: string, qualificationCode: string): Promise<ITAS | null> {
    let tas = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('tas'); // Replace with your collection name
        const query = { "year": year, "department": department, "qualification.code": qualificationCode };
        console.log('Query:', query);
        const docs = await collection.find(query).collation({ locale: 'en', strength: 2 }).toArray();
        console.log('Found documents:', docs);
        if (docs.length > 0) {
            tas = docs[0];
        }
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await dbClient.close();
        console.log('Closed MongoDB connection');
    }
    return tas;
}

async function readTASSubject(
    year: string, department: string, qualificationCode: string, subjectCode: string
): Promise<ITAS | null> {
    const tas: ITAS = await readTAS(year, department, qualificationCode);
    if (!tas) {
        return null;
    }
    const subject = tas.subjects.find((subject: ITASSubject) =>
        subject.code.toLowerCase() === subjectCode.toLowerCase());
    if (!subject) {
        return null;
    }
    tas.subjects = [subject];
    return tas;
}

async function createTAS(tas: ITAS): Promise<ITAS | null> {
    // new TAS has no subjects, they are added later.
    // the subjects included in the parameter are ignored.
    const tasInit = {
        year: tas.year,
        department: tas.department,
        qualification: tas.qualification,
        subjects: [],
    }
    return insertOneDocument<ITAS>(collectionName, tasInit);
}

async function addTASSubject(
    tasIndex: ITASIndex, subject: ITASSubject
): Promise<ITAS | null> {
    return udpateOneDocument<ITAS>(collectionName, tasIndex, subject, "$push");
}

const TASQuery = {
    Query: {
        tases: async () => { return await readAllTAS() },
        tas: (parent, args, context, info) => {
            const { year, department, qualificationCode } = args;
            return readTAS(year, department, qualificationCode);
        },
        tasSubject: (parent, args, context, info) => {
            const { year, department, qualificationCode, subjectCode } = args;
            return readTASSubject(year, department, qualificationCode, subjectCode);
        }
    },
    Mutation: {
        tasCreate: (parent, args, context, info) => {
            console.log("addTAS", args);
            const tas: ITAS = {
                year: args.year,
                department: args.department,
                qualification: args.qualificationInput,
                subjects: [],
            };
            return createTAS(tas);
        },
        tasAddSubject: (parent, args, context, info) => {
            console.log("addTASSubject", args);
            const { tasIndex, subject } = args;
            const _tasIndex: ITASIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                qualificationCode: tasIndex.qualificationCode,
            }
            const _subject: ITASSubject = {
                code: subject.code,
                title: subject.title,
                units: subject.units,
            }
            return addTASSubject(_tasIndex, _subject);
        }
    },
    Children: {

    }

}
const TASCRUD = {
    readAllTAS,
    readTAS,
    createTAS,
    addTASSubject
}
export { TASQuery, TASCRUD };
