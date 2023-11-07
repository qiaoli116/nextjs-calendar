import React, { useState } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import TASDataService, { ITASQualification } from '../../dataService/tas';
import { useDeleteTAS, useQueryTASes, useQueryOneTAS, useCreateTAS, useCreateTASSubject, ICreateTASSubjectMutationVariables, useDeleteTASSubject, IDeleteTASSubjectMutationVariables } from '../Hooks/tases';
import * as _ from 'lodash';


const query = `
query TASES($year: String, $department: String, $qualificationCode: String) {
    tases(year: $year, department: $department, qualificationCode: $qualificationCode) {
        qualification {
            code
            title
        }
    }
}`
// the component take value (qualification code) as a string from the parameter,
// but return a ITASQualification object through the onChange callback.
// the qualification code is traited as case insensitive.
export default function TASQualificationSelect({ year, department, value, name, onChange, sx }:
    {
        year: string, department: string, value?: string, name?: string, onChange?: (e: any) => void, sx?: any
    }) {
    console.log("TASQualificationSelect refreshed: ", year, department, value);
    const labelId = "id-label-" + uuidv4();
    const label = "Qualification";
    const emptyQualification: ITASQualification = {
        code: "",
        title: "",
    }
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        console.log("TASQualificationSelect handleChange: event.target.value", event.target.value);
        var q = _.find(qualifications, function (_q) { return _q.code.toLowerCase() === event.target.value.toLowerCase(); });
        console.log("TASQualificationSelect handleChange: q find", q, qualifications);
        onChange && onChange({
            target: {
                name: name,
                value: q === undefined ? emptyQualification : q
            }
        });
    };
    if (year === "" || department === "") {
        return (
            <FormControl sx={sx === undefined ? {} : sx}>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select
                    labelId={labelId}
                    label={label}
                    name={name}
                    onChange={handleChange}
                    value="">
                    <MenuItem value=""><em>===None===</em></MenuItem>
                </Select>
            </FormControl>
        )
    }

    const { loading, error, dataError, tases, reexecuteQueryTASes } = useQueryTASes({
        queryVariables: {
            year: year,
            department: department
        },
        queryString: query
    });
    const [qualifications, setQualifications] = useState<ITASQualification[]>([]);

    React.useEffect(() => {
        console.log("TASQualificationSelect useEffect: ", year, department, value);
        setQualifications(tases.map((t) => t.qualification));
    }, [year, department, loading]);
    console.log("TASQualificationSelect qualifications: ", qualifications);
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
                {!loading && qualifications.map((q) => {
                    return (
                        <MenuItem key={q.code} value={q.code} >
                            {q.code}: {q.title}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )


}