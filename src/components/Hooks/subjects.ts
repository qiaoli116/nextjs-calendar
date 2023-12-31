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

import { IDateRange, ISubject, ISubjectCreateInput, ISubjectExtended, ISubjectIndex, ISubjectUnit, TDeliveryMode } from "@/types";
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

export function useQueryOneSubject(subjectIndex: ISubjectIndex) {
  console.log("useQueryOneSubject ", subjectIndex)
  const SUBJECT_QUERY = gql`
    query Subjects($subjectIndex: SubjectIndexInput) {
        subject(subjectIndex: $subjectIndex) {
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
      }`;
  const [result, executeQuery] = useQuery<{ subject: ISubjectExtended } | undefined | null>({
    query: SUBJECT_QUERY,
    variables: {
      subjectIndex
    },
  });
  const { data, fetching: loading, error } = result;
  const dataError =
    data === undefined ||
    data === null ||
    data.subject === undefined ||
    data.subject === null;

  return {
    loading,
    error,
    dataError,
    subject: dataError ? null : data.subject,
    reexecuteQuerySubject: executeQuery,
  };
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


export interface IUpdateSubjectDateRangeMutationVariables {
  subjectIndex: ISubjectIndex;
  startDate: string;
  endDate: string;
}
type UpdateSubjectDateRangeMutationData = {
  subjectUpdateDateRange: {
    dateRange: {
      startDate: string;
      endDate: string;
    };
  }
} | undefined | null;
export function useUpdateSubjectDateRange(): [UseMutationExecute<UpdateSubjectDateRangeMutationData, IUpdateSubjectDateRangeMutationVariables>] {
  const SUBJECT_UPDATE_DATE_RANGE_MUTATION = gql`
    mutation Mutation($subjectIndex: SubjectIndexInput, $startDate: String, $endDate: String) {
        subjectUpdateDateRange(subjectIndex: $subjectIndex, startDate: $startDate, endDate: $endDate) {
          dateRange {
            startDate
            endDate
          }
        }
      }
    `;
  const [result, executeMutation] = useMutation<UpdateSubjectDateRangeMutationData, IUpdateSubjectDateRangeMutationVariables>(SUBJECT_UPDATE_DATE_RANGE_MUTATION);
  return [
    executeMutation
  ];
}

export interface IUpdateSubjectDeliveryModeMutationVariables {
  subjectIndex: ISubjectIndex;
  deliveryMode: TDeliveryMode;
}
type UpdateSubjectDeliveryModeMutationData = {
  subjectUpdateDeliveryMode: {
    deliveryMode: TDeliveryMode;
  }
} | undefined | null;
export function useUpdateSubjectDeliveryMode(): [UseMutationExecute<UpdateSubjectDeliveryModeMutationData, IUpdateSubjectDeliveryModeMutationVariables>] {
  const SUBJECT_UPDATE_DELIVERY_MODE_MUTATION = gql`
    mutation Mutation($subjectIndex: SubjectIndexInput, $deliveryMode: String) {
      subjectUpdateDeliveryMode(subjectIndex: $subjectIndex, deliveryMode: $deliveryMode) {
        deliveryMode
      }
    }
    `;
  const [result, executeMutation] = useMutation<UpdateSubjectDeliveryModeMutationData, IUpdateSubjectDeliveryModeMutationVariables>(SUBJECT_UPDATE_DELIVERY_MODE_MUTATION);
  return [
    executeMutation
  ];
}

export interface IUpdateSubjectCRNMutationVariables {
  subjectIndex: ISubjectIndex;
  unitCode: string;
  crn: string;
}
type UpdateSubjectCRNMutationData = {
  subjectUpdateCRN: {
    units: ISubjectUnit[];
  }
} | undefined | null;
export function useUpdateSubjectCRN(): [UseMutationExecute<UpdateSubjectCRNMutationData, IUpdateSubjectCRNMutationVariables>] {
  const SUBJECT_UPDATE_CRN_MUTATION = gql`
    mutation Mutation($subjectIndex: SubjectIndexInput, $unitCode: String, $crn: String) {
        subjectUpdateCRN(subjectIndex: $subjectIndex, unitCode: $unitCode, crn: $crn) {
          units {
            code
            crn
          }
        }
      }
    `;
  const [result, executeMutation] = useMutation<UpdateSubjectCRNMutationData, IUpdateSubjectCRNMutationVariables>(SUBJECT_UPDATE_CRN_MUTATION);
  return [
    executeMutation
  ];
}

export interface IAssociateSubjectSessionMutationVariables {
  subjectIndex: ISubjectIndex;
  sessionId: string;
}
type AssociateSubjectSessionMutationData = {
  subjectSessionAssociate: ISubjectExtended;
} | undefined | null;
export function useAssociateSubjectSession(): [UseMutationExecute<AssociateSubjectSessionMutationData, IAssociateSubjectSessionMutationVariables>] {
  const SUBJECT_ASSOCIATE_SESSION_MUTATION = gql`
      mutation Mutation($subjectIndex: SubjectIndexInput, $sessionId: String) {
        subjectSessionAssociate(subjectIndex: $subjectIndex, sessionId: $sessionId) {
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
    `;
  const [result, executeMutation] = useMutation<AssociateSubjectSessionMutationData, IAssociateSubjectSessionMutationVariables>(SUBJECT_ASSOCIATE_SESSION_MUTATION);
  return [
    executeMutation
  ];
}


export interface IDisassociateSubjectSessionMutationVariables {
  subjectIndex: ISubjectIndex;
  sessionId: string;
}
type DisassociateSubjectSessionMutationData = {
  subjectSessionDisassociate: ISubjectExtended;
} | undefined | null;
export function useDisassociateSubjectSession(): [UseMutationExecute<DisassociateSubjectSessionMutationData, IDisassociateSubjectSessionMutationVariables>] {
  const SUBJECT_DISASSOCIATE_SESSION_MUTATION = gql`
      mutation Mutation($subjectIndex: SubjectIndexInput, $sessionId: String) {
        subjectSessionDisassociate(subjectIndex: $subjectIndex, sessionId: $sessionId) {
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
    `;
  const [result, executeMutation] = useMutation<DisassociateSubjectSessionMutationData, IDisassociateSubjectSessionMutationVariables>(SUBJECT_DISASSOCIATE_SESSION_MUTATION);
  return [
    executeMutation
  ];
}