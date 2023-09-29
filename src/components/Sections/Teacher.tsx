"use client"
import { gql, useQuery } from 'urql';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryTeachers } from '../Hooks/teachers';
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

export default function TeacherViewAllComponent() {
    console.log("TeacherViewAllComponent");
    const { loading, error, dataError, teachers, reexecuteQueryTeachers } = useQueryTeachers();

    if (loading) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <CircularProgress color="inherit" size={20} /> Loading Teacher List ...
            </Box>
        )
    };
    if (error) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        <div>Error: {error.message}</div>;
                    </pre>
                </code>
            </Box>
        )
    }
    if (dataError) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        <div>Error: Data is missing or invalid</div>;
                    </pre>
                </code>
            </Box>
        )
    }

    const rows = teachers.map((teacher: any) => {
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

export { TeacherViewAllComponent }