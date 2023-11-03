"use client"
import { DataGrid, GridColDef, GridValueGetterParams, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryTASes, useQueryOneTAS, useCreateTAS, useCreateTASSubject, ICreateTASSubjectMutationVariables, useDeleteTASSubject, IDeleteTASSubjectMutationVariables } from '../Hooks/tases';
import { GridRenderCellParams } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import React from 'react';
import _ from 'lodash';
import { ITAS, ITASCreateInput, ITASSubject, ITASUnit } from '../../types';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, List, ListItemButton, ListItemText, ListSubheader, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { sleep } from '../../dataService/utils';
import { MutationStatus, ITASIndex } from '@/types';
import { Alert, AlertTitle } from '@mui/material';
import CRUDLinksComponent from '../Controls/CRUDLinks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';



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

function TASSubjectCreateComponent({ tasIndex, onCreateSuccess }: { tasIndex: ITASIndex, onCreateSuccess?: (tas: ITAS) => void }) {
    console.log("TASSubjectCreateComponent");
    const emptyTASSubject: ITASSubject = {
        code: "",
        title: "",
        units: []
    };
    const [tasSubject, setTASSubject] = React.useState<ITASSubject>(emptyTASSubject);
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeCreateTASSubject] = useCreateTASSubject();

    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const t = { ...tasSubject };
        _.set(t, name, value);
        setTASSubject(t);
        console.log("handleInputChange - ", "tasSubject", tasSubject);
    };

    const handleSubmitAddUnit = async (e: any) => {
        e.preventDefault();
        console.log(e.target.code.value, e.target.title.value);
        const unit: ITASUnit = {
            code: e.target.code.value,
            title: e.target.title.value
        }
        const t = { ...tasSubject };
        t.units.push(unit);
        setTASSubject(t);
        // reset the form (is this a good way?)
        e.target.code.value = "";
        e.target.title.value = "";

    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "tasSubject", tasSubject);
        setMutationStatus("loading");
        const mutationVariable: ICreateTASSubjectMutationVariables = {
            tasIndex: {
                department: tasIndex.department,
                year: tasIndex.year,
                qualificationCode: tasIndex.qualificationCode
            },
            subjects: [tasSubject]
        };

        const result = await executeCreateTASSubject(mutationVariable);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.tasAddSubjects == null || result.data.tasAddSubjects == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.tasAddSubjects);
                    // reset the form
                    setTASSubject(emptyTASSubject);
                }
            }

        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{ py: "8px" }}>
                    <Button type='submit' disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Adding&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Add Subject"}
                    </Button>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "200px", mr: "10px" }}>
                        <TextField
                            fullWidth
                            required
                            label="Subject Code"
                            name='code'
                            value={tasSubject.code}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "580px" }}>
                        <TextField
                            fullWidth
                            required
                            label="Subject Title"
                            name='title'
                            value={tasSubject.title}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
            </form>
            {tasSubject.code == "" || tasSubject.title == "" ? "" :
                <Box sx={{ py: "8px", width: "800px" }}>
                    <Accordion
                        sx={{
                            ".Mui-expanded .m-unit": {
                                display: "none"
                            }
                        }}
                        expanded={true}
                    >
                        <AccordionSummary
                            aria-controls="panel1a-content"
                        >
                            <strong>{`${tasSubject.code}: ${tasSubject.title}`}</strong>
                        </AccordionSummary>
                        <AccordionDetails>
                            {tasSubject.units.map((unit: ITASUnit, index: number) => {
                                return (
                                    <Box sx={{
                                        width: "100%",
                                        display: 'flex',
                                        justifyContent: "space-between"

                                    }}>

                                        <Link underline="hover" target="_blank" href={`https://training.gov.au/training/details/${unit.code}`}>{`${unit.code}: ${unit.title}`}</Link>
                                        <span
                                            onClick={() => {
                                                const t = { ...tasSubject };
                                                t.units.splice(index, 1);
                                                setTASSubject(t);
                                            }}
                                        >
                                            <Link underline="hover" href="javascript:;">
                                                <DeleteIcon sx={{ mb: "-4px" }} />
                                            </Link>
                                        </span>
                                    </Box>
                                )
                            })}
                            <form onSubmit={handleSubmitAddUnit}>
                                <Box sx={{ py: "8px" }}>
                                    <FormControl sx={{ minWidth: "200px", mr: "10px" }}>
                                        <TextField
                                            fullWidth
                                            label="Unit Code"
                                            name='code'
                                        />
                                    </FormControl>
                                    <FormControl sx={{ minWidth: "440px" }}>
                                        <TextField
                                            fullWidth
                                            label="Unit Title"
                                            name='title'
                                        />
                                    </FormControl>
                                    <Button type='submit' disabled={mutationStatus === "loading"}>
                                        Add Unit
                                    </Button>
                                </Box>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                </Box >
            }
            {mutationStatus === "error" && <Alert severity="error">Add Error</Alert >
            }
            {mutationStatus === "success" && <Alert severity="success">Add successful</Alert >}
        </>
    )

}

function TASSubjectDeleteComponent({ tasIndex, subjectCode, onDeleteSuccess }: { tasIndex: ITASIndex, subjectCode: string, onDeleteSuccess?: (tas: ITAS) => void }) {
    console.log("TASSubjectDeleteComponent");
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeDeleteTASSubject] = useDeleteTASSubject();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "tasIndex", tasIndex);
        setMutationStatus("loading");
        const mutationVariable: IDeleteTASSubjectMutationVariables = {
            tasIndex: {
                department: tasIndex.department,
                year: tasIndex.year,
                qualificationCode: tasIndex.qualificationCode
            },
            subjectCodes: [subjectCode]
        };

        const result = await executeDeleteTASSubject(mutationVariable);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.tasDeleteSubjects == null || result.data.tasDeleteSubjects == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onDeleteSuccess) {
                    onDeleteSuccess(result.data.tasDeleteSubjects);
                }
            }

        }
    };
    return (
        <>
            <Box sx={{ py: "8px" }}>
                <Button>
                    Delete
                </Button>
            </Box>
        </>
    )
}

function TASUpdateComponent({ tasIndex }: { tasIndex: ITASIndex }) {
    console.log("TASUpdateComponent");
    const { department, year, qualificationCode } = tasIndex;
    const { loading, error, dataError, tas: tasCurrent, reexecuteQueryTAS } = useQueryOneTAS(department, year, qualificationCode);
    const emptyTAS: ITAS = {
        department: "",
        year: "",
        qualification: {
            code: "",
            title: ""
        },
        subjects: [] as ITASSubject[]
    }

    const [tas, setTAS] = React.useState<ITAS>(emptyTAS);

    // to set the tas state whenever the query is executed
    React.useEffect(() => {
        if (tasCurrent) {
            setTAS({ ...tasCurrent });
        }
    }, [loading]);

    if (loading) {
        return (
            <Alert severity="info">
                <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading TAS {department.toUpperCase()} {year} {qualificationCode.toUpperCase()} ...
            </Alert>
        )
    };
    if (error) {
        return (
            <Alert severity="error">
                Failed to load TAS <strong>{department.toUpperCase()} {year} {qualificationCode.toUpperCase()}</strong>
                <br />
                Error Message: {error.message}
            </Alert>
        )
    }
    if (dataError || tas === null) {
        return (
            <Alert severity="error">
                Failed to load TAS <strong>{department.toUpperCase()} {year} {qualificationCode.toUpperCase()}</strong>
            </Alert>
        )
    }
    return (
        <>
            <Box>
                <Box sx={{ pb: "20px", width: "800px" }}>
                    <TextField
                        fullWidth
                        label="Department (Read Only)"
                        value={tas.department}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ pb: "20px", width: "800px" }}>

                    <TextField
                        fullWidth
                        label="Year (Read Only)"
                        value={tas.year}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ pb: "20px", width: "800px" }}>
                    <TextField
                        fullWidth
                        label="Qualification Code (Read Only)"
                        value={tas.qualification.code}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ width: "800px" }}>
                    <TextField
                        fullWidth
                        label="Qualification Title (Read Only)"
                        value={tas.qualification.title}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box sx={{ pb: "20px", width: "800px" }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                        >
                            <p><strong>Subjects List ({tas.subjects.length} subject included)</strong></p>
                        </AccordionSummary>
                        <AccordionDetails>

                            {tas.subjects.map((subject: ITASSubject, index: number) => {
                                return (
                                    <>
                                        <Accordion
                                            sx={{
                                                ".Mui-expanded .m-unit": {
                                                    display: "none"
                                                }
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                            >
                                                <Box sx={{
                                                    width: "100%",
                                                    display: 'flex',
                                                    justifyContent: "space-between"

                                                }}>
                                                    <Box>{`${index + 1}. ${subject.code}: ${subject.title}`}</Box>
                                                    <Box className="m-unit">
                                                        {subject.units.map((unit: ITASUnit, index: number) => {
                                                            return (
                                                                <>
                                                                    <Box component="span" sx={{ mr: "5px", fontSize: "12px" }}>
                                                                        <i>
                                                                            <Link underline="hover" target="_blank" href={`https://training.gov.au/training/details/${unit.code}`}>{`${unit.code}`}</Link>
                                                                        </i>
                                                                    </Box>
                                                                </>
                                                            )
                                                        })}
                                                    </Box>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {subject.units.map((unit: ITASUnit, index: number) => {
                                                    return (
                                                        <div><Link underline="hover" target="_blank" href={`https://training.gov.au/training/details/${unit.code}`}>{`${unit.code}: ${unit.title}`}</Link></div>
                                                    )
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                    </>
                                )
                            })}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
            <Box>
                <TASSubjectCreateComponent
                    tasIndex={tasIndex}
                    onCreateSuccess={(tas: ITAS) => {
                        console.log("onCreateSuccess", tas);
                        setTAS(tas);
                    }}
                />
            </Box>
        </>
    )
}

export {
    TASViewAllComponent,
    TASViewOneComponent,
    TASCreateComponent,
    TASSubjectCreateComponent,
    TASUpdateComponent
};