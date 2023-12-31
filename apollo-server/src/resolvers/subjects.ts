import { dbClient, dbCollections, insertOneDocument, readAllDocuments, readOneDocumentByIndex, updateOneDocument } from '../db.js'
import { IQualification, ISession, ISubject, ISubjectIndex, ITASIndex, IUnit } from './types.js';
import { SessionsCRUD } from './sessions.js';
import sessions from '../dataSource/sessions.js';
const collectionName = dbCollections.subjects.name;

async function readAllSubjects(query: any = {}): Promise<ISubject[] | null> {
    return await readAllDocuments<ISubject>(collectionName, query);
}

async function readSubject(subjectIndex: ISubjectIndex): Promise<ISubject | null> {
    console.log("readSubject", subjectIndex)
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
async function updateSubjectDateRange(subjectIndex: ISubjectIndex, startDate: string, endDate: string): Promise<ISubject | null> {
    const updateObj = {
        "$set": {
            "dateRange.startDate": startDate,
            "dateRange.endDate": endDate,
        }
    }
    return await updateOneDocument<ISubject>(collectionName, subjectIndex, updateObj);
}

async function updateSubjectDeliveryMode(subjectIndex: ISubjectIndex, deliveryMode: string): Promise<ISubject | null> {
    const updateObj = {
        "$set": {
            "deliveryMode": deliveryMode,
        }
    }
    return await updateOneDocument<ISubject>(collectionName, subjectIndex, updateObj);
}

async function updateSubjectCRN(subjectIndex: ISubjectIndex, unitCode: string, crn: string): Promise<ISubject | null> {
    const updateObj = {
        "$set": {
            "units.$[unit].crn": crn,
        }
    }
    const options = {
        arrayFilters: [
            {
                "unit.code": unitCode,
            }
        ]
    }
    return await updateOneDocument<ISubject>(collectionName, subjectIndex, updateObj, options);
}

async function addSessionToSubject(subjectIndex: ISubjectIndex, sessionId: string): Promise<ISubject | null> {
    const updateObj = {
        "$addToSet": {
            "sessions": sessionId,
        }
    }
    return await updateOneDocument<ISubject>(collectionName, subjectIndex, updateObj);
}

async function removeSessionToSubject(subjectIndex: ISubjectIndex, sessionId: string): Promise<ISubject | null> {
    const updateObj = {
        "$pull": {
            "sessions": sessionId,
        }
    }
    return await updateOneDocument<ISubject>(collectionName, subjectIndex, updateObj);
}

async function associateSessionToSubject(subjectIndex: ISubjectIndex, sessionId: string): Promise<ISubject | null> {
    const subject = await addSessionToSubject(subjectIndex, sessionId);
    const session = await SessionsCRUD.addSubjectToSession(sessionId, subjectIndex);
    return subject;
}

async function disassociateSessionToSubject(subjectIndex: ISubjectIndex, sessionId: string): Promise<ISubject | null> {
    const subject = await removeSessionToSubject(subjectIndex, sessionId);
    const session = await SessionsCRUD.removeSubjectFromSession(sessionId, subjectIndex);
    return subject;
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
        },
        subjectUpdateDateRange: async (parent, args, context, info) => {
            console.log("subjectUpdateDateRange", args);
            const { subjectIndex, startDate, endDate } = args;
            if (subjectIndex === null || subjectIndex === undefined ||
                subjectIndex.term === null || subjectIndex.term === undefined || subjectIndex.term === "" ||
                subjectIndex.department === null || subjectIndex.department === undefined || subjectIndex.department === "" ||
                subjectIndex.block === null || subjectIndex.block === undefined || subjectIndex.block === "" ||
                subjectIndex.code === null || subjectIndex.code === undefined || subjectIndex.code === "" ||
                startDate === null || startDate === undefined ||
                endDate === null || endDate === undefined
            ) {
                return null;
            }
            const _subjectIndex: ISubjectIndex = {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            }

            return await updateSubjectDateRange(_subjectIndex, startDate, endDate);
        },
        subjectUpdateDeliveryMode: async (parent, args, context, info) => {
            console.log("subjectUpdateDeliveryMode", args);
            const { subjectIndex, deliveryMode } = args;
            if (subjectIndex === null || subjectIndex === undefined ||
                subjectIndex.term === null || subjectIndex.term === undefined || subjectIndex.term === "" ||
                subjectIndex.department === null || subjectIndex.department === undefined || subjectIndex.department === "" ||
                subjectIndex.block === null || subjectIndex.block === undefined || subjectIndex.block === "" ||
                subjectIndex.code === null || subjectIndex.code === undefined || subjectIndex.code === "" ||
                deliveryMode === null || deliveryMode === undefined
            ) {
                return null;
            }
            const _subjectIndex: ISubjectIndex = {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            }

            return await updateSubjectDeliveryMode(_subjectIndex, deliveryMode);
        },
        subjectUpdateCRN: async (parent, args, context, info) => {
            console.log("subjectUpdateCRN", args);
            const { subjectIndex, unitCode, crn } = args;
            if (subjectIndex === null || subjectIndex === undefined ||
                subjectIndex.term === null || subjectIndex.term === undefined || subjectIndex.term === "" ||
                subjectIndex.department === null || subjectIndex.department === undefined || subjectIndex.department === "" ||
                subjectIndex.block === null || subjectIndex.block === undefined || subjectIndex.block === "" ||
                subjectIndex.code === null || subjectIndex.code === undefined || subjectIndex.code === "" ||
                unitCode === null || unitCode === undefined || unitCode === "" ||
                crn === null || crn === undefined
            ) {
                return null;
            }
            const _subjectIndex: ISubjectIndex = {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            }

            return await updateSubjectCRN(_subjectIndex, unitCode, crn);
        },
        subjectSessionAssociate: async (parent, args, context, info) => {
            console.log("subjectSessionAssociate", args);
            const { subjectIndex, sessionId } = args;
            if (subjectIndex === null || subjectIndex === undefined ||
                subjectIndex.term === null || subjectIndex.term === undefined || subjectIndex.term === "" ||
                subjectIndex.department === null || subjectIndex.department === undefined || subjectIndex.department === "" ||
                subjectIndex.block === null || subjectIndex.block === undefined || subjectIndex.block === "" ||
                subjectIndex.code === null || subjectIndex.code === undefined || subjectIndex.code === "" ||
                sessionId === null || sessionId === undefined || sessionId === ""
            ) {
                return null;
            }
            const _subjectIndex: ISubjectIndex = {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            }

            return await associateSessionToSubject(_subjectIndex, sessionId);
        },
        subjectSessionDisassociate: async (parent, args, context, info) => {
            console.log("subjectSessionDisassociate", args);
            const { subjectIndex, sessionId } = args;
            if (subjectIndex === null || subjectIndex === undefined ||
                subjectIndex.term === null || subjectIndex.term === undefined || subjectIndex.term === "" ||
                subjectIndex.department === null || subjectIndex.department === undefined || subjectIndex.department === "" ||
                subjectIndex.block === null || subjectIndex.block === undefined || subjectIndex.block === "" ||
                subjectIndex.code === null || subjectIndex.code === undefined || subjectIndex.code === "" ||
                sessionId === null || sessionId === undefined || sessionId === ""
            ) {
                return null;
            }
            const _subjectIndex: ISubjectIndex = {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            }

            return await disassociateSessionToSubject(_subjectIndex, sessionId);
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
                    "sessionId": {
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
    updateSubjectDateRange,
}
export { SubjectsQuery, SubjectsCRUD };
