'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { v4 as uuidv4 } from 'uuid';
import { RoomTypes } from '../../types';

export default function RoomTypeSelect({ value, name, onChange }: { value: string, name?: string, onChange?: (e: any) => void }) {
    const [type, setType] = React.useState("");
    const id = uuidv4();
    const selectId = "id-select-" + id;
    const labelId = "id-label-" + id;
    const handleChange = (event: SelectChangeEvent): void => {
        console.log("RoomTypeSelect handleChange", event.target.value)
        const newValue = event.target.value as string;
        setType(newValue);
        onChange && onChange({
            target: {
                name: name,
                value: newValue
            }
        });
    }
    // set the initial value of the select when finish rendering
    // otherwise, the Select and InputLable does not work very well.
    React.useEffect(() => {
        setType(value);
    }, [value]);

    return (
        <>
            <InputLabel id={labelId}>Type</InputLabel>
            <Select
                labelId={labelId}
                id={selectId}
                value={type}
                label="Type"
                onChange={handleChange}
            >

                {RoomTypes.map((type: string) => {
                    return (
                        <MenuItem key={type} value={type} >
                            {type}
                        </MenuItem>
                    );
                })}
            </Select>
        </>
    )
}