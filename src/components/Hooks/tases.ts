import { gql, useQuery, useMutation, CombinedError, UseMutationExecute } from 'urql';
import { ITAS, ITASCreateInput, ITASIndex, ITASSubject } from "../../types"

export interface IReadTASesQueryVariables {
    year?: string;
    department?: string;
    qualificationCode?: string;
}
export function useQueryTASes<T = ITAS>(
    options: {
        queryVariables?: IReadTASesQueryVariables,
        queryString?: string | null,
    } = { queryVariables: {}, queryString: null }) {
    const TASES_QUERY = options.queryString !== undefined && options.queryString !== null && options.queryString !== "" ?
        gql`${options.queryString}` :
        gql`
            query TASES {
                tases {
                    department
                    year
                    qualification {
                        code
                        title
                    }
                    subjects {
                        code
                        title
                        units {
                            code
                            title
                        }
                    }
                }
            }`;

    const [result, executeQuery] = useQuery<{ tases: T[] } | undefined | null>({
        query: TASES_QUERY,
        variables: options.queryVariables
    });
    const { data, fetching: loading, error } = result;
    const dataError =
        data === undefined ||
        data === null ||
        data.tases === undefined ||
        data.tases === null ||
        !Array.isArray(data.tases);

    return {
        loading,
        error,
        dataError,
        tases: dataError ? [] : data.tases,
        reexecuteQueryTASes: executeQuery,
    };
}


export function useQueryOneTAS(tasIndex: ITASIndex) {
    console.log("useQueryOneTAS ", tasIndex)
    const TAS_QUERY = gql`
        query Tas($tasIndex: TASIndexInput) {
        tas(tasIndex: $tasIndex) {
            department
            year
                qualification {
                code
                title
            }
                subjects {
                code
                title
                    units {
                    code
                    title
                }
            }
        }
    }
    `;

    const [result, executeQuery] = useQuery<{ tas: ITAS } | undefined | null>({
        query: TAS_QUERY,
        variables: {
            tasIndex
        },
    });
    const { data, fetching: loading, error } = result;
    const dataError =
        data === undefined ||
        data === null ||
        data.tas === undefined ||
        data.tas === null;

    return {
        loading,
        error,
        dataError,
        tas: dataError ? null : data.tas,
        reexecuteQueryTAS: executeQuery,
    };
}


export interface ICreateTASMutationVariables extends ITASCreateInput {
    // year: string;
    // department: string;
    // qualification: ITASQualification;
}
type CreateTASMutationData = { tasCreate: ITAS } | undefined | null;
export function useCreateTAS(): [UseMutationExecute<CreateTASMutationData, ICreateTASMutationVariables>] {
    const TAS_CREATE_MUTATION = gql`
        mutation Mutation($year: String, $department: String, $qualification: TASQualificationInput) {
        tasCreate(year: $year, department: $department, qualification: $qualification) {
            department
                qualification {
                code
                title
            }
            year
        }
    }
    `;

    const [result, executeMutation] = useMutation<CreateTASMutationData, ICreateTASMutationVariables>(TAS_CREATE_MUTATION);

    return [
        executeMutation
    ];
}

export interface ICreateTASSubjectMutationVariables {
    tasIndex: ITASIndex;
    subjects: ITASSubject[];
}
type CreateTASSubjectMutationData = { tasAddSubjects: ITAS } | undefined | null;
export function useCreateTASSubject(): [UseMutationExecute<CreateTASSubjectMutationData, ICreateTASSubjectMutationVariables>] {
    const TAS_CREATE_MUTATION = gql`
        mutation Mutation($tasIndex: TASIndexInput, $subjects: [TASSubjectInput]) {
        tasAddSubjects(tasIndex: $tasIndex, subjects: $subjects) {
            department
                qualification {
                code
                title
            }
                subjects {
                code
                title
                    units {
                    code
                    title
                }
            }
            year
        }
    }
    `;

    const [result, executeMutation] = useMutation<CreateTASSubjectMutationData, ICreateTASSubjectMutationVariables>(TAS_CREATE_MUTATION);

    return [
        executeMutation
    ];
}

export interface IDeleteTASSubjectMutationVariables {
    tasIndex: ITASIndex;
    subjectCodes: string[];
}
type DeleteTASSubjectMutationData = { tasDeleteSubjects: ITAS } | undefined | null;
export function useDeleteTASSubject(): [UseMutationExecute<DeleteTASSubjectMutationData, IDeleteTASSubjectMutationVariables>] {
    const TAS_DELETE_MUTATION = gql`
        mutation TasDeleteSubjects($tasIndex: TASIndexInput, $subjectCodes: [String]) {
        tasDeleteSubjects(tasIndex: $tasIndex, subjectCodes: $subjectCodes) {
                subjects {
                code
                title
                    units {
                    code
                    title
                }
            }
            department
                qualification {
                code
                title
            }
            year
        }
    }
    `;

    const [result, executeMutation] = useMutation<DeleteTASSubjectMutationData, IDeleteTASSubjectMutationVariables>(TAS_DELETE_MUTATION);

    return [
        executeMutation
    ];
}

export interface IDeleteTASMutationVariables {
    tasIndex: ITASIndex;
}
type DeleteTASMutationData = { tasDelete: boolean } | undefined | null;
export function useDeleteTAS(): [UseMutationExecute<DeleteTASMutationData, IDeleteTASMutationVariables>] {
    const TAS_DELETE_MUTATION = gql`
        mutation TasDelete($tasIndex: TASIndexInput) {
        tasDelete(tasIndex: $tasIndex)
    }
    `;

    const [result, executeMutation] = useMutation<DeleteTASMutationData, IDeleteTASMutationVariables>(TAS_DELETE_MUTATION);

    return [
        executeMutation
    ];
}