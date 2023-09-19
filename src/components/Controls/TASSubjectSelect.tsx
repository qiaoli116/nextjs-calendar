import React, { useState } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import TASDataService, { ITASSubject } from '../../dataService/tas';


export default function TASSubjectSelect({ year, qualification, value, name, onChange, sx }:
    { year: string, qualification: string, value?: string, name?: string, onChange?: (e: any) => void, sx?: any }) {
    const [subjects, setSubjects] = useState<ITASSubject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    console.log("TASSubjectSelect refreshed: ", year, qualification, value);
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        onChange && onChange({
            target: {
                name: name,
                value: event.target.value
            }
        });
    };
    const labelId = "id-label-" + uuidv4();
    const label = "Subjects";

    React.useEffect(() => {
        (async () => {
            const s = await TASDataService.getAllSubjectsByYearAndQualificationCode(year, qualification);
            s === undefined ? setSubjects([]) : setSubjects(s);

            setLoading(false);
        })();

    }, [year, qualification]);
    return (
        <FormControl sx={sx === undefined ? {} : sx}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId="labelId"
                label="Subject"
                name={name}
                value={value}
                onChange={handleChange}
            >
                <MenuItem value=""><em>===None===</em></MenuItem>
                {!loading && subjects.map((s) => {
                    return (
                        <MenuItem key={s.code} value={s.code} >
                            {s.code} - {s.title}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )


}