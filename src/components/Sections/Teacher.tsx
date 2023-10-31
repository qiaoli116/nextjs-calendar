"use client"
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryTeachers, useQueryOneTeacher, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '../Hooks/teachers';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import React from 'react';
import _ from 'lodash';
import { ITeacher } from '../../types';
import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import { sleep } from '../../dataService/utils';
import { MutationStatus } from '../../types';
import { Alert, AlertTitle } from '@mui/material';
import CRUDLinksComponent from '../Controls/CRUDLinks';


function TeacherViewAllComponent({ singleTeacherPath = "" }: { singleTeacherPath: string }) {
    console.log("TeacherViewAllComponent");
    const { loading, error, dataError, teachers, reexecuteQueryTeachers } = useQueryTeachers();

    if (loading) {
        return (
            <Alert severity="info">
                <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Teacher List ...
            </Alert>
        )
    };
    if (error) {
        return (
            <Alert severity="error">
                Failed to load teacher list
                <br />
                Error Message: {error.message}
            </Alert>
        )
    }
    if (dataError) {
        return (
            <Alert severity="error">
                Failed to load teacher list
            </Alert >
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
                    <Link underline="hover" href={`${singleTeacherPath}/view/${params.value}`}>{params.value}</Link>
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
        { field: 'email', headerName: 'Email', flex: 1, maxWidth: 400 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            maxWidth: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <>
                    <CRUDLinksComponent
                        baseURL={singleTeacherPath}
                        resourceId={params.row.id}
                        createLink={false}
                        hasText={false}
                    />

                </>
            )
        }
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

            <div style={{ width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 50 },
                        },
                    }}
                    pageSizeOptions={[50, 100]}
                    disableRowSelectionOnClick
                    slots={{
                        toolbar: () => (
                            <>
                                <GridToolbarContainer>
                                    <CRUDLinksComponent
                                        baseURL={singleTeacherPath}
                                        createLink={true}
                                        readLink={false}
                                        updateLink={false}
                                        deleteLink={false}
                                    />
                                    <GridToolbarExport />
                                    <Box sx={{ flex: '1 1 0%' }}></Box>
                                    <GridToolbarQuickFilter />

                                </GridToolbarContainer>
                            </>
                        )
                    }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
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
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Teacher {orgId} ...
                </Alert>
            </>

        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{orgId}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>
        )
    }
    if (dataError || teacher === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{orgId}</strong>
                </Alert>
            </>
        )
    }


    return (
        <>
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

function TeacherCreateComponent({ onCreateSuccess }: { onCreateSuccess?: (teacher: ITeacher) => void }) {
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
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeCreateTeacher] = useCreateTeacher();
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...teacher };
        _.set(s, name, value);
        setTeacher(s);
        console.log("handleInputChange - ", "teacher", teacher);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "teacher", teacher);
        setMutationStatus("loading");
        const _teacher = {
            orgId: teacher.orgId,
            userName: teacher.userName,
            email: teacher.email,
            name: {
                first: teacher.name.first,
                last: teacher.name.last
            }
        };
        const result = await executeCreateTeacher(_teacher);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.teacherCreate == null || result.data.teacherCreate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.teacherCreate);
                }
            }

        }
    };
    const resetForm = async () => {

        setTeacher(emptyTeacher);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
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
                            fullWidth
                            label="User Name"
                            name='userName'
                            value={teacher.userName}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <Button type='submit' disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Creating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Create"}
                    </Button>
                    <Button onClick={resetForm}>
                        Reset
                    </Button>
                </Box>
            </form>
            {mutationStatus === "error" && <Alert severity="error">Create Error</Alert >}
            {mutationStatus === "success" && <Alert severity="success">Create successful</Alert >}
        </>
    )
}

function TeacherUpdateComponent({ orgId, onUpdateSuccess }: { orgId: string, onUpdateSuccess?: (teacher: ITeacher) => void }) {
    console.log("TeacherUpdateComponent");
    const { loading, error, dataError, teacher: teacherCurrent, reexecuteQueryTeacher } = useQueryOneTeacher(orgId);

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
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeUpdateTeacher] = useUpdateTeacher();
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...teacher };
        _.set(s, name, value);
        setTeacher(s);
        console.log("handleInputChange - ", "teacher", teacher);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "teacher", teacher);
        setMutationStatus("loading");
        const _teacher = {
            orgId: teacher.orgId,
            userName: teacher.userName,
            email: teacher.email,
            name: {
                first: teacher.name.first,
                last: teacher.name.last
            }
        };
        const result = await executeUpdateTeacher(_teacher);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.teacherUpdate == null || result.data.teacherUpdate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onUpdateSuccess) {
                    onUpdateSuccess(result.data.teacherUpdate);
                }
            }
        }
    };
    const resetForm = async () => {
        reexecuteQueryTeacher({ requestPolicy: 'network-only' });
        setMutationStatus("idle")
    };

    React.useEffect(() => {
        console.log("TeacherUpdateComponent - useEffect - teacherCurrent", teacherCurrent)
        if (teacherCurrent) {
            setTeacher({ ...teacherCurrent });
        }
    }, [loading]);

    if (loading) {
        return (
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Teacher {orgId} ...
                </Alert>
            </>
        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{orgId}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>
        )
    }
    if (dataError || teacherCurrent === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{orgId}</strong>
                </Alert>
            </>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{ pb: "20px", width: "400px" }}>
                    <TextField
                        fullWidth
                        label="Org ID (Read Only)"
                        name="orgId"
                        value={teacher.orgId}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ pb: "20px", width: "400px" }}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="name.first"
                        value={teacher.name.first}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ pb: "20px", width: "400px" }}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="name.last"
                        value={teacher.name.last}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ pb: "20px", width: "400px" }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={teacher.email}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="User Name"
                            name='userName'
                            value={teacher.userName}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <Button type='submit' disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Updating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Save"}
                    </Button>
                    <Button onClick={resetForm}>
                        Reload
                    </Button>
                </Box>
            </form>
            {mutationStatus === "error" && <Alert severity="error">Update Error</Alert >}
            {mutationStatus === "success" && <Alert severity="success">Update successful</Alert >}

        </>
    )
}

function TeacherDeleteComponent({ orgId, onDeleteSuccess }: { orgId: string, onDeleteSuccess?: (deleted: boolean) => void }) {
    console.log("TeacherUpdateComponent");
    const { loading, error, dataError, teacher, reexecuteQueryTeacher } = useQueryOneTeacher(orgId);
    const [executeDeleteTeacher] = useDeleteTeacher();
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");

    if (loading) {
        return (
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Teacher {orgId} ...
                </Alert>
            </>
        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{orgId}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>

        )
    }
    if (dataError || teacher === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{orgId}</strong>
                </Alert>
            </>
        )
    }
    const deleteTeacher = async () => {
        console.log("deleteTeacher - ", "teacher", orgId);
        setMutationStatus("loading");
        const result = await executeDeleteTeacher({ orgId });
        console.log("deleteTeacher - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.teacherDelete == null || result.data.teacherDelete == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onDeleteSuccess) {
                    onDeleteSuccess(result.data.teacherDelete);
                }
            }

        }
    }
    const teacherInfo = `${orgId} - ${teacher.name.last}, ${teacher.name.first}`;
    return (
        <>
            {mutationStatus === "error" && <Alert severity="error">Delete Error</Alert >}
            {mutationStatus === "success" && <Alert severity="success">Delete successful (teacherInfo)</Alert >}
            {mutationStatus === "loading" || mutationStatus === "idle" ?
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    Are you sure to <u><i>permanently</i></u> delete teacher <strong>{teacherInfo}? </strong>
                    <Button onClick={deleteTeacher} disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Deleting&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Delete"}
                    </Button>
                </Alert>
                : ""
            }

        </>
    )
}

export { TeacherViewAllComponent, TeacherViewOneComponent, TeacherCreateComponent, TeacherUpdateComponent, TeacherDeleteComponent }