import { ISession } from "@/types";
import { gql, useQuery } from "urql";


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


export function useQueryOneSession(orgId: string) {
    console.log("useQueryOneSession ", orgId)
    const SESSION_QUERY = gql`
        query SESSION($reference: String) {
            session(reference: $reference) {
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

    const [result, executeQuery] = useQuery<{ session: ISession } | undefined | null>({
        query: SESSION_QUERY,
        variables: { orgId },
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
