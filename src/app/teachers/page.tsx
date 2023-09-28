"use client"
import { gql, useQuery } from 'urql';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
const teachersQuery = gql`
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



const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'firstName', headerName: 'First name' },
    { field: 'lastName', headerName: 'Last name' },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    { field: 'email', headerName: 'Email' }
];

export default function TeacherViewAll() {
    const [result, reexecuteQuery] = useQuery({
        query: teachersQuery,
    });
    const { data, fetching, error } = result;
    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;
    console.log("data fetched ...", data);
    if (data === undefined || data === null || data.teachers === undefined || data.teachers === null) {
        return <p>no data</p>
    }
    if (!Array.isArray(data.teachers)) {
        return <p>data is not an array</p>
    }
    const rows = data.teachers.map((teacher: any) => {
        return {
            id: teacher.orgId,
            firstName: teacher.name.first,
            lastName: teacher.name.last,
            email: teacher.email,
        }
    });
    console.log("row", rows);
    return (
        <>
            <h1>View all teachers</h1>
            <div style={{ width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>

        </>
    )
}