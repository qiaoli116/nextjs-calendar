import { gql, useQuery, useMutation, CombinedError, UseMutationExecute } from 'urql';
import { ITAS, ITASCreateInput, ITASSubject } from "../../types"

export function useQueryTASes() {
    const TASES_QUERY = gql`
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
        }
    `;

    const [result, executeQuery] = useQuery<{ tases: ITAS[] } | undefined | null>({ query: TASES_QUERY });
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


export function useQueryOneTAS(department: string, year: string, qualificationCode: string) {
    console.log("useQueryOneTAS ", department, year, qualificationCode)
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
            tasIndex: {
                department,
                qualificationCode,
                year
            }
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
    tasIndex: {
        department: string;
        year: string;
        qualificationCode: string;
    };
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