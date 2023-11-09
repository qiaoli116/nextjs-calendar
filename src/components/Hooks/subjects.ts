/*
const filterValues = {
    year: ['2022', '2023'],
    department: ['Engineering', 'Sales'],
    qualification: ['Bachelor degree', 'Masters degree']
  };

  const filter = {};
  for (const key in filterValues) {
    const values = filterValues[key];
    if (values.length === 1) {
      filter[`$${key}`] = values[0];
    } else {
      filter[`$${key}`] = { $in: values };
    }
  }
*/

import { ISubject, ISubjectCreateInput } from "@/types";
import { type } from "os";
import { gql, useQuery, useMutation, CombinedError, UseMutationExecute } from "urql";

export interface IReadSubjectsQueryVariables {
    term?: string;
    department?: string;
    block?: string;
    code?: string;
}
export function useQuerySubjects<T = ISubject>(
    options: {
        queryVariables?: IReadSubjectsQueryVariables,
        queryString?: string | null,
    } = { queryVariables: {}, queryString: null }) {
    const SUBJECTS_QUERY = options.queryString !== undefined && options.queryString !== null && options.queryString !== "" ?
        gql`${options.queryString}` :
        gql`
        query Subjects {
            subjects {
                block
                code
                title
                term
                department
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
            }
        }
    `;
    const [result, executeQuery] = useQuery<{ subjects: T[] } | undefined | null>({
        query: SUBJECTS_QUERY,
        variables: options.queryVariables
    });

    const { data, fetching: loading, error } = result;
    const dataError =
        data === undefined ||
        data === null ||
        data.subjects === undefined ||
        data.subjects === null ||
        !Array.isArray(data.subjects);

    return {
        loading,
        error,
        dataError,
        subjects: dataError ? [] : data.subjects,
        reexecuteQuerySubjects: executeQuery
    }

}

export interface ICreateSubjectMutationVariables extends ISubjectCreateInput {
    // tasIndex: ITASIndex;
    // code: string;
    // title: string;
    // term: string;
    // department: string;
    // block: string;
    // qualification: IQualification;
    // units: ITASUnit[];
}
type CreateSubjectMutationData = { subjectCreate: ISubject } | undefined | null;
export function useCreateSubject(): [UseMutationExecute<CreateSubjectMutationData, ICreateSubjectMutationVariables>] {

    const SUBJECT_CREATE_MUTATION = gql`
        mutation Mutation($code: String, $title: String, $term: String, $department: String, $block: String, $qualification: QualificationInput, $tasIndex: TASIndexInput, $units: [TASUnitInput]) {
            subjectCreate(code: $code, title: $title, term: $term, department: $department, block: $block, qualification: $qualification, tasIndex: $tasIndex, units: $units) {
                block
                code
                department
                qualification {
                    code
                    title
                }
                term
                title
                tasIndex {
                    department
                    qualificationCode
                    year
                }
            }
        }
    `;

    const [result, executeMutation] = useMutation<CreateSubjectMutationData, ICreateSubjectMutationVariables>(SUBJECT_CREATE_MUTATION);

    return [
        executeMutation
    ];
}
