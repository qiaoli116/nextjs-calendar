
import React from 'react';
import { ISubject } from '../../dataService/subjects';
import { v4 as uuidv4 } from 'uuid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as _ from 'lodash';
import TASDataService from '../../dataService/tas';

const generateSubjectReference = () => {
    return "Subject#" + uuidv4();
}

const generateInitialSubject = (): ISubject => {
    return {
        reference: generateSubjectReference(),
        code: "",
        title: "",
        term: "",
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

const boxSx = {
    py: "8px"
}
interface IInitSusbjectForm {
    year: string,
    department: string,
    qualificationCode: string,
    subjectCode: string,

}
const SubjectCreateOrUpdateComponent = ({ reference, create = false }:
    { reference?: string, create?: boolean }) => {
    const [subject, setSubject] = React.useState<ISubject>(generateInitialSubject());
    const [initSubjectForm, setInitSubjectForm] = React.useState<IInitSusbjectForm>({
        year: "",
        department: "",
        qualificationCode: "",
        subjectCode: "",
    });
    const handleInputChangeInitSusbject = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChangeInitSusbject - ", "name", name, "value", value);
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
            const s = { ...subject };
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
            setSubject(s);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmitInitSusbject}>
                <Box sx={boxSx}>
                    <TextField
                        label="year"
                        name='year'
                        onChange={handleInputChangeInitSusbject}
                    />
                    <TextField
                        label="department"
                        name='department'
                        onChange={handleInputChangeInitSusbject}
                    />
                    <TextField
                        label="qualification"
                        name='qualificationCode'
                        onChange={handleInputChangeInitSusbject}
                    />
                    <TextField
                        label="subject"
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
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Subject ID"
                        name='reference'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Code"
                        name='code'
                        value={subject.code}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Title"
                        name='title'
                        value={subject.title}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Term"
                        name='term'
                        value={subject.term}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Department"
                        name='department'
                        value={subject.department}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Block"
                        name='block'
                        value={subject.block}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Qualification Code"
                        name='qualification.code'
                        value={subject.qualification.code}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="Qualification Title"
                        name='qualification.title'
                        value={subject.qualification.title}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Delivery Mode"
                        name='deliveryMode'
                        defaultValue={subject.deliveryMode}
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        name='dateRange.startDate'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="End Date"
                        name='dateRange.endDate'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Unit Code 1"
                        name='units[0].code'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="Unit Title 1"
                        name='units[0].title'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="Unit CRN 1"
                        name='units[0].crn'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Unit Code 2"
                        name='units[1].code'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="Unit Title 2"
                        name='units[1].title'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="Unit CRN 2"
                        name='units[1].crn'
                        onChange={handleInputChange}
                    />
                </Box>
            </form>
        </>
    )
}

export {
    SubjectCreateOrUpdateComponent
}