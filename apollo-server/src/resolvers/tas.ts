import {
    dbClient,
    dbCollections,
    readAllDocuments,
    insertOneDocument,
    udpateOneDocument,
    deleteOneDocumentByIndex,
    readOneDocumentByIndex
} from '../db.js'

import { ITAS, ITASDBIndex, ITASSubject, ITASUnit } from './types.js'
const collectionName = dbCollections.tas.name;
async function readAllTAS(filter: any = {}): Promise<ITAS[] | null> {
    return await readAllDocuments<ITAS>(collectionName, filter);
}
async function readTAS(tasIndex: ITASDBIndex): Promise<ITAS | null> {
    return await readOneDocumentByIndex<ITAS>(collectionName, tasIndex);
}

async function readTASSubject(tasIndex: ITASDBIndex, subjectCode: string): Promise<ITAS | null> {
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

async function addTASSubjects(tasIndex: ITASDBIndex, subjects: ITASSubject[]): Promise<ITAS | null> {
    const updateObj = {
        "$push": { subjects: { "$each": subjects } }
    }

    return udpateOneDocument<ITAS>(collectionName, tasIndex, updateObj);
}

async function deleteTASSubjects(tasIndex: ITASDBIndex, subjectCodes: string[]): Promise<ITAS | null> {
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

async function deleteTAS(tasIndex: ITASDBIndex): Promise<boolean> {
    return await deleteOneDocumentByIndex(collectionName, tasIndex);
}

const TASQuery = {
    Query: {
        tases: async (parent, args, context, info) => {
            const { year, department, qualificationCode } = args;
            console.log("tases arg", args);
            console.log("year", year, "department", department, "qualificationCode", qualificationCode);
            const filter = {};
            if (year !== undefined && year !== null && year !== "") {
                filter["year"] = year;
            }
            if (department !== undefined && department !== null && department !== "") {
                filter["department"] = department;
            }
            if (qualificationCode !== undefined && qualificationCode !== null && qualificationCode !== "") {
                filter["qualification.code"] = qualificationCode;
            }
            console.log("filter", filter)
            return await readAllTAS(filter);
        },
        tas: async (parent, args, context, info) => {
            const { tasIndex, subjects } = args;
            const _tasIndex: ITASDBIndex = {
                year: tasIndex.year,
                department: tasIndex.department,
                "qualification.code": tasIndex.qualificationCode,
            }

            return await readTAS(_tasIndex);
        },
        tasSubject: async (parent, args, context, info) => {
            const { tasIndex, subjectCode } = args;
            const _tasIndex: ITASDBIndex = {
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
            const _tasIndex: ITASDBIndex = {
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
            const _tasIndex: ITASDBIndex = {
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
            const _tasIndex: ITASDBIndex = {
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
