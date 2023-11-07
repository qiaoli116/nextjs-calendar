import React, { useState } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import { ITASIndex, ITASSubject } from '@/types';
import { useQueryOneTAS } from '../Hooks/tases';
import * as _ from 'lodash';

// the component take value (subject code) as a string from the parameter, 
// but return a ITASSubject object through the onChange callback.
// the subject code is traited as case insensitive.
export default function TASSubjectSelect({ tasIndex, value, name, onChange, sx }:
    { tasIndex: ITASIndex, value?: string, name?: string, onChange?: (e: any) => void, sx?: any }) {
    console.log("TASSubjectSelect refreshed: ", tasIndex, value);


    const { department, year, qualificationCode } = tasIndex;

    const labelId = "id-label-" + uuidv4();
    const label = "Subject";
    const emptySubject: ITASSubject = {
        code: "",
        title: "",
        units: []
    }
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        console.log("TASSubjectSelect handleChange: event.target.value", event.target.value);
        // case insinsitive search
        var s = _.find(subjects, function (_s) { return _s.code.toLowerCase() === event.target.value.toLowerCase(); });
        console.log("TASSubjectSelect handleChange: s find", s, subjects);
        onChange && onChange({
            target: {
                name: name,
                value: s === undefined ? emptySubject : s
            }
        });
    };
    if (department === "" || year === "" || qualificationCode === "") {
        return (
            <FormControl sx={sx === undefined ? {} : sx}>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select
                    labelId="labelId"
                    label={label}
                    name={name}
                    onChange={handleChange}
                    value="">
                    <MenuItem value=""><em>===None===</em></MenuItem>
                </Select>
            </FormControl>
        )
    }

    const [subjects, setSubjects] = useState<ITASSubject[]>([]);

    const { loading, error, dataError, tas, reexecuteQueryTAS } = useQueryOneTAS(tasIndex);



    React.useEffect(() => {
        tas === null ? setSubjects([]) : setSubjects(tas.subjects)
    }, [department, year, qualificationCode, loading]);
    return (
        <FormControl sx={sx === undefined ? {} : sx}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                required
                labelId={labelId}
                label={label}
                name={name}
                value={value ? value : ""}
                onChange={handleChange}
            >
                {loading ? (<MenuItem value=""><em>Loading...</em></MenuItem>) : (<MenuItem value=""><em>===None===</em></MenuItem>)}
                {!loading && subjects.map((s) => {
                    return (
                        <MenuItem key={s.code} value={s.code} >
                            {s.code}: {s.title}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )


}