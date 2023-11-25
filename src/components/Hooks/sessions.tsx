import { ISession, ISessionExtended, ISubjectIndex } from "@/types";
import { UseMutationExecute, gql, useMutation, useQuery } from "urql";




export interface IReadSessionsQueryVariables {
}
export function useQuerySessions<T = ISession>(
  options: {
    queryVariables?: IReadSessionsQueryVariables,
    queryString?: string | null
  } = { queryVariables: {}, queryString: null }
) {
  const SESSIONS_QUERY = options.queryString !== undefined && options.queryString !== null && options.queryString !== "" ?
    gql`${options.queryString}` :
    gql`
        query Sessions {
            sessions {
                sessionId
                date
                teacher {
                    orgId
                    name {
                        first
                        last
                    }
                }
                room {
                    roomNumber
                    type
                }
                timeslots
            }
        }
    `;

  const [result, executeQuery] = useQuery<{ sessions: T[] } | undefined | null>({ query: SESSIONS_QUERY });
  const { data, fetching: loading, error } = result;
  const dataError =
    data === undefined ||
    data === null ||
    data.sessions === undefined ||
    data.sessions === null ||
    !Array.isArray(data.sessions);

  return {
    loading,
    error,
    dataError,
    sessions: dataError ? [] : data.sessions,
    reexecuteQuerySessions: executeQuery,
  };
}


export function useQueryOneSession(sessionId: string) {
  console.log("useQueryOneSession ", sessionId)
  const SESSION_QUERY = gql`
        query SESSION($sessionId: String) {
            session(sessionId: $sessionId) {
            sessionId
            date
            teacher {
                name {
                    first
                    last
                }
                email
                orgId
            }
            room {
                roomNumber
                type
            }
            timeslots
            subjects {
                code
                title
                term
                department
                block
                qualification {
                    code
                    title
                }
                sessions {
                    sessionId
                    date
                    teacher {
                        name {
                            first
                            last
                        }
                        orgId
                        email
                    }
                    room {
                        roomNumber
                        type
                    }
                    timeslots
                    }
                }
            }
        }
    `;

  const [result, executeQuery] = useQuery<{ session: ISessionExtended } | undefined | null>({
    query: SESSION_QUERY,
    variables: { sessionId },
  });
  const { data, fetching: loading, error } = result;
  const dataError =
    data === undefined ||
    data === null ||
    data.session === undefined ||
    data.session === null;

  return {
    loading,
    error,
    dataError,
    session: dataError ? null : data.session,
    reexecuteQuerySession: executeQuery,
  };
}



const session_create_query_string_extended = `
mutation SessionCreate($date: String, $teacherOrgId: String, $roomNumber: String, $timeslots: [String], $subjectIndexes: [SubjectIndexInput]) {
    sessionCreate(date: $date, teacherOrgId: $teacherOrgId, roomNumber: $roomNumber, timeslots: $timeslots, subjectIndexes: $subjectIndexes) {
      sessionId
      date
      teacher {
        orgId
        email
        name {
          first
          last
        }
      }
      room {
        roomNumber
        type
      }
      timeslots
      subjects {
        code
        title
        term
        department
        block
        tasIndex {
          year
          department
          qualificationCode
        }
        qualification {
          code
          title
        }
        deliveryMode
        dateRange {
          startDate
          endDate
        }
        units {
          code
          title
          crn
        }
        sessions {
          sessionId
          date
          teacher {
            orgId
            email
            name {
              first
              last
            }
          }
          room {
            roomNumber
            type
          }
          timeslots
        }
      }
    }
  }
`;
export interface ICreateSessionMutationVariables {
  date: string;
  teacherOrgId: string;
  roomNumber: string;
  timeslots: string;
  subjectIndexes: ISubjectIndex[];
}
type CreateSessionMutationData = { sessionCreate: ISessionExtended } | undefined | null;
export function useCreateSession(): [UseMutationExecute<CreateSessionMutationData, ICreateSessionMutationVariables>] {
  const [result, executeMutation] = useMutation<CreateSessionMutationData, ICreateSessionMutationVariables>(session_create_query_string_extended);

  return [
    executeMutation
  ];
}
// export interface ICreateTeacherMutationVariables extends ISession {
//     // sessionId: string;
//     // date: string;
//     // teacher: string;
//     // room: string;
//     // timeslots: string[];
//     // subjects: string[];
// }
// type CreateTeacherMutationData = { teacherCreate: ITeacher } | undefined | null;
// // executeMutation({ orgId, userName, email, firstName, lastName })
// export function useCreateTeacher(): [UseMutationExecute<CreateTeacherMutationData, ICreateTeacherMutationVariables>] {
//     const TEACHER_CREATE_MUTATION = gql`
//       mutation Mutation($orgId: String, $userName: String, $email: String, $name: NameInput) {
//         teacherCreate(orgId: $orgId, userName: $userName, email: $email, name: $name) {
//           email
//           name {
//             first
//             last
//           }
//           orgId
//           userName
//         }
//       }
//     `;

//     const [result, executeMutation] = useMutation<CreateTeacherMutationData, ICreateTeacherMutationVariables>(TEACHER_CREATE_MUTATION);

//     return [
//         executeMutation
//     ];
// }
