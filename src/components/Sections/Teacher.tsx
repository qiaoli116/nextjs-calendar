"use client"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryTeachers, useQueryOneTeacher } from '../Hooks/teachers';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import TextField from '@mui/material/TextField';
import React from 'react';
import _ from 'lodash';
import { ITeacher } from '../../types';
import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';


function TeacherViewAllComponent({ singleTeacherPath = "" }: { singleTeacherPath: string }) {
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


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
            maxWidth: 130,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <strong>
                    <Link href={`${singleTeacherPath}/${params.value}`}>{params.value}</Link>

                </strong>
            )
        },
        { field: 'firstName', headerName: 'First name', flex: 1, maxWidth: 200 },
        { field: 'lastName', headerName: 'Last name', flex: 1, maxWidth: 200 },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            flex: 1,
            maxWidth: 250,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,

        },
        { field: 'email', headerName: 'Email', flex: 1 }
    ];

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
                    disableRowSelectionOnClick
                />
            </div>

        </>
    )
}
function TeacherViewOneComponent({ orgId }: { orgId: string }) {
    console.log("TeacherViewOneComponent");
    const { loading, error, dataError, teacher, reexecuteQueryTeacher } = useQueryOneTeacher(orgId);

    if (loading) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <CircularProgress color="inherit" size={20} /> Loading Teacher {orgId} ...
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


    return (
        <>
            <h1>View teacher</h1>
            <Box sx={{ pb: "20px", width: "400px" }}>
                <TextField
                    id="outlined-read-only-input"
                    fullWidth
                    label="Org ID"
                    defaultValue={teacher.orgId}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ pb: "20px", width: "400px" }}>

                <TextField
                    id="outlined-read-only-input"
                    fullWidth
                    label="First Name"
                    defaultValue={teacher.name.first}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ pb: "20px", width: "400px" }}>
                <TextField
                    id="outlined-read-only-input"
                    fullWidth
                    label="Last Name"
                    defaultValue={teacher.name.last}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ pb: "20px", width: "400px" }}>
                <TextField
                    id="outlined-read-only-input"
                    fullWidth
                    label="Email"
                    defaultValue={teacher.email}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>

        </>
    )
}


function TeacherCreateComponent({ onCreateSuccess }: { onCreateSuccess: () => void }) {
    console.log("TeacherCreateComponent");
    const emptyTeacher: ITeacher = {
        orgId: "",
        name: {
            first: "",
            last: ""
        },
        email: "",
        userName: "",
    }
    const [teacher, setTeacher] = React.useState<ITeacher>(emptyTeacher);
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...teacher };
        _.set(s, name, value);
        setTeacher(s);
        console.log("handleInputChange - ", "teacher", teacher);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "teacher", teacher);
    };
    const resetForm = () => {
        setTeacher(emptyTeacher);
    };

    return (
        <>
            <h1>View teacher</h1>
            <form onSubmit={handleSubmit}>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            id="outlined-read-only-input"
                            fullWidth
                            label="Org ID"
                            name='orgId'
                            value={teacher.orgId}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            id="outlined-read-only-input"
                            fullWidth
                            label="First Name"
                            name='name.first'
                            value={teacher.name.first}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            id="outlined-read-only-input"
                            fullWidth
                            label="Last Name"
                            name='name.last'
                            value={teacher.name.last}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            id="outlined-read-only-input"
                            fullWidth
                            label="Email"
                            name='email'
                            value={teacher.email}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            id="outlined-read-only-input"
                            fullWidth
                            label="User Name"
                            name='userName'
                            value={teacher.userName}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <Button type='submit'>
                        Save
                    </Button>
                    <Button onClick={resetForm}>
                        Reset
                    </Button>
                </Box>
            </form>


        </>
    )
}

export { TeacherViewAllComponent, TeacherViewOneComponent, TeacherCreateComponent }