"use client"
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import RoomsDataService, { IRoom } from '../../dataService/rooms';
import Box from '@mui/material/Box';


// custom filter options
// search by any substring of first name, last name, orgId, or userName
const filterOptions = createFilterOptions({
    stringify: (option: IRoom) => (option.roomNum + " " + option.type),
});

export default function RoomSelect({ value, name, onChange }: { value: string, name?: string, onChange?: (e: any) => void }) {
    const [Rooms, setRooms] = React.useState<readonly IRoom[]>([]);
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly IRoom[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {

        if (!loading) {
            return undefined;
        }

        (async () => {

            const rooms = await RoomsDataService.getAllRooms();
            setRooms(rooms);
            setOptions([...rooms]);
        })();

        return () => {
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            onInputChange={(event, newInputValue) => {
                onChange && onChange({
                    target: {
                        name: name,
                        value: newInputValue
                    }
                });
            }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, value) => option.roomNum === value.roomNum}
            getOptionLabel={(option) => option.roomNum}
            renderOption={(props, option) => (
                <Box component="li" {...props}>
                    {option.roomNum} ({option.type})
                </Box>
            )}
            options={options}
            loading={loading}
            renderInput={(params) => {
                const room = Rooms.find(t => t.roomNum === value);
                return (
                    <TextField
                        {...params}
                        label="Room"
                        inputProps={{
                            ...params.inputProps,
                            value: room ? `${room.roomNum} (${room.type})` : value
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />)
            }}
        />
    );
}
