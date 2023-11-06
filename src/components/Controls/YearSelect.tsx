import React from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';

const years: string[] = ["2026", "2025", "2024", "2023", "2022", "2021"];

export default function YearSelect({ value, name, onChange, sx }:
    { value?: string, name?: string, onChange?: (e: any) => void, sx?: any }) {
    console.log("YearSelect refreshed: ", value);
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        onChange && onChange({
            target: {
                name: name,
                value: event.target.value
            }
        });
    };
    const labelId = "id-label-" + uuidv4();
    const label = "Year";
    return (
        <FormControl sx={sx === undefined ? {} : sx}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId="labelId"
                label={label}
                name={name}
                value={value}
                onChange={handleChange}
            >
                <MenuItem value=""><em>===None===</em></MenuItem>
                {years.map((year: string) => {
                    return (
                        <MenuItem key={year} value={year} >
                            {year}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )


}