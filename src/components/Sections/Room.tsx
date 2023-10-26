import React from 'react';
import { Alert, CircularProgress, Link, Box } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import CRUDLinksComponent from '../Controls/CRUDLinks';
import { useQueryRooms, useQueryOneRoom } from '../Hooks/rooms';
import { IRoom } from '../../types';
import { TextField } from '@mui/material';

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

export {
    RoomViewAllComponent,
    RoomViewOneComponent
}