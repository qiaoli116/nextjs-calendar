"use client"
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import TeacherSelect from '../Controls/TeacherSelect';
import RoomSelect from '../Controls/RoomSelect';
import TimeSlotsSelect from '../Controls/TimeSlotsSelect';
import Grid from '@mui/material/Unstable_Grid2';
import SessionsDataService, { ISession } from "../../dataService/sessions"
import CircularProgress from '@mui/material/CircularProgress';
import _ from "lodash";
import FormControl from '@mui/material/FormControl';
import { useFetchOneById } from "../Hooks/crud";
import { AlertBar, AlertLoading } from '../Controls/AlertBar';
import { Alert, Card, CardActions, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { ICreateSessionBulkMutationVariables, ICreateSessionMutationVariables, useCreateSession, useCreateSessionsBulk, useQueryOneSession, useQuerySessions } from '../Hooks/sessions';
import CRUDLinksComponent from '../Controls/CRUDLinks';
import Link from '@mui/material/Link';
import { useSearchParams } from "next/navigation";
import { DateField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeSlotsDisplayHorizontal, TimeSlotsDisplayHorizontalBrief } from '../Controls/TimeSlotsDisplay';
import { ISessionExtended, ISubjectIndex, MutationStatus } from '@/types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const boxSx = {
    py: "8px"
}

export interface SessionViewAllComponentSingleSession {
    sessionId: string,
    date: string,
    teacher: {
        orgId: string,
        name: {
            first: string,
            last: string
        }
    },
    room: {
        roomNumber: string,
        type: string
    },
    timeslots: string[]
}

function SessionViewAllComponent({ singleSessionPath = "", singleTeacherPath = "", singleRoomPath = "" }:
    { singleSessionPath: string, singleTeacherPath: string, singleRoomPath: string }) {
    console.log("SessionViewAllComponent - singleSessionPath", singleSessionPath);
    const { loading, error, dataError, sessions, reexecuteQuerySessions } = useQuerySessions<SessionViewAllComponentSingleSession>();
    if (loading) {
        return (
            <AlertLoading
                message="Loading Sessions"
            />
        )
    }

    if (error) {
        return (
            <Alert severity="error">
                Failed to load Session list
                <br />
                Error Message: {error.message}
            </Alert>
        )

    }
    if (dataError) {
        return (
            <Alert severity="error">
                Failed to load Session list
            </Alert>
        )

    }


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID (last 8 chars)',
            flex: 1,
            maxWidth: 130,
            renderCell: (params: GridRenderCellParams<SessionViewAllComponentSingleSession, string>) => (
                <Link target="_blank" underline="hover" href={`${singleSessionPath}/view/${params.row.sessionId.toLowerCase()}`}>{`${params.row.sessionId.slice(-8)}`}</Link>
            )
        },
        { field: 'date', headerName: 'Date', flex: 1, maxWidth: 100 },
        {
            field: 'teacher',
            headerName: 'Teacher',
            flex: 1,
            maxWidth: 230,
            renderCell: (params: GridRenderCellParams<SessionViewAllComponentSingleSession, string>) => {
                if (params.row.teacher.orgId === "") {
                    return (
                        <Typography color="text.secondary" gutterBottom>
                            <i>Not assigned</i>
                        </Typography>
                    )
                }
                return (
                    <Link target="_blank" underline="hover" href={`${singleTeacherPath}/view/${params.row.teacher.orgId}`}>{`${params.row.teacher.name.last}, ${params.row.teacher.name.first}`}</Link>
                )
            }
        },
        {
            field: 'room',
            headerName: 'Room',
            flex: 1,
            maxWidth: 130,
            renderCell: (params: GridRenderCellParams<SessionViewAllComponentSingleSession, string>) => {
                if (params.row.room.roomNumber === "") {
                    return (
                        <Typography color="text.secondary" gutterBottom>
                            <i>Not assigned</i>
                        </Typography>
                    )
                }
                return (
                    <Link target="_blank" underline="hover" href={`${singleRoomPath}/view/${params.row.room.roomNumber}`}>{params.row.room.roomNumber}</Link>
                )
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            maxWidth: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <>
                    <CRUDLinksComponent
                        baseURL={singleSessionPath}
                        resourceId={params.row.id}
                        createLink={false}
                        hasText={false}
                    />
                </>
            )
        }
    ];

    const rows = sessions.map((session: SessionViewAllComponentSingleSession) => {
        return {
            id: session.sessionId.toLowerCase(),
            sessionId: session.sessionId,
            teacher: session.teacher,
            room: session.room,
            date: session.date,
            timeSlots: session.timeslots,
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
                            <Box
                                sx={{
                                    ".m-datagrid-toolbar-export button": {
                                        fontSize: "inherit!important",
                                    }
                                }}
                            >
                                <GridToolbarContainer>
                                    <CRUDLinksComponent
                                        baseURL={singleSessionPath}
                                        createLink={true}
                                        readLink={false}
                                        updateLink={false}
                                        deleteLink={false}
                                    />
                                    <GridToolbarExport
                                        className="m-datagrid-toolbar-export"

                                    />
                                    <Box sx={{ flex: '1 1 0%' }}></Box>
                                    <GridToolbarQuickFilter />

                                </GridToolbarContainer>
                            </Box>
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

const SessionViewOneComponent = ({ sessionId, singleSubjectPath, singleSessionPath }: { sessionId: string, singleSubjectPath: string, singleSessionPath: string }) => {
    console.log("SessionViewOneComponent");
    const { loading, error, dataError, session, reexecuteQuerySession } = useQueryOneSession(sessionId);
    const params = useSearchParams();
    if (loading) {
        return (
            <>
                <AlertLoading
                    message={`Loading subject ${sessionId}`}
                />
            </>
        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load session <strong>{sessionId}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>
        )
    }
    if (dataError || session === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load session <strong>{sessionId}</strong>
                </Alert>
            </>
        )
    }

    return (
        <>
            <Box sx={boxSx}>
                <FormControl sx={{ width: "660px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Session ID"
                        defaultValue={`${session.sessionId}`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "140px" }}>
                    <TextField
                        fullWidth
                        label="Length"
                        defaultValue={`${session.timeslots.length / 2} hrs`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>
            <Box sx={boxSx}>
                <FormControl sx={{ width: "150px", pr: "10px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateField
                            fullWidth
                            label="Date (DD/MM/YYYY)"
                            defaultValue={dayjs(session.date)}
                            format='DD/MM/YYYY'
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl sx={{ width: "250px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Room"
                        defaultValue={session.room.roomNumber === "" ? "Not assigned" : `${session.room.roomNumber} (${session.room.type})`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "410px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Teacher"
                        defaultValue={session.teacher.orgId === "" ? "Not assigned" : `${session.teacher.name.last}, ${session.teacher.name.first} (${session.teacher.orgId})`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
            </Box>

            <Box sx={boxSx}>
                <TimeSlotsDisplayHorizontal
                    timeslots={session.timeslots}
                />
            </Box>
            <Typography sx={{ fontSize: "16px", fontWeight: "600", mt: "10px" }}>
                {session.subjects.length == 0 && "No subject associates with this session"}
                {session.subjects.length == 1 && "1 subject associates with this session"}
                {session.subjects.length > 1 && `${session.subjects.length} subjects associate with this session`}
            </Typography>
            {session.subjects.map((subject, index) => {
                // sort the sessions by date
                subject.sessions.sort((a, b) => {
                    // Split the strings into year, month, and day components
                    const [year1, month1, day1] = a.date.split('-').map(Number);
                    const [year2, month2, day2] = b.date.split('-').map(Number);

                    // Compare the components in descending order of significance (year, month, day)
                    if (year1 !== year2) return year1 - year2;
                    if (month1 !== month2) return month1 - month2;
                    return day1 - day2;
                })
                return (
                    <Box sx={boxSx}>
                        <Card sx={{ width: 850 }} variant="outlined">
                            <CardContent>
                                <Typography display="inline" sx={{ mr: "10px" }} >
                                    <strong>
                                        <Link target="_blank" href={`${singleSubjectPath}/view/${subject.department}/${subject.term}/${subject.block}/${subject.code}`}>{subject.code} - {subject.title}</Link>
                                    </strong>
                                </Typography>
                                <Typography display="inline" sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    {subject.term}&nbsp;•&nbsp;{subject.block}&nbsp;•&nbsp;
                                    {subject.sessions.length === 0 && "No session"}
                                    {subject.sessions.length === 1 && "1 session"}
                                    {subject.sessions.length > 1 && `${subject.sessions.length} sessions`}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid container rowSpacing={1} columnSpacing={1}>

                                    {subject.sessions.map((session, sessionIndex) => {
                                        return (
                                            <>
                                                <Grid xs={3}>
                                                    <Card sx={{ width: 210 }} variant="outlined">
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
                                                                {session.teacher.orgId === "" && (<i>No teacher assigned</i>)}
                                                                {session.teacher.orgId !== "" && `${session.teacher.name.last}, ${session.teacher.name.first}`}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                                {session.room.roomNumber === "" && (<i>No room assigned</i>)}
                                                                {session.teacher.orgId !== "" && `${session.room.roomNumber}, (${session.room.type})`}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </>
                                        )
                                    })}
                                </Grid>
                            </CardActions>
                        </Card>
                    </Box>
                )
            })}

            {params.get("debug") !== null && (
                <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                    <code>
                        <pre>
                            {JSON.stringify(session, null, 2) + ","}
                        </pre>
                    </code>
                </Box>
            )}
        </>
    )
}

const SessionCreateComponent = ({
    subjectIndex,
    onCreateSuccess
}: {
    subjectIndex?: ISubjectIndex,
    onCreateSuccess?: (session: ISessionExtended) => void,
}) => {
    console.log("SessionCreateComponent", "subjectIndex", subjectIndex);
    const params = useSearchParams();
    const subjectIndexes = subjectIndex === undefined ||
        subjectIndex === null ||
        subjectIndex.code === undefined || subjectIndex.code === null || subjectIndex.code === "" ||
        subjectIndex.term === undefined || subjectIndex.term === null || subjectIndex.term === "" ||
        subjectIndex.block === undefined || subjectIndex.block === null || subjectIndex.block === "" ||
        subjectIndex.department === undefined || subjectIndex.department === null || subjectIndex.department === ""
        ? [] : [
            {
                code: subjectIndex.code,
                term: subjectIndex.term,
                block: subjectIndex.block,
                department: subjectIndex.department,
            }
        ];

    const emptySession: ICreateSessionMutationVariables = {
        date: "",
        teacherOrgId: "",
        roomNumber: "",
        timeslots: [],
        subjectIndexes: subjectIndexes,
    }
    const [session, setSession] = React.useState<ICreateSessionMutationVariables>(emptySession);
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeCreateSession] = useCreateSession();
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...session };
        _.set(s, name, value);
        setSession(s);
        console.log("handleInputChange - ", "session", session);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "session", session);
        setMutationStatus("loading");
        const _session = { ...session };
        const result = await executeCreateSession(_session);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.sessionCreate == null || result.data.sessionCreate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.sessionCreate);
                }
            }

        }
    };
    const resetMutationStatus = () => {
        setMutationStatus("idle");
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                format='DD/MM/YYYY'
                                value={session.date === "" ? undefined : dayjs(session.date)}
                                onChange={
                                    (d) => {
                                        const e = {
                                            target: {
                                                name: "date",
                                                value: d === null || d === undefined ? "" : d.format('YYYY-MM-DD'),
                                            }
                                        }
                                        handleInputChange(e)
                                    }
                                }
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Box>

                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>
                        <TeacherSelect
                            value={session.teacherOrgId}
                            name="teacherOrgId"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>

                        <RoomSelect
                            value={session.roomNumber}
                            name="roomNumber"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>
                        <TimeSlotsSelect
                            values={session.timeslots}
                            name="timeslots"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <FormControl sx={{ pr: "10px" }}>
                    <Button type='submit' disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Creating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Create"}
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

            </form>
            {
                params.get("debug") !== null && (
                    <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                        <code>
                            <pre>
                                {JSON.stringify(session, null, 2) + ","}
                            </pre>
                        </code>
                    </Box>
                )
            }
        </>
    )

}

const SessionBulkCreateComponent = ({
    subjectIndex,
    onCreateSuccess
}: {
    subjectIndex?: ISubjectIndex,
    onCreateSuccess?: (sessions: ISessionExtended[]) => void,
}) => {
    console.log("SessionBulkCreateComponent", "subjectIndex", subjectIndex);
    const params = useSearchParams();
    const subjectIndexes = subjectIndex === undefined ||
        subjectIndex === null ||
        subjectIndex.code === undefined || subjectIndex.code === null || subjectIndex.code === "" ||
        subjectIndex.term === undefined || subjectIndex.term === null || subjectIndex.term === "" ||
        subjectIndex.block === undefined || subjectIndex.block === null || subjectIndex.block === "" ||
        subjectIndex.department === undefined || subjectIndex.department === null || subjectIndex.department === ""
        ? [] : [
            {
                code: subjectIndex.code,
                term: subjectIndex.term,
                block: subjectIndex.block,
                department: subjectIndex.department,
            }
        ];

    const emptySessionBulk: ICreateSessionBulkMutationVariables = {
        dates: [],
        teacherOrgId: "",
        roomNumber: "",
        timeslots: [],
        subjectIndexes: subjectIndexes,
    }
    const [sessionBulk, setSessionBulk] = React.useState<ICreateSessionBulkMutationVariables>(emptySessionBulk);
    const [firstDate, setFirstDate] = React.useState<string>("");
    const [numberOfWeeks, setNumberOfWeeks] = React.useState<number>(1);
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeCreateSessionsBulk] = useCreateSessionsBulk();
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...sessionBulk };
        _.set(s, name, value);
        setSessionBulk(s);
        console.log("handleInputChange - ", "sessionBulk", sessionBulk);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "sessionBulk", sessionBulk);
        setMutationStatus("loading");
        const _sessionBulk = { ...sessionBulk };
        const result = await executeCreateSessionsBulk(_sessionBulk);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.sessionCreateBulk == null || result.data.sessionCreateBulk == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.sessionCreateBulk);
                }
            }

        }
    };
    const resetMutationStatus = () => {
        setMutationStatus("idle");
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="1st Session Date"
                                format='DD/MM/YYYY'
                                value={firstDate === "" ? undefined : dayjs(firstDate)}
                                onChange={
                                    (d) => {
                                        const _d = d === null || d === undefined ? "" : d.format('YYYY-MM-DD');
                                        setFirstDate(_d);
                                        const _dates = getConsectiveWeekDays(_d, numberOfWeeks);
                                        handleInputChange({
                                            target: {
                                                name: "dates",
                                                value: _dates,
                                            }

                                        })
                                    }
                                }
                            />
                        </LocalizationProvider>
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        label="Number"
                        type="number"
                        value={numberOfWeeks}
                        onChange={(e) => {
                            const _numberOfWeeks = parseInt(e.target.value);
                            setNumberOfWeeks(_numberOfWeeks);
                            const _dates = getConsectiveWeekDays(firstDate, _numberOfWeeks);
                            handleInputChange({
                                target: {
                                    name: "dates",
                                    value: _dates,
                                }
                            })
                        }}
                    />
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>
                        <TeacherSelect
                            value={sessionBulk.teacherOrgId}
                            name="teacherOrgId"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>

                        <RoomSelect
                            value={sessionBulk.roomNumber}
                            name="roomNumber"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ width: "400PX", pr: "10px" }}>
                        <TimeSlotsSelect
                            values={sessionBulk.timeslots}
                            name="timeslots"
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <FormControl sx={{ pr: "10px" }}>
                    <Button type='submit' disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Creating&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Create"}
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

            </form>
            {
                params.get("debug") !== null && (
                    <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                        <code>
                            <pre>
                                {JSON.stringify(sessionBulk, null, 2) + ","}
                            </pre>
                        </code>
                    </Box>
                )
            }
        </>
    )

}

const getConsectiveWeekDays = (startDate: string, numberOfWeeks: number): string[] => {
    let date = dayjs(startDate);
    let days: string[] = [];
    if (!date.isValid()) {
        return days;
    }

    for (let i = 0; i < numberOfWeeks; i++) {
        let newDate = date.add(i * 7, "day");
        if (newDate.isValid()) {
            days.push(newDate.format("YYYY-MM-DD"));
        }
    }
    return days;
};

export {
    SessionViewAllComponent,
    SessionViewOneComponent,
    SessionCreateComponent,
    SessionBulkCreateComponent
};