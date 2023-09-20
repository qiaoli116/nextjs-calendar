"use client"
import React, { useEffect } from 'react';
import { ISubject } from '../../dataService/subjects';
import { v4 as uuidv4 } from 'uuid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as _ from 'lodash';
import TASDataService from '../../dataService/tas';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import YearSelect from '../Controls/YearSelect';
import DepartmentSelect from '../Controls/DepartmentSelect';
import TASQualificationSelect from '../Controls/TASQualificationSelect';
import TASSubjectSelect from '../Controls/TASSubjectSelect';
import DeliveryModeSelect from '../Controls/DeliveryModeSelect';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import { type } from 'os';

const generateSubjectReference = () => {
    return "Subject#" + uuidv4();
}

const boxSx = {
    py: "8px"
}
interface IInitSusbjectForm {
    year: string,
    department: string,
    qualificationCode: string,
    subjectCode: string,
    numberOfSessions: number,
}
const SubjectCreateOrUpdateComponent = ({ reference, create = false, department, term }:
    { reference?: string, create?: boolean, department?: string, term?: string }) => {
    console.log("SubjectCreateOrUpdateComponent - ", "reference", reference, "create", create, "department", department, "term", term)
    const generateInitialSubject = (): ISubject => {
        return {
            reference: "",
            code: "",
            title: "",
            term: term === undefined ? "" : term,
            department: "",
            block: "",
            qualification: {
                code: "",
                title: "",
            },
            deliveryMode: "",
            dateRange: {
                startDate: "",
                endDate: "",
            },
            units: [],
            sessions: [],
        }
    }
    const currentYear = new Date().getFullYear();
    const [subject, setSubject] = React.useState<ISubject>(generateInitialSubject());
    const [initSubjectForm, setInitSubjectForm] = React.useState<IInitSusbjectForm>({
        year: currentYear.toString(),
        department: department === undefined ? "" : department,
        qualificationCode: "",
        subjectCode: "",
        numberOfSessions: 0,
    });
    const handleInputChangeInitSusbject = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChangeInitSusbject - ", "name", name, "value", value, typeof (value));
        const obj = { ...initSubjectForm };
        _.set(obj, name, value);
        setInitSubjectForm(obj);
        console.log("handleInputChangeInitSusbject - ", "initSubjectForm", initSubjectForm);
    }
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...subject };
        _.set(s, name, value);
        setSubject(s);
        console.log("handleInputChange - ", "subject", subject);
    };
    const resetForm = () => {
        console.log("resetForm called");
        setSubject(generateInitialSubject());
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subject);
        console.log("handleSubmit", JSON.stringify(subject, null, 2));

    };
    const handleSubmitInitSusbject = async (e: any) => {
        e.preventDefault();
        const tasSubjectExtended = await TASDataService.getOneSubjectExtended(initSubjectForm.year, initSubjectForm.qualificationCode, initSubjectForm.subjectCode);
        console.log("handleSubmitInitSusbject", tasSubjectExtended);
        if (tasSubjectExtended) {
            const s = generateInitialSubject();
            s.reference = generateSubjectReference();
            s.code = tasSubjectExtended.code;
            s.title = tasSubjectExtended.title;
            s.department = tasSubjectExtended.department;
            s.qualification.code = tasSubjectExtended.qualification.code;
            s.qualification.title = tasSubjectExtended.qualification.title;
            tasSubjectExtended.units.forEach((u, index) => {
                s.units[index] = {
                    code: u.code,
                    title: u.title,
                    crn: ""
                }
            });
            for (let i = 0; i < initSubjectForm.numberOfSessions; i++) {
                s.sessions[i] = {
                    date: "",
                    sessionReference: "",
                }
            }
            setSubject(s);
        }
    }

    // if year or department changes, reset qualification and subject to empty value
    useEffect(() => {
        setInitSubjectForm({ ...initSubjectForm, qualificationCode: "", subjectCode: "" })
    }, [initSubjectForm.year, initSubjectForm.department]);

    return (
        <>
            {create && (
                <form onSubmit={handleSubmitInitSusbject}>
                    <Box sx={boxSx}>
                        <YearSelect
                            sx={{ minWidth: "100px", pr: "10px" }}
                            value={initSubjectForm.year}
                            name='year'
                            onChange={handleInputChangeInitSusbject}
                        />
                        <DepartmentSelect
                            sx={{ minWidth: "200px", pr: "10px", maxWidth: "400px" }}
                            value={initSubjectForm.department}
                            name='department'
                            onChange={handleInputChangeInitSusbject}
                        />
                        <TASQualificationSelect
                            sx={{ minWidth: "200px", pr: "10px", maxWidth: "400px" }}
                            year={initSubjectForm.year}
                            department={initSubjectForm.department}
                            value={initSubjectForm.qualificationCode}
                            name='qualificationCode'
                            onChange={handleInputChangeInitSusbject}
                        />
                        <TASSubjectSelect
                            sx={{ minWidth: "200px", pr: "10px", maxWidth: "400px" }}
                            year={initSubjectForm.year}
                            qualification={initSubjectForm.qualificationCode}
                            value={initSubjectForm.subjectCode}
                            name='subjectCode'
                            onChange={handleInputChangeInitSusbject}
                        />
                    </Box>
                    <Box sx={boxSx}>
                        <Button type='submit'>
                            Create Subject
                        </Button>
                    </Box>
                </form>
            )}

            <form onSubmit={handleSubmit}>

                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "440px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject ID (Read only)"
                            name='reference'
                            value={subject.reference}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "410px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject Code - Title (Read only)"
                            value={subject.code === "" ? "" : subject.code + " - " + subject.title}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>

                </Box>
                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Term"
                            name='term'
                            value={subject.term}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Department (Read only)"
                            value={subject.department}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Qualification Code - Title (Read only)"
                            value={subject.qualification.code === "" ? "" : subject.qualification.code + " - " + subject.qualification.title}
                        />
                    </FormControl>
                </Box>

                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>

                        <TextField
                            fullWidth
                            label="Block"
                            name='block'
                            value={subject.block}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <DeliveryModeSelect
                            name='deliveryMode'
                            value={subject.deliveryMode}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            type='date'
                            label="Start Date"
                            name='dateRange.startDate'
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </FormControl>
                    <FormControl sx={{ minWidth: "200px" }}>
                        <TextField
                            fullWidth
                            type='date'
                            label="End Date"
                            name='dateRange.endDate'
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>

                </Box>

                {subject.units.map((u, index) => {
                    return (
                        <Box sx={boxSx}>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Unit ${(index + 1)} CRN`}
                                    name={`units[${index}].crn`}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "620px" }}>
                                <TextField
                                    fullWidth
                                    label="Code - Title (Read only)"
                                    value={u.code === "" ? "" : subject.units[index].code + " - " + subject.units[index].title}
                                />
                            </FormControl>
                        </Box>
                    )
                })}
                <Box sx={boxSx}>
                    <Button type='submit'>
                        Save
                    </Button>
                    <Button onClick={resetForm}>
                        Reset
                    </Button>
                </Box>
            </form>
        </>
    )
}

export {
    SubjectCreateOrUpdateComponent
}