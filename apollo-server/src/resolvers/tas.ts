import {
    dbClient,
    dbCollections,
    readAllDocuments,
    insertOneDocument,
    udpateOneDocument,
    deleteOneDocumentByIndex
} from '../db.js'

import { ITAS, ITASIndex, ITASSubject, ITASUnit } from './types.js'
const collectionName = dbCollections.tas.name;
async function readAllTAS(): Promise<ITAS[] | null> {
    return await readAllDocuments<ITAS>(collectionName);
}
async function readTAS(tasIndex: ITASIndex): Promise<ITAS | null> {
    let tas = null;
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');

        const db = dbClient.db('appdb'); // Replace with your database name
        const collection = db.collection('tas'); // Replace with your collection name
        console.log('tasIndex:', tasIndex);
        const docs = await collection.find(tasIndex).collation({ locale: 'en', strength: 2 }).toArray();
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
    tasIndex: ITASIndex, subjectCode: string
): Promise<ITAS | null> {
    const tas: ITAS = await readTAS(tasIndex);
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

async function addTASSubjects(tasIndex: ITASIndex, subjects: ITASSubject[]): Promise<ITAS | null> {
    const updateObj = {
        "$push": { subjects: { "$each": subjects } }
    }

    return udpateOneDocument<ITAS>(collectionName, tasIndex, updateObj);
}

async function deleteTASSubjects(tasIndex: ITASIndex, subjectCodes: string[]): Promise<ITAS | null> {
    const updateObj = {
        "$pull": {
            "subjects": {
                "code": {
                    "$in": subjectCodes
                }
            }
        }
    }
    return udpateOneDocument<ITAS>(collectionName, tasIndex, updateObj);
}

async function deleteTAS(tasIndex: ITASIndex): Promise<boolean> {
    return await deleteOneDocumentByIndex(collectionName, tasIndex);
}

const TASQuery = {
    Query: {
        tases: async () => { return await readAllTAS() },
        tas: async (parent, args, context, info) => {
            const { tasIndex, subjects } = args;
            const _tasIndex: ITASIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                "qualification.code": tasIndex.qualificationCode,
            }

            return await readTAS(_tasIndex);
        },
        tasSubject: async (parent, args, context, info) => {
            const { tasIndex, subjectCode } = args;
            const _tasIndex: ITASIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                "qualification.code": tasIndex.qualificationCode,
            }
            return await readTASSubject(_tasIndex, subjectCode);
        }
    },
    Mutation: {
        tasCreate: async (parent, args, context, info) => {
            console.log("addTAS", args);
            const tas: ITAS = {
                year: args.year,
                department: args.department,
                qualification: {
                    code: args.qualification.code,
                    title: args.qualification.title
                },
                subjects: [],
            };
            return await createTAS(tas);
        },
        tasAddSubjects: async (parent, args, context, info) => {
            console.log("addTASSubject", args);
            const { tasIndex, subjects } = args;
            const _tasIndex: ITASIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                "qualification.code": tasIndex.qualificationCode,
            }

            const _subjects: ITASSubject[] = subjects.map((subject: any) => {
                const _units: ITASUnit[] = subject.units.map((unit: any) => {
                    return {
                        code: unit.code,
                        title: unit.title,
                    }
                })
                return {
                    code: subject.code,
                    title: subject.title,
                    units: subject.units,
                }
            })
            return await addTASSubjects(_tasIndex, _subjects);
        },
        tasDeleteSubjects: async (parent, args, context, info) => {
            console.log("deleteTASSubject", args);
            const { tasIndex, subjectCodes } = args;
            const _tasIndex: ITASIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                "qualification.code": tasIndex.qualificationCode,
            }
            const _subjectCodes: string[] = subjectCodes.map((subjectCode: any) => {
                return subjectCode
            })
            return await deleteTASSubjects(_tasIndex, _subjectCodes);
        },
        tasDelete: async (parent, args, context, info) => {
            console.log("deleteTAS", args);
            const { tasIndex } = args;
            const _tasIndex: ITASIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                "qualification.code": tasIndex.qualificationCode,
            }
            return await deleteTAS(_tasIndex);
        }
    },
    Children: {

    }

}
const TASCRUD = {
    readAllTAS,
    readTAS,
    createTAS,
    addTASSubjects
}
export { TASQuery, TASCRUD };
