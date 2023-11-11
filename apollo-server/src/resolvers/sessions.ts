import { dbClient, dbCollections, insertOneDocument, readAllDocuments, readOneDocumentByIndex } from '../db.js'
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
            const subjectIndex: ISubjectIndex = {
                term: args.subjectIndex.term,
                department: args.subjectIndex.department,
                block: args.subjectIndex.block,
                code: args.subjectIndex.code
            }
            const session: ISession = {
                sessionId: genSessionRef(),
                date: args.date,
                teacher: args.teacherOrgId,
                room: args.roomNumber,
                subjects: [subjectIndex],
                timeslots: args.timeslots
            };
            return await createSession(session);
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
    readSessionBySessionId
}
export { SessionsQuery, SessionsCRUD };
