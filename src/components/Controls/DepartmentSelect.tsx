import React from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';

const departments: {
    name: string,
    code: string,
}[] = [
        { "name": "Business Studies", "code": "BSD" },
        { "name": "Design, Multimedia & Art", "code": "DMA" },
        { "name": "Computing & Information Technology", "code": "CAIT" },
        { "name": "Plumbing & Mechanical Services", "code": "PMS" },
        { "name": "Applied Building Technology", "code": "ABT" },
    ];

export default function DepartmentSelect({ value, name, onChange, sx }:
    { value?: string, name?: string, onChange?: (e: any) => void, sx?: any }) {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        onChange && onChange({
            target: {
                name: name,
                value: event.target.value
            }
        });
    };
    const labelId = "id-label-" + uuidv4();
    const label = "Department";
    return (
        <>
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
                    {departments.map((department) => {
                        return (
                            <MenuItem key={department.code.toLowerCase()} value={department.code.toLowerCase()} >
                                {`${department.code} (${department.name})`}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </>)


}