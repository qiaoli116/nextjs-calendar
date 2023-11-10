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


const SessionViewAllComponent = ({ singleSessionPath = "" }: { singleSessionPath: string }) {
    console.log("SessionViewAllComponent - singleSessionPath", singleSessionPath);
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

// const SessionViewOneComponent = ({ reference }: { reference: string }) => {
//     const [session, setSession] = React.useState<ISession | null>(null);
//     const [loading, setLoading] = React.useState<boolean>(true);
//     const [error, setError] = React.useState<boolean>(false);
//     const fetchData = async () => {
//         console.log("SessionViewOneComponent useEffect", session, loading, error);
//         const s = await SessionsDataService.getOneSessionByReference(reference);
//         if (s !== undefined) {
//             console.log("SessionViewOneComponent useEffect session fetched", s);
//             setSession({ ...s });
//         } else {
//             setError(true);
//         }
//         setLoading(false);
//     };

//     const refresh = () => {
//         setSession(null);
//         setLoading(true);
//         setError(false);
//     }

//     React.useEffect(() => {
//         fetchData();
//     }, [loading, error]);
//     if (loading) {
//         return (
//             <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
//                 <CircularProgress color="inherit" size={20} /> Loading... {reference}
//             </Box>
//         )
//     }

//     if (error) {
//         return (
//             <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
//                 <code>
//                     <pre>
//                         {`Error: Session ${reference} not found`}
//                     </pre>
//                 </code>
//             </Box>
//         )
//     }
//     return (
//         <>
//             <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
//                 <Button onClick={refresh}>
//                     refresh
//                 </Button>
//                 <code>
//                     <pre>
//                         {JSON.stringify(session, null, 2) + ","}
//                     </pre>
//                 </code>
//             </Box>
//         </>
//     )
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
    // SessionViewOneComponent,
    // SessionCreateComponent,
    // SessionUpdateComponent,
};