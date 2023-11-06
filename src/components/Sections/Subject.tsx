"use client"
import React, { useEffect } from 'react';
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
import SubjectsDataService from '../../dataService/subjects';
import { CircularProgress } from '@mui/material';
import { useFetchOneById } from '../Hooks/crud';
import Modal from '@mui/material/Modal';
import { SessionCreateComponent } from './Session';
import { ISession } from '../../dataService/sessions';
import { ISubjectCreateInput } from '@/types';


const generateSubjectReference = () => {
    return "Subject." + uuidv4();
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

const TASSubjectSelectCompnent = ({ onSubmit }: {
    onSubmit?: (year: string, department: string, qualificationCode: string, subjectCode: string) => void
}
) => {
    const emptySubject = {
        year: new Date().getFullYear().toString(),
        department: "",
        qualificationCode: "",
        subjectCode: "",
    }
    const [subject, setSubject] = React.useState<{
        year: string,
        department: string,
        qualificationCode: string,
        subjectCode: string,
    }>(emptySubject);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subject);
        console.log("handleSubmit", JSON.stringify(subject, null, 2));
        if (onSubmit) {
            onSubmit(subject.year, subject.department, subject.qualificationCode, subject.subjectCode);
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <YearSelect
                        sx={{ minWidth: "100px", pr: "10px" }}
                        value={subject.year}
                        name='year'
                        onChange={handleSubmit}
                    />
                    <DepartmentSelect
                        sx={{ minWidth: "200px", pr: "10px", maxWidth: "400px" }}
                        value={subject.department}
                        name='department'
                        onChange={handleSubmit}
                    />
                    <TASQualificationSelect
                        sx={{ minWidth: "200px", pr: "10px", maxWidth: "400px" }}
                        year={subject.year}
                        department={subject.department}
                        value={subject.qualificationCode}
                        name='qualificationCode'
                        onChange={handleSubmit}
                    />
                    <TASSubjectSelect
                        sx={{ minWidth: "200px", pr: "10px", maxWidth: "400px" }}
                        year={subject.year}
                        qualification={subject.qualificationCode}
                        value={subject.subjectCode}
                        name='subjectCode'
                        onChange={handleSubmit}
                    />
                </Box>
                <Box sx={boxSx}>
                    <Button type='submit'>
                        Create Subject
                    </Button>
                </Box>
            </form>
        </>
    )
}

const SubjectCreateComponent = () => {
    console.log("SubjectCreateComponent - ")
    const emptySubjectCreateInput: ISubjectCreateInput = {
        tasIndex: {
            year: "",
            department: "",
            qualificationCode: "",
        },
        code: "",
        title: "",
        term: "",
        department: "",
        block: "",
        qualification: {
            code: "",
            title: "",
        },
        units: [],
    }

    // const currentYear = new Date().getFullYear();
    const [subjectCreateInput, setSubjectCreateInput] = React.useState<ISubjectCreateInput>(emptySubjectCreateInput);
    // const [initSubjectForm, setInitSubjectForm] = React.useState<IInitSusbjectForm>({
    //     year: currentYear.toString(),
    //     department: department === undefined ? "" : department,
    //     qualificationCode: "",
    //     subjectCode: "",
    //     numberOfSessions: 0,
    // });
    // const handleInputChangeInitSusbject = (e: any) => {
    //     const { name, value } = e.target;
    //     console.log("handleInputChangeInitSusbject - ", "name", name, "value", value, typeof (value));
    //     const obj = { ...initSubjectForm };
    //     _.set(obj, name, value);
    //     setInitSubjectForm(obj);
    //     console.log("handleInputChangeInitSusbject - ", "initSubjectForm", initSubjectForm);
    // }
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...subjectCreateInput };
        _.set(s, name, value);
        setSubjectCreateInput(s);
        console.log("handleInputChange - ", "subjectCreateInput", subjectCreateInput);
    };
    const resetForm = () => {
        console.log("resetForm called");
        setSubjectCreateInput(emptySubjectCreateInput);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subjectCreateInput);
        console.log("handleSubmit", JSON.stringify(subjectCreateInput, null, 2));

    };
    // const handleSubmitInitSusbject = async (e: any) => {
    //     e.preventDefault();
    //     const tasSubjectExtended = await TASDataService.getOneSubjectExtended(initSubjectForm.year, initSubjectForm.qualificationCode, initSubjectForm.subjectCode);
    //     console.log("handleSubmitInitSusbject", tasSubjectExtended);
    //     if (tasSubjectExtended) {
    //         const s = generateInitialSubject();
    //         s.reference = generateSubjectReference();
    //         s.code = tasSubjectExtended.code;
    //         s.title = tasSubjectExtended.title;
    //         s.department = tasSubjectExtended.department;
    //         s.qualification.code = tasSubjectExtended.qualification.code;
    //         s.qualification.title = tasSubjectExtended.qualification.title;
    //         tasSubjectExtended.units.forEach((u, index) => {
    //             s.units[index] = {
    //                 code: u.code,
    //                 title: u.title,
    //                 crn: ""
    //             }
    //         });
    //         for (let i = 0; i < initSubjectForm.numberOfSessions; i++) {
    //             s.sessions[i] = "";
    //         }
    //         setSubject(s);
    //     }
    // }

    // if year or department changes, reset qualification and subject to empty value

    // useEffect(() => {
    //     setInitSubjectForm({ ...initSubjectForm, qualificationCode: "", subjectCode: "" })
    // }, [initSubjectForm.year, initSubjectForm.department]);

    return (
        <>
            {/* <form onSubmit={handleSubmitInitSusbject}>
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
            </form> */}

            <form onSubmit={handleSubmit}>

                <Box sx={boxSx}>

                    <FormControl sx={{ minWidth: "410px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject Code - Title (Read only)"
                            value={subjectCreateInput.code === "" ? "" : subjectCreateInput.code + " - " + subjectCreateInput.title}
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
                            value={subjectCreateInput.term}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Department (Read only)"
                            value={subjectCreateInput.department}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Qualification Code - Title (Read only)"
                            value={subjectCreateInput.qualification.code === "" ? "" : subjectCreateInput.qualification.code + " - " + subjectCreateInput.qualification.title}
                        />
                    </FormControl>
                </Box>

                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Block"
                            name='block'
                            value={subjectCreateInput.block}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    {/* <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
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
                    </FormControl> */}

                </Box>

                {subjectCreateInput.units.map((unit, index) => {
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
                                    value={unit.code === "" ? "" : unit.code + " - " + unit.title}
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
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        {JSON.stringify(subjectCreateInput, null, 2) + ","}
                    </pre>
                </code>
            </Box>
        </>
    )
}

const SubjectViewOneComponent = ({ reference }: { reference: string }) => {
    // rename "item" to "subject"
    const { item: subject, loading, error, refresh } = useFetchOneById<ISubject | undefined>(reference, SubjectsDataService.getOneSubjectByReference);
    if (loading) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <CircularProgress color="inherit" size={20} /> Loading... {reference}
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        {`Error: Subject ${reference} not found`}
                    </pre>
                </code>
            </Box>
        )
    }
    return (
        <>
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <Button onClick={refresh}>
                    refresh
                </Button>
                <code>
                    <pre>
                        {JSON.stringify(subject, null, 2) + ","}
                    </pre>
                </code>
            </Box>
        </>
    )
}

const SubjectUpdateComponent = ({ reference }: { reference: string }) => {
    const { item: subjectFull, setItem: setSubjectFull, loading, error, refresh } = useFetchOneById<ISubjectFull | undefined>(reference, SubjectsDataService.getOneSubjectFullByReference);
    console.log("SubjectUpdateComponent - reference", reference)

    const [openModalCreateSession, setOpenModalCreateSession] = React.useState(false);
    const handleOpenModalCreateSession = () => setOpenModalCreateSession(true);
    const handleCloseModalCreateSession = () => setOpenModalCreateSession(false);

    const currentYear = new Date().getFullYear();
    if (loading) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <CircularProgress color="inherit" size={20} /> Loading... {reference}
            </Box>
        )
    }

    if (error || subjectFull === null || subjectFull === undefined) {
        return (
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        {`Error: subjectFull ${reference} not found`}
                    </pre>
                </code>
            </Box>
        )
    }

    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange - ", "name", name, "value", value);
        const s = { ...subjectFull };
        _.set(s, name, value);
        setSubjectFull(s);
        console.log("handleInputChange - ", "subjectFull", subjectFull);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subjectFull);
        console.log("handleSubmit", JSON.stringify(subjectFull, null, 2));
    };

    const sessionCreateCallback = (session: ISession | undefined) => {
        console.log("sessionCreateCallback - ", "session", session);
        if (session !== undefined) {
            const s = { ...subjectFull };
            //s.sessions.push(session);
            setSubjectFull(s);
        }
        handleCloseModalCreateSession();
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "440px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject ID (Read only)"
                            name='reference'
                            value={subjectFull.reference}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "410px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Subject Code - Title (Read only)"
                            value={subjectFull.code === "" ? "" : subjectFull.code + " - " + subjectFull.title}
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
                            value={subjectFull.term}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            label="Department (Read only)"
                            value={subjectFull.department}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "400px" }}>
                        <TextField
                            fullWidth
                            label="Qualification Code - Title (Read only)"
                            value={subjectFull.qualification.code === "" ? "" : subjectFull.qualification.code + " - " + subjectFull.qualification.title}
                        />
                    </FormControl>
                </Box>

                <Box sx={boxSx}>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>

                        <TextField
                            fullWidth
                            label="Block"
                            name='block'
                            value={subjectFull.block}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <DeliveryModeSelect
                            name='deliveryMode'
                            value={subjectFull.deliveryMode}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                        <TextField
                            fullWidth
                            type='date'
                            label="Start Date"
                            name='dateRange.startDate'
                            value={subjectFull.dateRange.startDate}
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
                            value={subjectFull.dateRange.endDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Box>
                {subjectFull.units.map((u, index) => {
                    return (
                        <Box sx={boxSx}>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Unit ${(index + 1)} CRN`}
                                    name={`units[${index}].crn`}
                                    value={u.crn}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "620px" }}>
                                <TextField
                                    fullWidth
                                    label="Code - Title (Read only)"
                                    value={u.code === "" ? "" : u.code + " - " + u.title}
                                />
                            </FormControl>
                        </Box>
                    )
                })}
                {subjectFull.sessions.map((s, index) => {
                    return (
                        <Box sx={boxSx}>
                            <FormControl sx={{ minWidth: "400px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Session ${(index + 1)}`}
                                    value={s.reference}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Date`}
                                    value={s.date}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ minWidth: "200px", pr: "10px" }}>
                                <TextField
                                    fullWidth
                                    label={`Teacher`}
                                    value={s.teacher}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </FormControl>
                        </Box>
                    )
                })}
                <Box sx={boxSx}>
                    <Button onClick={handleOpenModalCreateSession}>
                        + New Session
                    </Button>
                    <Button >
                        + Existing Session
                    </Button>
                </Box>
                <Box sx={boxSx}>
                    <Button type='submit'>
                        Save
                    </Button>
                    <Button onClick={refresh}>
                        Reload
                    </Button>
                </Box>
            </form>
            <Box sx={{ bgcolor: "#f0f0f0", p: "5px 20px", borderRadius: 2, fontWeight: "800" }}>
                <code>
                    <pre>
                        {JSON.stringify(subjectFull, null, 2) + ","}
                    </pre>
                </code>
            </Box>
            <div>
                <Modal
                    open={openModalCreateSession}
                    onClose={handleCloseModalCreateSession}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 1300,
                        bgcolor: 'background.paper',
                        border: '1px solid #aaa',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <SessionCreateComponent
                            subject={subjectFull.reference}
                            createResultCallback={sessionCreateCallback}
                        />
                    </Box>
                </Modal>
            </div>
        </>
    )
}
export {
    SubjectCreateComponent,
    SubjectViewOneComponent,
    SubjectUpdateComponent
}