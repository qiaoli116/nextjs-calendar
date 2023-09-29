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