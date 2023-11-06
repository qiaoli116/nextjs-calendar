import React, { useState } from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { v4 as uuidv4 } from 'uuid';
import TASDataService, { ITASQualification } from '../../dataService/tas';
import { useDeleteTAS, useQueryTASes, useQueryOneTAS, useCreateTAS, useCreateTASSubject, ICreateTASSubjectMutationVariables, useDeleteTASSubject, IDeleteTASSubjectMutationVariables } from '../Hooks/tases';


const query = `
query TASES($year: String, $department: String, $qualificationCode: String) {
    tases(year: $year, department: $department, qualificationCode: $qualificationCode) {
        qualification {
            code
            title
        }
    }
}`
export default function TASQualificationSelect({ year, department, value, name, onChange, sx }:
    {
        year: string, department: string, value?: string, name?: string, onChange?: (e: any) => void, sx?: any
    }) {
    console.log("TASQualificationSelect refreshed: ", year, department, value);
    const labelId = "id-label-" + uuidv4();
    const label = "Qualification";

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        onChange && onChange({
            target: {
                name: name,
                value: event.target.value
            }
        });
    };
    if (year === "" || department === "") {
        return (
            <FormControl sx={sx === undefined ? {} : sx}>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select
                    labelId="labelId"
                    label="Qualification"
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
                labelId="labelId"
                label="Qualification"
                name={name}
                value={value}
                onChange={handleChange}
            >
                {loading ? (<MenuItem value=""><em>Loading...</em></MenuItem>) : (<MenuItem value=""><em>===None===</em></MenuItem>)}
                {!loading && qualifications.map((q) => {
                    return (
                        <MenuItem key={q.code.toLowerCase()} value={q.code.toLowerCase()} >
                            {q.code}: {q.title}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )


}