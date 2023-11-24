"use client"
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GridRenderCellParams, DataGrid, GridColDef, GridValueGetterParams, GridToolbar, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as _ from 'lodash';
import TASDataService from '../../dataService/tas';
import { Alert, Card, CardContent, FormControl, Grid, IconButton, InputLabel, Link, MenuItem, Select, Typography } from '@mui/material';
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
import { ISubject, ISubjectCreateInput, ISubjectExtended, ISubjectIndex, ISubjectUnit, ITAS, ITASQualification, ITASSubject, TDeliveryMode } from '@/types';
import { IUpdateSubjectCRNMutationVariables, IUpdateSubjectDateRangeMutationVariables, IUpdateSubjectDeliveryModeMutationVariables, useCreateSubject, useQueryOneSubject, useQuerySubjects, useUpdateSubjectCRN, useUpdateSubjectDateRange, useUpdateSubjectDeliveryMode } from '@/components/Hooks/subjects';
import { AlertBar, AlertLoading } from '../Controls/AlertBar';
import { useSearchParams } from "next/navigation";
import { Message } from '@mui/icons-material';
import CRUDLinksComponent from '../Controls/CRUDLinks';
import dayjs from 'dayjs';
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeSlotsDisplayHorizontalBrief } from '../Controls/TimeSlotsDisplay';

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

function SubjectViewOneComponent({ subjectIndex, singleSessionPath }: { subjectIndex: ISubjectIndex, singleSessionPath: string }) {
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            label="Start (DD/MM/YYYY)"
                            defaultValue={dayjs(subject.dateRange.startDate)}
                            format='DD/MM/YYYY'
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </LocalizationProvider>

                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            label="End (DD/MM/YYYY)"
                            defaultValue={dayjs(subject.dateRange.endDate)}
                            format='DD/MM/YYYY'
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </LocalizationProvider>

                </FormControl>
            </Box>
            <Box>
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
            </Box>
            <Box sx={{ width: 850 }}>
                <h3>Sessions</h3>
                <Grid container rowSpacing={1} columnSpacing={1}>
                    {subject.sessions.map((session, sessionIndex) => {
                        return (
                            <>
                                <Grid xs={3}>
                                    <Card sx={{ width: 200 }} variant="outlined">
                                        <CardContent sx={{ pb: "14px !important" }}>
                                            <Typography sx={{ ontSize: 14 }} color="text.secondary" gutterBottom>
                                                SESSION {sessionIndex + 1} • <Link target="_blank" href={`${singleSessionPath}/view/${session.sessionId}`}>{session.sessionId.slice(-8)}</Link>
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {dayjs(session.date).format('DD/MM/YYYY')} ({session.timeslots.length / 2} hrs)
                                            </Typography>
                                            <Box sx={{ mb: "8px" }}>
                                                <TimeSlotsDisplayHorizontalBrief timeslots={session.timeslots} />
                                            </Box>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {session.teacher.name.last}, {session.teacher.name.first}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {session.room.roomNumber} ({session.room.type})
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        )
                    })}


                </Grid>

            </Box>

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

const SubjectUpdateDateRangeComponent = ({ subjectIndex, dateRangeDefault, onUpdateSuccess }: {
    subjectIndex: ISubjectIndex,
    dateRangeDefault: {
        startDate: string;
        endDate: string;
    },
    onUpdateSuccess?: (newDateRange: {
        startDate: string;
        endDate: string;
    }) => void
}) => {
    console.log("SubjectUpdateDateRangeComponent - ", "subjectIndex", subjectIndex, "dateRangeDefault", dateRangeDefault);
    const { term, department, block, code } = subjectIndex;
    const emptyDateRange = {
        startDate: "",
        endDate: "",

    };
    const [dateRange, setDateRange] = React.useState(emptyDateRange);
    const [mutationStatus, setMutationStatus] = React.useState("idle");
    const [executeUpdateSubjectDateRange] = useUpdateSubjectDateRange();
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const d = { ...dateRange };
        _.set(d, name, value);
        setDateRange(d);
        console.log("handleInputChange - ", "dateRange", dateRange);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", dateRange);
        setMutationStatus("loading");
        const mutationVariable: IUpdateSubjectDateRangeMutationVariables = {
            subjectIndex: subjectIndex,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        }

        const result = await executeUpdateSubjectDateRange(mutationVariable);
        console.log("handleSubmit - result", result);
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.subjectUpdateDateRange == null || result.data.subjectUpdateDateRange == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onUpdateSuccess) {
                    console.log("handleSubmit - onUpdateSuccess", result.data.subjectUpdateDateRange.dateRange);
                    onUpdateSuccess(result.data.subjectUpdateDateRange.dateRange);
                }
            }
        }
    }

    React.useEffect(() => {
        setDateRange(dateRangeDefault);
    }, [dateRangeDefault]);
    const resetMutationStatus = () => {
        setMutationStatus("idle");
    }
    const initStartDate = dayjs(dateRange.startDate);
    const initEndDate = dayjs(dateRange.endDate);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <FormControl sx={{ width: "200px", pr: "10px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start (DD/MM/YYYY)"
                                value={initStartDate}
                                format='DD/MM/YYYY'
                                onChange={(newDate) => {
                                    const e = {
                                        target: {
                                            name: "startDate",
                                            value: newDate === null ? "" : newDate.format('YYYY-MM-DD'),
                                        }
                                    }
                                    handleInputChange(e)
                                }}
                            />
                        </LocalizationProvider>

                    </FormControl>
                    <FormControl sx={{ width: "200px", pr: "10px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="End (DD/MM/YYYY)"
                                value={initEndDate}
                                format='DD/MM/YYYY'
                                onChange={(newDate) => {
                                    const e = {
                                        target: {
                                            name: "endDate",
                                            value: newDate === null ? "" : newDate.format('YYYY-MM-DD'),
                                        }
                                    }

                                    handleInputChange(e)
                                }}
                            />
                        </LocalizationProvider>

                    </FormControl>
                    <FormControl sx={{ pr: "10px" }}>
                        <Button type='submit' disabled={mutationStatus === "loading"}>
                            {mutationStatus === "loading" ? <>Updating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Update Date Range"}
                        </Button>
                    </FormControl>

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
                </Box>


            </form>
        </>
    )
}

const SubjectUpdateDeliveryModeComponent = ({ subjectIndex, defaultDeliveryMode, onUpdateSuccess }: {
    subjectIndex: ISubjectIndex,
    defaultDeliveryMode: TDeliveryMode,
    onUpdateSuccess?: (newDeliveryMode: TDeliveryMode) => void
}) => {
    console.log("SubjectUpdateDeliveryModeComponent - ", "subjectIndex", subjectIndex, "defaultDeliveryMode", defaultDeliveryMode);
    const { term, department, block, code } = subjectIndex;
    const emptyDeliveryMode = "";
    const [deliveryMode, setDeliveryMode] = React.useState<TDeliveryMode>(emptyDeliveryMode);
    const [mutationStatus, setMutationStatus] = React.useState("idle");
    const [executeUpdateSubjectDeliveryMode] = useUpdateSubjectDeliveryMode();
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const d = value;
        setDeliveryMode(d);
        console.log("handleInputChange - ", "deliveryMode", deliveryMode);
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", deliveryMode);
        setMutationStatus("loading");
        const mutationVariable: IUpdateSubjectDeliveryModeMutationVariables = {
            subjectIndex: subjectIndex,
            deliveryMode: deliveryMode,
        }

        const result = await executeUpdateSubjectDeliveryMode(mutationVariable);
        console.log("handleSubmit - result", result);
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.subjectUpdateDeliveryMode == null || result.data.subjectUpdateDeliveryMode == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onUpdateSuccess) {
                    console.log("handleSubmit - onUpdateSuccess", result.data.subjectUpdateDeliveryMode.deliveryMode);
                    onUpdateSuccess(result.data.subjectUpdateDeliveryMode.deliveryMode);
                }
            }
        }
    }
    React.useEffect(() => {
        setDeliveryMode(defaultDeliveryMode);
    }, [defaultDeliveryMode]);
    const resetMutationStatus = () => {
        setMutationStatus("idle");
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <FormControl sx={{ width: "200px", pr: "10px" }}>
                        <DeliveryModeSelect
                            value={deliveryMode}
                            name='deliveryMode'
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ pr: "10px" }}>
                        <Button type='submit' disabled={mutationStatus === "loading"}>
                            {mutationStatus === "loading" ? <>Updating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Update Delivery Mode"}
                        </Button>
                    </FormControl>

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
                </Box>
            </form>
        </>
    )
}

const SubjectUpdateCRNComponent = ({ subjectIndex, unitCode, defaultCRN, onUpdateSuccess }: {
    subjectIndex: ISubjectIndex,
    unitCode: string,
    defaultCRN: string,
    onUpdateSuccess?: (units: ISubjectUnit[]) => void
}) => {
    console.log("SubjectUpdateCRNComponent - ", "subjectIndex", subjectIndex, "unitCode", unitCode);
    const { term, department, block, code } = subjectIndex;
    const emptyCRN = "";
    const [crn, setCRN] = React.useState<string>(emptyCRN);
    const [mutationStatus, setMutationStatus] = React.useState("idle");
    const [executeUpdateSubjectCRN] = useUpdateSubjectCRN();
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const d = value;
        setCRN(d);
        console.log("handleInputChange - ", "crn", crn);
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", crn);
        setMutationStatus("loading");
        const mutationVariable: IUpdateSubjectCRNMutationVariables = {
            subjectIndex: subjectIndex,
            unitCode: unitCode,
            crn: crn,
        }

        const result = await executeUpdateSubjectCRN(mutationVariable);
        console.log("handleSubmit - result", result);
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.subjectUpdateCRN == null || result.data.subjectUpdateCRN == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onUpdateSuccess) {
                    console.log("handleSubmit - onUpdateSuccess", result.data.subjectUpdateCRN);
                    onUpdateSuccess(result.data.subjectUpdateCRN.units);
                }
            }
        }
    }
    React.useEffect(() => {
        setCRN(defaultCRN);
    }, [defaultCRN]);
    const resetMutationStatus = () => {
        setMutationStatus("idle");
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                    <FormControl sx={{ width: "200px", pr: "10px" }}>
                        <TextField
                            required
                            fullWidth
                            label={`CRN`}
                            value={crn}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ pr: "10px" }}>
                        <Button type='submit' disabled={mutationStatus === "loading"}>
                            {mutationStatus === "loading" ? <>Updating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Update CRN"}
                        </Button>
                    </FormControl>

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
                </Box>
            </form>
        </>
    )
}

const SubjectUpdateComponent = ({ subjectIndex }: { subjectIndex: ISubjectIndex }) => {
    const params = useSearchParams();
    const { term, department, block, code } = subjectIndex;
    const { loading, error, dataError, subject: subjectCurrent, reexecuteQuerySubject } = useQueryOneSubject(subjectIndex);
    const emptySubject: ISubjectExtended = {
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
        deliveryMode: "",
        dateRange: {
            startDate: "",
            endDate: "",
        },
        units: [],
        sessions: [],
    };

    const [subject, setSubject] = React.useState<ISubjectExtended>(emptySubject);
    React.useEffect(() => {
        if (subjectCurrent) {
            setSubject({ ...subjectCurrent });
        }
    }, [loading]);

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
                        label="Subject (Read Only)"
                        value={`${subject.code}: ${subject.title}`}
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
                        label="Qualification (Read Only)"
                        value={`${subject.qualification.code}: ${subject.qualification.title}`}
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
                        label="Department (Read Only)"
                        value={`${subject.department}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Term (Read Only)"
                        value={`${subject.term}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "270px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Block (Read Only)"
                        value={`${subject.block}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>
            <Box sx={boxSx}>
                <SubjectUpdateDeliveryModeComponent
                    subjectIndex={subjectIndex}
                    defaultDeliveryMode={subject.deliveryMode}
                    onUpdateSuccess={(newDeliveryMode) => {
                        setSubject({
                            ...subject,
                            deliveryMode: newDeliveryMode,
                        })
                    }}
                />
            </Box>
            <Box sx={boxSx}>
                <SubjectUpdateDateRangeComponent
                    subjectIndex={subjectIndex}
                    dateRangeDefault={subject.dateRange}
                    onUpdateSuccess={(newDateRange) => {
                        setSubject({
                            ...subject,
                            dateRange: newDateRange,
                        })
                    }}

                />
            </Box>

            <Box sx={boxSx}>
                {subject.units.map((unit, index) => {
                    return (
                        <Box sx={{
                            ...boxSx,
                            display: "flex",
                            flexDirection: "row",
                        }}>
                            <FormControl sx={{ width: "670px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Unit ${(index + 1)}`}
                                    value={unit.code + " - " + unit.title}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                            <SubjectUpdateCRNComponent
                                subjectIndex={subjectIndex}
                                unitCode={unit.code}
                                defaultCRN={unit.crn}
                                onUpdateSuccess={(units) => {
                                    setSubject({
                                        ...subject,
                                        units: units,
                                    })
                                }}
                            />
                        </Box>
                    )
                })}
            </Box>
            {
                params.get("debug") !== null && (
                    <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                        <code>
                            <pre>
                                {JSON.stringify(subject, null, 2) + ","}
                            </pre>
                        </code>
                    </Box>
                )
            }
        </>
    )
}
export {
    SubjectViewAllComponent,
    SubjectCreateComponent,
    SubjectViewOneComponent,
    SubjectUpdateComponent
}