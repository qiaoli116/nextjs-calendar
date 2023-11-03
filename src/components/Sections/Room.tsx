import React from 'react';
import { Alert, CircularProgress, Link, Box, AlertTitle } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import CRUDLinksComponent from '../Controls/CRUDLinks';
import { useQueryRooms, useQueryOneRoom, useCreateRoom, useUpdateRoom, useDeleteRoom } from '../Hooks/rooms';
import { IRoom } from '../../types';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { FormControl } from '@mui/material';
import { MutationStatus } from '../../types';
import _ from "lodash";
import RoomTypeSelect from '../Controls/RoomTypeSelect';

function RoomViewAllComponent({ singleRoomPath = "" }: { singleRoomPath: string }) {
    console.log("RoomViewAllComponent");
    const { loading, error, dataError, rooms, reexecuteQueryRooms } = useQueryRooms();

    if (loading) {
        return (
            <Alert severity="info">
                <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Room List ...
            </Alert>
        )
    };
    if (error) {
        return (
            <Alert severity="error">
                Failed to load room list
                <br />
                Error Message: {error.message}
            </Alert>
        )
    }
    if (dataError) {
        return (
            <Alert severity="error">
                Failed to load room list
            </Alert >
        )
    }


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Number',
            flex: 1,
            maxWidth: 130,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <strong>
                    <Link underline="hover" href={`${singleRoomPath}/view/${params.value}`}>{params.value}</Link>
                </strong>
            )
        },
        { field: 'type', headerName: 'Type', flex: 1, maxWidth: 200 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            maxWidth: 300,
            sortable: false,
            renderCell: (params: GridRenderCellParams<any, string>) => (
                <>
                    <CRUDLinksComponent
                        baseURL={singleRoomPath}
                        resourceId={params.row.id}
                        createLink={false}
                        hasText={false}
                    />

                </>
            )
        }
    ];

    const rows = rooms.map((room: IRoom) => {
        return {
            id: room.roomNumber,
            type: room.type,
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
                                        baseURL={singleRoomPath}
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


function RoomViewOneComponent({ roomNumber }: { roomNumber: string }) {
    console.log("RoomViewOneComponent");
    const { loading, error, dataError, room, reexecuteQueryRoom } = useQueryOneRoom(roomNumber);

    if (loading) {
        return (
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Room {roomNumber} ...
                </Alert>
            </>

        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load room <strong>{roomNumber}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>
        )
    }
    if (dataError || room === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{roomNumber}</strong>
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
                    defaultValue={room.roomNumber}
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
                    defaultValue={room.type}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Box>
        </>
    )
}


function RoomCreateComponent({ onCreateSuccess }: { onCreateSuccess?: (room: IRoom) => void }) {
    console.log("RoomCreateComponent");
    const emptyRoom: IRoom = {
        roomNumber: "",
        type: "Unknown",
    }
    const [room, setRoom] = React.useState<IRoom>(emptyRoom);
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");
    const [executeCreateRoom] = useCreateRoom();
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...room };
        _.set(s, name, value);
        setRoom(s);
        console.log("handleInputChange - ", "room", room);
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "teacher", room);
        setMutationStatus("loading");
        const _room = {
            roomNumber: room.roomNumber,
            type: room.type,
        };
        const result = await executeCreateRoom(_room);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.roomCreate == null || result.data.roomCreate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onCreateSuccess) {
                    onCreateSuccess(result.data.roomCreate);
                }
            }

        }
    };
    const resetForm = async () => {

        setRoom(emptyRoom);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Room Number"
                            name='roomNumber'
                            value={room.roomNumber}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ py: "8px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <RoomTypeSelect
                            name='type'
                            value={room.type}
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

function RoomUpdateComponent({ roomNumber, onUpdateSuccess }: { roomNumber: string, onUpdateSuccess?: (room: IRoom) => void }) {
    console.log("RoomUpdateComponent");
    // load the current data
    const { loading, error, dataError, room: roomCurrent, reexecuteQueryRoom } = useQueryOneRoom(roomNumber);
    const emptyRoom: IRoom = {
        roomNumber: "",
        type: "Unknown",
    };
    // create a state variable for the updated data
    const [room, setRoom] = React.useState<IRoom>(emptyRoom);
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");

    // retrieve the mutation function to be used later
    const [executeUpdateRoom] = useUpdateRoom();

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...room };
        _.set(s, name, value);
        setRoom(s);
        console.log("handleInputChange - ", "room", room);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("handleSubmit - ", "room", room);
        setMutationStatus("loading");
        const _room = {
            roomNumber: room.roomNumber,
            type: room.type,
        };
        const result = await executeUpdateRoom(_room);
        console.log("handleSubmit - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.roomUpdate == null || result.data.roomUpdate == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onUpdateSuccess) {
                    onUpdateSuccess(result.data.roomUpdate);
                }
            }

        }
    };
    const resetForm = async () => {
        reexecuteQueryRoom({ requestPolicy: 'network-only' });
        setMutationStatus("idle");
    };
    React.useEffect(() => {
        if (roomCurrent) {
            setRoom({ ...roomCurrent });
        }
    }, [loading]);

    if (loading) {
        return (
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Room {roomNumber} ...
                </Alert>
            </>
        )
    }
    if (error) {
        return (
            <Alert severity="error">
                Failed to load room <strong>{roomNumber}</strong>
                <br />
                Error Message: {error.message}
            </Alert>
        )
    }
    if (dataError || roomCurrent === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load room <strong>{roomNumber}</strong>
                </Alert>
            </>
        )
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{ pb: "20px" }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Room Number (Read Only)"
                            name="roomNumber"
                            value={room.roomNumber}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ pb: "20px", }}>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <RoomTypeSelect
                            name='type'
                            value={room.type}
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


function RoomDeleteComponent({ roomNumber, onDeleteSuccess }: { roomNumber: string, onDeleteSuccess?: (deleted: boolean) => void }) {
    console.log("TeacherUpdateComponent");
    const { loading, error, dataError, room, reexecuteQueryRoom } = useQueryOneRoom(roomNumber);
    const [executeDeleteRoom] = useDeleteRoom();
    const [mutationStatus, setMutationStatus] = React.useState<MutationStatus>("idle");

    if (loading) {
        return (
            <>
                <Alert severity="info">
                    <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;Loading Room {roomNumber} ...
                </Alert>
            </>
        )
    };
    if (error) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{roomNumber}</strong>
                    <br />
                    Error Message: {error.message}
                </Alert>
            </>

        )
    }
    if (dataError || room === null) {
        return (
            <>
                <Alert severity="error">
                    Failed to load teacher <strong>{roomNumber}</strong>
                </Alert>
            </>
        )
    }
    const deleteRoom = async () => {
        console.log("deleteRoom - ", "room", roomNumber);
        setMutationStatus("loading");
        const result = await executeDeleteRoom({ roomNumber });
        console.log("deleteTeacher - ", "result", result)
        if (!!result.error) {
            setMutationStatus("error");
        } else {
            if (result.data == null || result.data == undefined || result.data.roomDelete == null || result.data.roomDelete == undefined) {
                setMutationStatus("error");
            } else {
                setMutationStatus("success");
                if (onDeleteSuccess) {
                    onDeleteSuccess(result.data.roomDelete);
                }
            }

        }
    }
    const roomInfo = `${roomNumber} - ${room.type}`;
    return (
        <>
            {mutationStatus === "error" && <Alert severity="error">Delete Error</Alert >}
            {mutationStatus === "success" && <Alert severity="success">Delete successful ({roomInfo})</Alert >}
            {mutationStatus === "loading" || mutationStatus === "idle" ?
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    Are you sure to <u><i>permanently</i></u> delete room <strong>{roomInfo}? </strong>
                    <Button onClick={deleteRoom} disabled={mutationStatus === "loading"}>
                        {mutationStatus === "loading" ? <>Deleting&nbsp;&nbsp;<CircularProgress color="inherit" size={20} /></> : "Delete"}
                    </Button>
                </Alert>
                : ""
            }

        </>
    )
}


export {
    RoomViewAllComponent,
    RoomViewOneComponent,
    RoomCreateComponent,
    RoomUpdateComponent,
    RoomDeleteComponent
}