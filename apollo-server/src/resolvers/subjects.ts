import { dbClient, dbCollections, insertOneDocument, readAllDocuments, readOneDocumentByIndex } from '../db.js'
import { IQualification, ISession, ISubject, ISubjectIndex, ITASIndex, IUnit } from './types.js';
import { SessionsCRUD } from './sessions.js';
import sessions from '../dataSource/sessions.js';
const collectionName = dbCollections.subjects.name;

async function readAllSubjects(query: any = {}): Promise<ISubject[] | null> {
    return await readAllDocuments<ISubject>(collectionName, query);
}

async function readSubject(subjectIndex: ISubjectIndex): Promise<ISubject | null> {
    return await readOneDocumentByIndex<ISubject>(collectionName, subjectIndex);
}

// async function genSubjectFilterList(): Promise

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
        subjects: async (parent, args, context, info) => {
            const { term, department, block, code } = args;
            console.log("subjects args", args);
            console.log("term", term, "department", department, "block", block, "code", code);
            const filter = {}
            if (term !== undefined && term !== null && term !== "") {
                filter["term"] = term;
            }
            if (department !== undefined && department !== null && department !== "") {
                filter["department"] = department;
            }
            if (block !== undefined && block !== null && block !== "") {
                filter["block"] = block;
            }
            if (code !== undefined && code !== null && code !== "") {
                filter["code"] = code;
            }
            console.log("subjects filter", filter);
            return await readAllSubjects(filter)
        },
        subject: async (parent, args, context, info) => {
            const { subjectIndex } = args;
            const _subjectIndex: ISubjectIndex = {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            }
            return await readSubject(_subjectIndex);
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
    readSubject,
    createSubject,
}
export { SubjectsQuery, SubjectsCRUD };
