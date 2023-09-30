import { gql, useQuery } from 'urql';

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

  const [result, reexecuteQuery] = useQuery({ query: TEACHERS_QUERY });
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
    reexecuteQueryTeachers: reexecuteQuery,
  };
}


interface Teacher {
  email: string;
  name: {
    first: string;
    last: string;
  };
  orgId: string;
  userName: string;
}

interface QueryData {
  teacher: Teacher;
}

interface QueryVariables {
  orgId: string;
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

  const [result, reexecuteQuery] = useQuery({
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
    teacher: dataError ? [] : data.teacher,
    reexecuteQueryTeacher: reexecuteQuery,
  };
}