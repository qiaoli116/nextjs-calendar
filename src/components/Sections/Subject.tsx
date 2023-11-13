"use client"
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GridRenderCellParams, DataGrid, GridColDef, GridValueGetterParams, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as _ from 'lodash';
import TASDataService from '../../dataService/tas';
import { Alert, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import YearSelect from '../Controls/YearSelect';
import DepartmentSelect from '../Controls/DepartmentSelect';
import TASQualificationSelect from '../Controls/TASQualificationSelect';
import TASSubjectSelect from '../Controls/TASSubjectSelect';
import DeliveryModeSelect from '../Controls/DeliveryModeSelect';
import SubjectsDataService from '../../dataService/subjects';
import { CircularProgress } from '@mui/material';
import { useFetchOneById } from '../Hooks/crud';
import Modal from '@mui/material/Modal';
import { ISession } from '../../dataService/sessions';
import { ISubject, ISubjectCreateInput, ISubjectIndex, ITAS, ITASQualification, ITASSubject } from '@/types';
import { useCreateSubject, useQueryOneSubject, useQuerySubjects } from '@/components/Hooks/subjects';
import { AlertBar, AlertLoading } from '../Controls/AlertBar';
import { useSearchParams } from "next/navigation";
import { Message } from '@mui/icons-material';
import CRUDLinksComponent from '../Controls/CRUDLinks';

const boxSx = {
    py: "8px"
}
function SubjectViewAllComponent({ singleSubjectPath = "" }: { singleSubjectPath: string }) {
    console.log("SubjectViewAllComponent - singleSubjectPath", singleSubjectPath);
    const { loading, error, dataError, subjects, reexecuteQuerySubjects } = useQuerySubjects();
    if (loading) {
        return (
            <AlertLoading
                message="Loading Subjects"
            />
        )
    }

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
            </Alert>
        )

    }

    const columns: GridColDef[] = [
        { field: 'department', headerName: 'Department', flex: 1, maxWidth: 100 },
        { field: 'term', headerName: 'Term', flex: 1, maxWidth: 80 },
        { field: 'block', headerName: 'Block', flex: 1, maxWidth: 150 },
        { field: 'code', headerName: 'Code', flex: 1, maxWidth: 150 },
        { field: 'title', headerName: 'Title', flex: 1, maxWidth: 400 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            maxWidth: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <>
                    <CRUDLinksComponent
                        baseURL={singleSubjectPath}
                        resourceId={params.row.id}
                        createLink={false}
                        hasText={false}
                    />
                </>
            )
        }
    ];

    const rows = subjects.map((subject: ISubject) => {
        return {
            id: `${subject.department.toLowerCase()}/${subject.term}/${subject.block.toLowerCase()}/${subject.code.toLowerCase()}`,
            department: subject.department,
            term: subject.term,
            block: subject.block,
            code: subject.code,
            title: subject.title,
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
                                        baseURL={singleSubjectPath}
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

function SubjectViewOneComponent({ subjectIndex }: { subjectIndex: ISubjectIndex }) {
    console.log("SubjectViewOneComponent");
    const { term, department, block, code } = subjectIndex;
    const { loading, error, dataError, subject, reexecuteQuerySubject } = useQueryOneSubject(subjectIndex);

    if (loading) {
        return (
            <>
                <AlertLoading
                    message={`Loading subject ${department} ${term} ${block} ${code}`}
                />
            </>

        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load subject <strong>{department} {term} {block} {code}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>
        )
    }
    if (dataError || subject === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load subject <strong>{department} {term} {block} {code}</strong>
                </Alert>
            </>
        )
    }


    return (
        <>
            <Box sx={boxSx}>
                <FormControl sx={{ width: "800px" }}>
                    <TextField
                        fullWidth
                        label="Subject"
                        defaultValue={`${subject.code}: ${subject.title}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>
            <Box sx={boxSx}>
                <FormControl sx={{ width: "800px" }}>
                    <TextField
                        fullWidth
                        label="Qualification"
                        defaultValue={`${subject.qualification.code}: ${subject.qualification.title}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>
            <Box sx={boxSx}>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Department"
                        defaultValue={`${subject.department}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Term"
                        defaultValue={`${subject.term}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Block"
                        defaultValue={`${subject.block}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>
            <Box sx={boxSx}>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Mode"
                        defaultValue={`${subject.deliveryMode}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Start"
                        defaultValue={`${subject.dateRange.startDate}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Start"
                        defaultValue={`${subject.dateRange.endDate}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>
            {subject.units.map((unit, index) => {
                return (
                    <Box sx={boxSx}>
                        <FormControl sx={{ width: "670px", pr: "10px" }}>
                            <TextField
                                fullWidth
                                label={`Unit ${(index + 1)}`}
                                defaultValue={unit.code + " - " + unit.title}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "130px" }}>
                            <TextField
                                fullWidth
                                label={`CRN`}
                                defaultValue={unit.crn}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </Box>
                )
            })}
        </>
    )
}



interface IInitSusbjectForm {
    year: string,
    department: string,
    qualification: ITASQualification,
    subject: ITASSubject,
}

const TASSubjectSelectComponent = ({ onSubmit }: {
    onSubmit?: (year: string, department: string, qualification: ITASQualification, subject: ITASSubject) => void
}
) => {
    const emptySubject = {
        year: new Date().getFullYear().toString(),
        department: "",
        qualification: {
            code: "",
            title: "",
        },
        subject: {
            code: "",
            title: "",
            units: [],
        },
    }
    const [subject, setSubject] = React.useState<IInitSusbjectForm>(emptySubject);
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...subject };
        _.set(s, name, value);
        setSubject(s);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subject);
        console.log("handleSubmit", JSON.stringify(subject, null, 2));
        if (onSubmit) {
            onSubmit(subject.year, subject.department, subject.qualification, subject.subject);
        }
    }
    // set subject.qualificaitonCode to empty when year or department changes
    useEffect(() => {
        console.log("useEffect - set qualificationCode to empty ", "subject.year", subject.year, "subject.department", subject.department)
        setSubject({
            ...subject,
            qualification: {
                code: "",
                title: "",
            },
            subject: {
                code: "",
                title: "",
                units: [],
            }
        })
    }, [subject.year, subject.department]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <YearSelect
                        sx={{ width: "200px", pr: "10px" }}
                        value={subject.year}
                        name='year'
                        onChange={handleInputChange}
                    />
                    <DepartmentSelect
                        sx={{ width: "600px" }}
                        value={subject.department}
                        name='department'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TASQualificationSelect
                        sx={{ width: "800px" }}
                        year={subject.year}
                        department={subject.department}
                        value={subject.qualification.code}
                        name='qualification'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TASSubjectSelect
                        sx={{ width: "800px" }}
                        tasIndex={{
                            year: subject.year,
                            department: subject.department,
                            qualificationCode: subject.qualification.code,
                        }}
                        value={subject.subject.code}
                        name='subject'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <Button type='submit'>
                        Select Subject
                    </Button>
                </Box>
            </form>
        </>
    )
}

const SubjectCreateComponent = ({ onCreateSuccess }: { onCreateSuccess?: (subject: ISubject) => void }) => {
    console.log("SubjectCreateComponent - ")
    const params = useSearchParams();
    const emptySubjectCreateInput: ISubjectCreateInput = {
        tasIndex: {
            year: "",
            department: "",
            qualificationCode: "",
        },
        code: "",
        title: "",
        term: "",
        department: "",
        block: "",
        qualification: {
            code: "",
            title: "",
        },
        units: [],
    }

    const [subjectCreateInput, setSubjectCreateInput] = React.useState<ISubjectCreateInput>(emptySubjectCreateInput);
    const [mutationStatus, setMutationStatus] = React.useState("idle");
    const [executeCreateSubject] = useCreateSubject();

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...subjectCreateInput };
        _.set(s, name, value);
        setSubjectCreateInput(s);
        console.log("handleInputChange - ", "subjectCreateInput", subjectCreateInput);
    };
    const resetForm = () => {
        console.log("resetForm called");
        setSubjectCreateInput(emptySubjectCreateInput);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subjectCreateInput);
        console.log("handleSubmit", JSON.stringify(subjectCreateInput, null, 2));
        setMutationStatus("loading");
        const _subject: ISubjectCreateInput = {
            tasIndex: {
                year: subjectCreateInput.tasIndex.year,
                department: subjectCreateInput.tasIndex.department,
                qualificationCode: subjectCreateInput.tasIndex.qualificationCode,
            },
            code: subjectCreateInput.code,
            title: subjectCreateInput.title,
            term: subjectCreateInput.term,
            department: subjectCreateInput.department,
            block: subjectCreateInput.block,
            qualification: {
                code: subjectCreateInput.qualification.code,
                title: subjectCreateInput.qualification.title,
            },
            units: subjectCreateInput.units.map((u) => {
                return {
                    code: u.code,
                    title: u.title,
                }
            })
        };
        const result = await executeCreateSubject(_subject);
        console.log("handleSubmit - result", result);
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.subjectCreate == null || result.data.subjectCreate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.subjectCreate);
                }
            }
        }
    };

    const tasSubjectSelectOnSubmit = (year: string, department: string, qualification: ITASQualification, subject: ITASSubject) => {
        console.log("TASSubjectSelectComponent - ", "year", year, "department", department, "qualification", qualification, "subject", subject);
        setSubjectCreateInput({
            ...subjectCreateInput,
            tasIndex: {
                year: year,
                department: department,
                qualificationCode: qualification.code,
            },
            code: subject.code,
            title: subject.title,
            department: department,
            qualification: {
                code: qualification.code,
                title: qualification.title,
            },
            units: subject.units.map((u) => {
                return {
                    code: u.code,
                    title: u.title,
                }
            })
        })
    }
    const resetMutationStatus = () => {
        setMutationStatus("idle");
    }

    return (
        <>
            <h3>Select a subject from a TAS</h3>
            <TASSubjectSelectComponent
                onSubmit={tasSubjectSelectOnSubmit}
            />
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "800px" }}>
                        <TextField
                            required
                            fullWidth
                            label="Subject Code - Title (Read only)"
                            value={subjectCreateInput.code === "" ? "" : subjectCreateInput.code + " - " + subjectCreateInput.title}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "800px" }}>
                        <TextField
                            required
                            fullWidth
                            label="Qualification Code - Title (Read only)"
                            value={subjectCreateInput.qualification.code === "" ? "" : subjectCreateInput.qualification.code + " - " + subjectCreateInput.qualification.title}
                        />
                    </FormControl>
                </Box>

                <Box sx={boxSx}>
                    <FormControl sx={{ width: "270px", pr: "10px" }}>
                        <TextField
                            required
                            fullWidth
                            label="Department (Read only)"
                            value={subjectCreateInput.department}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>

                    <FormControl sx={{ width: "270px", pr: "10px" }}>
                        <TextField
                            required
                            fullWidth
                            label="Term"
                            name='term'
                            value={subjectCreateInput.term}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ width: "270px", pr: "10px" }}>
                        <TextField
                            required
                            fullWidth
                            label="Block"
                            name='block'
                            value={subjectCreateInput.block}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                {subjectCreateInput.units.map((unit, index) => {
                    return (
                        <Box sx={boxSx}>

                            <FormControl sx={{ width: "800px" }}>
                                <TextField
                                    required
                                    fullWidth
                                    label={`Unit ${(index + 1)} (Read only)`}
                                    value={unit.code === "" ? "" : unit.code + " - " + unit.title}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                        </Box>
                    )
                })}
                <Box sx={boxSx}>
                    <Button type='submit' disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Creating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Create"}
                    </Button>
                    <Button onClick={resetForm}>
                        Reset
                    </Button>
                </Box>
                {mutationStatus === "error" &&
                    <AlertBar
                        message="Create Error"
                        severity="error"
                        onClick={resetMutationStatus}
                    />
                }
                {mutationStatus === "success" &&
                    <AlertBar
                        message="Create Success"
                        severity="success"
                        onClick={resetMutationStatus}
                    />
                }
            </form>
            {
                params.get("debug") !== null && (
                    <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                        <code>
                            <pre>
                                {JSON.stringify(subjectCreateInput, null, 2) + ","}
                            </pre>
                        </code>
                    </Box>
                )
            }
        </>
    )
}

const SubjectUpdateComponent = ({ reference }: { reference: string }) => {
    const { item: subjectFull, setItem: setSubjectFull, loading, error, refresh } = useFetchOneById<ISubjectFull | undefined>(reference, SubjectsDataService.getOneSubjectFullByReference);
    console.log("SubjectUpdateComponent - reference", reference)

    const [openModalCreateSession, setOpenModalCreateSession] = React.useState(false);
    const handleOpenModalCreateSession = () => setOpenModalCreateSession(true);
    const handleCloseModalCreateSession = () => setOpenModalCreateSession(false);

    const currentYear = new Date().getFullYear();
    if (loading) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <CircularProgress color="inherit" size={20} /> Loading... {reference}
            </Box>
        )
    }

    if (error || subjectFull === null || subjectFull === undefined) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        {`Error: subjectFull ${reference} not found`}
                    </pre>
                </code>
            </Box>
        )
    }

    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...subjectFull };
        _.set(s, name, value);
        setSubjectFull(s);
        console.log("handleInputChange - ", "subjectFull", subjectFull);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subjectFull);
        console.log("handleSubmit", JSON.stringify(subjectFull, null, 2));
    };

    const sessionCreateCallback = (session: ISession | undefined) => {
        console.log("sessionCreateCallback - ", "session", session);
        if (session !== undefined) {
            const s = { ...subjectFull };
            //s.sessions.push(session);
            setSubjectFull(s);
        }
        handleCloseModalCreateSession();
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "440px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject ID (Read only)"
                            name='reference'
                            value={subjectFull.reference}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "410px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject Code - Title (Read only)"
                            value={subjectFull.code === "" ? "" : subjectFull.code + " - " + subjectFull.title}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Term"
                            name='term'
                            value={subjectFull.term}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Department (Read only)"
                            value={subjectFull.department}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Qualification Code - Title (Read only)"
                            value={subjectFull.qualification.code === "" ? "" : subjectFull.qualification.code + " - " + subjectFull.qualification.title}
                        />
                    </FormControl>
                </Box>

                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>

                        <TextField
                            fullWidth
                            label="Block"
                            name='block'
                            value={subjectFull.block}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <DeliveryModeSelect
                            name='deliveryMode'
                            value={subjectFull.deliveryMode}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            type='date'
                            label="Start Date"
                            name='dateRange.startDate'
                            value={subjectFull.dateRange.startDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </FormControl>
                    <FormControl sx={{ minWidth: "200px" }}>
                        <TextField
                            fullWidth
                            type='date'
                            label="End Date"
                            name='dateRange.endDate'
                            value={subjectFull.dateRange.endDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Box>
                {subjectFull.units.map((u, index) => {
                    return (
                        <Box sx={boxSx}>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Unit ${(index + 1)} CRN`}
                                    name={`units[${index}].crn`}
                                    value={u.crn}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "620px" }}>
                                <TextField
                                    fullWidth
                                    label="Code - Title (Read only)"
                                    value={u.code === "" ? "" : u.code + " - " + u.title}
                                />
                            </FormControl>
                        </Box>
                    )
                })}
                {subjectFull.sessions.map((s, index) => {
                    return (
                        <Box sx={boxSx}>
                            <FormControl sx={{ minWidth: "400px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Session ${(index + 1)}`}
                                    value={s.reference}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Date`}
                                    value={s.date}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Teacher`}
                                    value={s.teacher}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                        </Box>
                    )
                })}
                <Box sx={boxSx}>
                    <Button onClick={handleOpenModalCreateSession}>
                        + New Session
                    </Button>
                    <Button >
                        + Existing Session
                    </Button>
                </Box>
                <Box sx={boxSx}>
                    <Button type='submit'>
                        Save
                    </Button>
                    <Button onClick={refresh}>
                        Reload
                    </Button>
                </Box>
            </form>
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        {JSON.stringify(subjectFull, null, 2) + ","}
                    </pre>
                </code>
            </Box>
            <div>
                <Modal
                    open={openModalCreateSession}
                    onClose={handleCloseModalCreateSession}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 1300,
                        bgcolor: 'background.paper',
                        border: '1px solid #aaa',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <SessionCreateComponent
                            subject={subjectFull.reference}
                            createResultCallback={sessionCreateCallback}
                        />
                    </Box>
                </Modal>
            </div>
        </>
    )
}
export {
    SubjectViewAllComponent,
    SubjectCreateComponent,
    SubjectViewOneComponent,
    SubjectUpdateComponent
}