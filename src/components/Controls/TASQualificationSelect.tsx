import React, { useState } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import TASDataService, { ITASQualification } from '../../dataService/tas';

export default function TASQualificationSelect({ year, department, value, name, onChange, sx }:
    { year: string, department: string, value?: string, name?: string, onChange?: (e: any) => void, sx?: any }) {
    const [qualifications, setQualifications] = useState<ITASQualification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    console.log("TASQualificationSelect refreshed: ", year, department, value);
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        onChange && onChange({
            target: {
                name: name,
                value: event.target.value
            }
        });
    };
    const labelId = "id-label-" + uuidv4();
    const label = "Qualification";

    React.useEffect(() => {
        console.log("TASQualificationSelect useEffect: ", year, department, value);
        (async () => {
            console.log("TASQualificationSelect useEffect: loading... ", year, department);
            const q = await TASDataService.getAllQualificationsByYearAndDepartment(year, department);
            console.log("TASQualificationSelect useEffect: q = ", q);
            q === undefined ? setQualifications([]) : setQualifications(q);

            setLoading(false);
        })();

    }, [year, department]);
    return (
        <FormControl sx={sx === undefined ? {} : sx}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId="labelId"
                label="Qualification"
                name={name}
                value={value}
                onChange={handleChange}
            >
                <MenuItem value=""><em>===None===</em></MenuItem>
                {!loading && qualifications.map((q) => {
                    return (
                        <MenuItem key={q.code.toLowerCase()} value={q.code.toLowerCase()} >
                            {q.code} - {q.title}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )


}