"use client"
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryTASes, useQueryOneTAS, useCreateTAS } from '../Hooks/tases';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import React from 'react';
import _ from 'lodash';
import { ITAS, ITASCreateInput } from '../../types';
import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import { sleep } from '../../dataService/utils';
import { MutationStatus } from '../../types';
import { Alert, AlertTitle } from '@mui/material';
import CRUDLinksComponent from '../Controls/CRUDLinks';


function TASViewAllComponent({ singleTASPath = "" }: { singleTASPath: string }) {
    console.log("TASViewAllComponent");
    const { loading, error, dataError, tases, reexecuteQueryTASes } = useQueryTASes();

    if (loading) {
        return (
            <Alert severity="info">
                <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading TAS List ...
            </Alert>
        )
    };
    if (error) {
        return (
            <Alert severity="error">
                Failed to load TAS list
                <br />
                Error Message: {error.message}
            </Alert>
        )
    }
    if (dataError) {
        return (
            <Alert severity="error">
                Failed to load TAS list
            </Alert >
        )
    }


    const columns: GridColDef[] = [
        { field: 'department', headerName: 'Department', flex: 1, maxWidth: 100 },
        { field: 'year', headerName: 'Year', flex: 1, maxWidth: 100 },
        { field: 'qualification', headerName: 'Qualification', flex: 1, maxWidth: 800 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            maxWidth: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <>
                    <CRUDLinksComponent
                        baseURL={singleTASPath}
                        resourceId={params.row.id}
                        createLink={false}
                        hasText={false}
                    />
                </>
            )
        }
    ];

    const rows = tases.map((tas: ITAS) => {
        return {
            id: `${tas.department.toLowerCase()}/${tas.year}/${tas.qualification.code.toLowerCase()}`,
            department: tas.department,
            year: tas.year,
            qualification: `${tas.qualification.code} - ${tas.qualification.title}`,
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
                                        baseURL={singleTASPath}
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

function TASViewOneComponent({ department, year, qualificationCode }: { department: string, year: string, qualificationCode: string }) {
    console.log("TASViewOneComponent");
    const { loading, error, dataError, tas, reexecuteQueryTAS } = useQueryOneTAS(department, year, qualificationCode);

    if (loading) {
        return (
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading TAS {department} {year} {qualificationCode} ...
                </Alert>
            </>

        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load TAS <strong>{department} {year} {qualificationCode}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>
        )
    }
    if (dataError || tas === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load TAS <strong>{department} {year} {qualificationCode}</strong>
                </Alert>
            </>
        )
    }


    return (
        <>
            <Box sx={{ pb: "20px", width: "400px" }}>
                <TextField
                    fullWidth
                    label="Department"
                    defaultValue={tas.department}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ pb: "20px", width: "400px" }}>

                <TextField
                    fullWidth
                    label="Year"
                    defaultValue={tas.year}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ pb: "20px", width: "400px" }}>
                <TextField
                    fullWidth
                    label="Qualification Code"
                    defaultValue={tas.qualification.code}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
            <Box sx={{ pb: "20px", width: "400px" }}>
                <TextField
                    fullWidth
                    label="Qualification Title"
                    defaultValue={tas.qualification.title}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>

        </>
    )
}

function TASCreateComponent({ onCreateSuccess }: { onCreateSuccess?: (tas: ITAS) => void }) {
    console.log("TASCreateComponent");
    const emptyTAS: ITASCreateInput = {
        department: "",
        year: "",
        qualification: {
            code: "",
            title: ""
        }
    }
    const [tas, setTAS] = React.useState<ITASCreateInput>(emptyTAS);
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeCreateTAS] = useCreateTAS();
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const t = { ...tas };
        _.set(t, name, value);
        setTAS(t);
        console.log("handleInputChange - ", "tas", tas);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "tas", tas);
        setMutationStatus("loading");
        const _tas = {
            department: tas.department,
            year: tas.year,
            qualification: {
                code: tas.qualification.code,
                title: tas.qualification.title
            }
        };
        const result = await executeCreateTAS(_tas);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.tasCreate == null || result.data.tasCreate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.tasCreate);
                }
            }

        }
    };
    const resetForm = async () => {

        setTAS(emptyTAS);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Department"
                            name='department'
                            value={tas.department}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Year"
                            name='year'
                            value={tas.year}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Qualification Code"
                            name='qualification.code'
                            value={tas.qualification.code}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Qualification Title"
                            name='qualification.title'
                            value={tas.qualification.title}
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

export {
    TASViewAllComponent,
    TASViewOneComponent,
    TASCreateComponent
}