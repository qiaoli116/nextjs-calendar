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
import { AlertLoading } from '../Controls/AlertBar';
import { Alert, Card, CardActions, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { ICreateSessionMutationVariables, useCreateSession, useQueryOneSession, useQuerySessions } from '../Hooks/sessions';
import CRUDLinksComponent from '../Controls/CRUDLinks';
import Link from '@mui/material/Link';
import { useSearchParams } from "next/navigation";
import { DateField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeSlotsDisplayHorizontal, TimeSlotsDisplayHorizontalBrief } from '../Controls/TimeSlotsDisplay';
import { ISessionExtended, ISubjectIndex, MutationStatus } from '@/types';


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
            maxWidth: 130,
            renderCell: (params: GridRenderCellParams<SessionViewAllComponentSingleSession, string>) => (
                <Link target="_blank" underline="hover" href={`${singleTeacherPath}/view/${params.row.teacher.orgId}`}>{`${params.row.teacher.name.last}, ${params.row.teacher.name.first}`}</Link>
            )
        },
        {
            field: 'room',
            headerName: 'Room',
            flex: 1,
            maxWidth: 130,
            renderCell: (params: GridRenderCellParams<SessionViewAllComponentSingleSession, string>) => (
                <Link target="_blank" underline="hover" href={`${singleRoomPath}/view/${params.row.room.roomNumber}`}>{params.row.room.roomNumber}</Link>
            )
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
                            <>
                                <GridToolbarContainer>
                                    <CRUDLinksComponent
                                        baseURL={singleSessionPath}
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
                <FormControl sx={{ width: "150px" }}>
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
                        defaultValue={`${session.room.roomNumber} (${session.room.type})`}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <FormControl sx={{ width: "410px", pr: "10px" }}>
                    <TextField
                        fullWidth
                        label="Teacher"
                        defaultValue={`${session.teacher.name.last}, ${session.teacher.name.first} (${session.teacher.orgId})`}
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
                return (
                    <Box sx={boxSx}>
                        <Card sx={{ width: 850 }} variant="outlined">
                            <CardContent>
                                <Typography display="inline" sx={{ mr: "10px" }} >
                                    <strong>
                                        <Link target="_blank" href={`${singleSubjectPath}/${subject.department}/${subject.term}/${subject.block}/${subject.code}`}>{subject.code} - {subject.title}</Link>
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
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <TeacherSelect
                        value={session.teacherOrgId}
                        name="teacherOrgId"
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <RoomSelect
                        value={session.roomNumber}
                        name="roomNumber"
                        onChange={handleInputChange}
                    />
                </Box>
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

// const generateSessionReference = () => {
//     return "Session." + uuidv4();
// }

// const generateInitialSession = (): ISession => {
//     return {
//         reference: generateSessionReference(),
//         date: "",
//         teacher: null,
//         room: null,
//         subjects: [],
//         timeslots: [],
//     }
// }
// const sessionInitNew = generateInitialSession();
// const sessionInitEmpty = {
//     reference: "",
//     date: "",
//     teacher: null,
//     room: null,
//     subjects: [],
//     timeslots: [],
// }

// const boxSx = {
//     py: "8px"
// }


// const SessionCreateComponent = ({ date, teacher, room, subject, createResultCallback }: {
//     date?: string,
//     teacher?: string,
//     room?: string,
//     subject?: string,
//     createResultCallback?: (session: ISession | undefined) => void,
// }) => {
//     console.log("SessionCreateComponent", date, teacher, room, subject, createResultCallback)
//     const sessionInit = {
//         ...sessionInitNew,
//         date: date === undefined ? "" : date,
//         teacher: teacher === undefined ? null : teacher,
//         room: room === undefined ? null : room,
//         subjects: subject === undefined ? [] : [subject],
//     }
//     const [session, setSession] = React.useState<ISession>(sessionInit);
//     const [loading, setLoading] = React.useState<boolean>(true);

//     // this is a general purpose handler for all input fields
//     const handleInputChange = (e: any) => {
//         const { name, value } = e.target;
//         console.log("handleInputChange - ", "name", name, "value", value);
//         const s = { ...session };
//         _.set(s, name, value);
//         setSession(s);
//         console.log("handleInputChange - ", "session", session);
//     };

//     const resetForm = () => {
//         console.log("resetForm called");
//         setSession(generateInitialSession());
//     };
//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         console.log("handleSubmit", session);
//         console.log("handleSubmit", JSON.stringify(session, null, 2));
//         const _session = await SessionsDataService.createSession(session);
//         if (createResultCallback !== undefined) {
//             console.log("handleSubmit", "createResultCallback", _session);
//             createResultCallback(_session);
//         }
//     };

//     return (
//         <Box sx={{
//             width: '100%',
//         }} >
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid xs={12}>
//                         <h1>Session create</h1>
//                     </Grid>
//                     <Grid xs={6}>
//                         <div>
//                             <Grid container spacing={2}>
//                                 <Grid xs={8}>
//                                     <Box sx={boxSx}>
//                                         <TextField
//                                             fullWidth
//                                             label="Session ID (Read only)"
//                                             value={session.reference}
//                                             name='reference'
//                                             onChange={handleInputChange}
//                                             InputProps={{
//                                                 readOnly: true,
//                                             }}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <TextField
//                                             type='date'
//                                             fullWidth
//                                             label="Date"
//                                             value={session.date}
//                                             name='date'
//                                             onChange={handleInputChange}
//                                             InputLabelProps={{
//                                                 shrink: true,
//                                             }}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <TeacherSelect
//                                             value={session.teacher === null ? "" : session.teacher}
//                                             name="teacher"
//                                             onChange={handleInputChange}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <RoomSelect
//                                             value={session.room === null ? "" : session.room}
//                                             name="room"
//                                             onChange={handleInputChange}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <Button type='submit'>
//                                             Save
//                                         </Button>
//                                         <Button onClick={resetForm}>
//                                             Reset
//                                         </Button>
//                                     </Box>
//                                 </Grid>
//                                 <Grid xs={4}>
//                                     <Box sx={boxSx}>
//                                         <TimeSlotsSelect
//                                             values={session.timeslots}
//                                             name="timeslots"
//                                             onChange={handleInputChange}
//                                         />
//                                     </Box>
//                                 </Grid>

//                             </Grid>
//                         </div>




//                     </Grid>
//                     <Grid xs={6}>
//                         <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
//                             <code>
//                                 <pre>
//                                     {JSON.stringify(session, null, 2) + ","}
//                                 </pre>
//                             </code>
//                         </Box>
//                     </Grid>
//                 </Grid>
//             </form>
//         </Box >
//     )
// }


// /**
//  * Create of update a session. Specify "create" for create, if not specified, it is update.
//  * If create is true, reference will be ignored. If create is false, reference should be specified.
//  * 
//  * @param reference - session reference, will be ignored if create is true
//  * @param create - true for create, false for update. default is false
//  *  
//  */
// const SessionUpdateComponent = ({ reference, create = false }:
//     { reference?: string, create?: boolean }) => {
//     console.log("SessionCreateOrUpdateComponent", reference, create)
//     const [session, setSession] = React.useState<ISession>(sessionInitEmpty);
//     const [loading, setLoading] = React.useState<boolean>(true);

//     React.useEffect(() => {
//         const fetchData = async () => {
//             console.log("SessionCreateOrUpdateComponent useEffect", reference);
//             if (create === true) {
//                 setSession(sessionInitNew);
//             } else { // create is false
//                 if (reference !== undefined) {
//                     const session = await SessionsDataService.getOneSessionByReference(reference);
//                     if (session !== undefined) {
//                         setSession(session);
//                     } else {
//                         setSession({ ...sessionInitEmpty, reference: reference });
//                     }
//                 } else {
//                     setSession({ ...sessionInitEmpty });
//                 }
//             }
//         };
//         fetchData();
//         setLoading(false);
//     }, []);
//     // this is a general purpose handler for all input fields
//     const handleInputChange = (e: any) => {
//         const { name, value } = e.target;
//         setSession({
//             ...session,
//             [name]: value
//         });
//     };
//     const resetForm = () => {
//         console.log("resetForm called");
//         setSession(generateInitialSession());
//     };
//     const handleSubmit = (e: any) => {
//         e.preventDefault();
//         console.log("handleSubmit", session);
//         console.log("handleSubmit", JSON.stringify(session, null, 2));

//     };

//     return (
//         <Box sx={{
//             width: '100%',
//         }} >
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid xs={12}>
//                         <h1>Session {create ? "create" : "update"}</h1>
//                     </Grid>
//                     <Grid xs={6}>
//                         <div>
//                             <Grid container spacing={2}>
//                                 <Grid xs={8}>
//                                     <Box sx={boxSx}>
//                                         <TextField
//                                             fullWidth
//                                             label="Session ID (Read only)"
//                                             value={session.reference}
//                                             name='reference'
//                                             onChange={handleInputChange}
//                                             InputProps={{
//                                                 readOnly: true,
//                                             }}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <TextField
//                                             type='date'
//                                             fullWidth
//                                             label="Date"
//                                             value={session.date}
//                                             name='date'
//                                             onChange={handleInputChange}
//                                             InputLabelProps={{
//                                                 shrink: true,
//                                             }}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <TeacherSelect
//                                             value={session.teacher === null ? "" : session.teacher}
//                                             name="teacher"
//                                             onChange={handleInputChange}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <RoomSelect
//                                             value={session.room === null ? "" : session.room}
//                                             name="room"
//                                             onChange={handleInputChange}
//                                         />
//                                     </Box>
//                                     <Box sx={boxSx}>
//                                         <Button type='submit'>
//                                             Save
//                                         </Button>
//                                         <Button onClick={resetForm}>
//                                             Reset
//                                         </Button>
//                                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                                     </Box>
//                                 </Grid>
//                                 <Grid xs={4}>
//                                     <Box sx={boxSx}>
//                                         <TimeSlotsSelect
//                                             values={session.timeslots}
//                                             name="timeslots"
//                                             onChange={handleInputChange}
//                                         />
//                                     </Box>
//                                 </Grid>

//                             </Grid>
//                         </div>




//                     </Grid>
//                     <Grid xs={6}>
//                         <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
//                             <code>
//                                 <pre>
//                                     {JSON.stringify(session, null, 2) + ","}
//                                 </pre>
//                             </code>
//                         </Box>
//                     </Grid>
//                 </Grid>
//             </form>
//         </Box >
//     )
// }
export {
    SessionViewAllComponent,
    SessionViewOneComponent,
    SessionCreateComponent,
    // SessionCreateComponent,
    // SessionUpdateComponent,
};