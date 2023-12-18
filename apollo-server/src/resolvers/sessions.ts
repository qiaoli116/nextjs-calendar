import { dbClient, dbCollections, insertOneDocument, readAllDocuments, readOneDocumentByIndex, updateOneDocument, insertManyDocuments } from '../db.js'
import { ISession, ISubjectIndex } from './types.js'
import { TeachersCRUD } from './teachers.js';
import { SubjectsCRUD } from './subjects.js';
import { RoomsCRUD } from './rooms.js';
import { genSessionRef } from './utilities.js'
const collectionName = dbCollections.sessions.name;
async function readAllSessions(query: any = {}): Promise<ISession[] | null> {
    return await readAllDocuments<ISession>(collectionName, query);
}

async function readSessionBySessionId(sessionId: string): Promise<ISession | null> {
    return await readOneDocumentByIndex<ISession>(collectionName, { sessionId: sessionId });
}

async function createSession(session: ISession): Promise<ISession | null> {
    return await insertOneDocument<ISession>(collectionName, session);
}

async function createSessionsBulk(sessions: ISession[]): Promise<ISession[] | null> {
    return await insertManyDocuments<ISession>(collectionName, sessions);
}

async function addSubjectToSession(sessionId: String, subjectIndex: ISubjectIndex): Promise<ISession | null> {
    const updateObj = {
        "$addToSet": {
            "subjects": {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            },
        }
    };
    return await updateOneDocument<ISession>(collectionName, { sessionId }, updateObj);
}

async function removeSubjectFromSession(sessionId: String, subjectIndex: ISubjectIndex): Promise<ISession | null> {
    const updateObj = {
        "$pull": {
            "subjects": {
                term: subjectIndex.term,
                department: subjectIndex.department,
                block: subjectIndex.block,
                code: subjectIndex.code,
            },
        }
    };
    return await updateOneDocument<ISession>(collectionName, { sessionId }, updateObj);
}

const SessionsQuery = {
    Query: {
        sessions: async () => {
            return await readAllSessions()
        },
        session: async (parent, args, context, info) => {
            const { sessionId } = args;
            return await readSessionBySessionId(sessionId);
        }
    },
    Mutation: {
        sessionCreate: async (parent, args, context, info) => {
            console.log("addSession", args);
            const { subjectIndexes } = args;
            const _subjectIndexes: ISubjectIndex[] = [];
            if (Array.isArray(subjectIndexes)) {
                subjectIndexes.forEach((subjectIndex) => {
                    const _subjectIndex: ISubjectIndex = {
                        term: subjectIndex.term,
                        department: subjectIndex.department,
                        block: subjectIndex.block,
                        code: subjectIndex.code,
                    }
                    _subjectIndexes.push(_subjectIndex);
                })
            }

            const session: ISession = {
                sessionId: genSessionRef(),
                date: args.date,
                teacher: args.teacherOrgId,
                room: args.roomNumber,
                subjects: _subjectIndexes,
                timeslots: args.timeslots
            };
            return await createSession(session);
        },
        sessionCreateBulk: async (parent, args, context, info) => {
            console.log("addSessionsBulk", args);
            console.log("addSession", args);
            const { subjectIndexes } = args;
            const _subjectIndexes: ISubjectIndex[] = [];
            if (Array.isArray(subjectIndexes)) {
                subjectIndexes.forEach((subjectIndex) => {
                    const _subjectIndex: ISubjectIndex = {
                        term: subjectIndex.term,
                        department: subjectIndex.department,
                        block: subjectIndex.block,
                        code: subjectIndex.code,
                    }
                    _subjectIndexes.push(_subjectIndex);
                })
            }
            const dates = args.dates;
            const sessions: ISession[] = [];
            for (const date of dates) {
                const session: ISession = {
                    sessionId: genSessionRef(),
                    date: date,
                    teacher: args.teacherOrgId,
                    room: args.roomNumber,
                    subjects: _subjectIndexes,
                    timeslots: args.timeslots
                };
                sessions.push(session);
            }

            return await createSessionsBulk(sessions);
        }
    },
    Children: {
        Session: {
            teacher: async (parent, args, context, info) => {
                console.log("Session teacher", parent);
                const { teacher: teacherId } = parent;
                const emptyTeacher = {
                    orgId: "",
                    userName: "",
                    email: "",
                    name: {
                        first: "",
                        last: ""
                    }
                }
                if (teacherId === "" || teacherId === null || teacherId === undefined) {
                    return emptyTeacher;
                }
                const teacher = await TeachersCRUD.readTeacherByOrgId(teacherId);
                if (teacher === null) {
                    return emptyTeacher;
                }
                return teacher;
            },
            room: async (parent, args, context, info) => {
                console.log("Session room", parent);
                const { room: roomNumber } = parent;
                const emptyRoom = {
                    roomNumber: "",
                    type: "",
                };
                if (roomNumber === "" || roomNumber === null || roomNumber === undefined) {
                    return emptyRoom;
                }
                const room = await RoomsCRUD.readRoomByRoomNumber(roomNumber);
                if (room === null) {
                    return emptyRoom;
                }
                return room;
            },
            subjects: async (parent, args, context, info) => {
                console.log("Session subjects", parent);
                const { subjects } = parent;
                const _subjects = [];
                for (const subject of subjects) {
                    const _subject = await SubjectsCRUD.readSubject(subject);
                    if (_subject) {
                        _subjects.push(_subject);
                    }
                }
                return _subjects;
            }
        }
    }

}
const SessionsCRUD = {
    readAllSessions,
    readSessionBySessionId,
    createSession,
    addSubjectToSession,
    removeSubjectFromSession
}
export { SessionsQuery, SessionsCRUD };
