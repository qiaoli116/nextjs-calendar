import { gql, useQuery, useMutation, CombinedError, UseMutationExecute } from 'urql';
import { ITeacher } from "../../types"

export function useQueryTeachers() {
  const TEACHERS_QUERY = gql`
    query Teachers {
      teachers {
        email
        name {
          first
          last
        }
        orgId
      }
    }
  `;

  const [result, executeQuery] = useQuery<{ teachers: ITeacher[] } | undefined | null>({ query: TEACHERS_QUERY });
  const { data, fetching: loading, error } = result;
  const dataError =
    data === undefined ||
    data === null ||
    data.teachers === undefined ||
    data.teachers === null ||
    !Array.isArray(data.teachers);

  return {
    loading,
    error,
    dataError,
    teachers: dataError ? [] : data.teachers,
    reexecuteQueryTeachers: executeQuery,
  };
}


export function useQueryOneTeacher(orgId: string) {
  const TEACHER_QUERY = gql`
    query Teachers($orgId: String) {
      teacher(orgId: $orgId) {
        email
        name {
          first
          last
        }
        orgId
        userName
      }
    }
  `;

  const [result, executeQuery] = useQuery<{ teacher: ITeacher } | undefined | null>({
    query: TEACHER_QUERY,
    variables: { orgId },
  });
  const { data, fetching: loading, error } = result;
  const dataError =
    data === undefined ||
    data === null ||
    data.teacher === undefined ||
    data.teacher === null;

  return {
    loading,
    error,
    dataError,
    teacher: dataError ? null : data.teacher,
    reexecuteQueryTeacher: executeQuery,
  };
}

export interface ICreateTeacherMutationVariables {
  orgId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}
type CreateTeacherMutationData = { teacherCreate: ITeacher } | undefined | null;
// executeMutation({ orgId, userName, email, firstName, lastName })
export function useCreateTeacher(): [UseMutationExecute<CreateTeacherMutationData, ICreateTeacherMutationVariables>] {
  const TEACHER_CREATE_MUTATION = gql`
    mutation Mutation($orgId: String, $userName: String, $email: String, $firstName: String, $lastName: String) {
      teacherCreate(orgId: $orgId, userName: $userName, email: $email, firstName: $firstName, lastName: $lastName) {
        email
        name {
          first
          last
        }
        orgId
        userName
      }
    }
  `;

  const [result, executeMutation] = useMutation<CreateTeacherMutationData, ICreateTeacherMutationVariables>(TEACHER_CREATE_MUTATION);

  return [
    executeMutation
  ];
}

export interface IUpdateTeacherMutationVariables {
  orgId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}
type UpdateTeacherMutationData = { teacherUpdate: ITeacher } | undefined | null;
// executeMutation({ orgId, userName, email, firstName, lastName })
export function useUpdateTeacher(): [UseMutationExecute<UpdateTeacherMutationData, IUpdateTeacherMutationVariables>] {
  const TEACHER_UPDATE_MUTATION = gql`
    mutation Mutation($orgId: String, $userName: String, $email: String, $firstName: String, $lastName: String) {
      teacherUpdate(orgId: $orgId, userName: $userName, email: $email, firstName: $firstName, lastName: $lastName) {
        email
        name {
          first
          last
        }
        orgId
        userName
      }
    }
  `;

  const [result, executeMutation] = useMutation<UpdateTeacherMutationData, IUpdateTeacherMutationVariables>(TEACHER_UPDATE_MUTATION);

  return [
    executeMutation
  ];
}