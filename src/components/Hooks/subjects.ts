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
