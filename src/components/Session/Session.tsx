import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { v4 as uuidv4 } from 'uuid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Button from '@mui/material/Button';
import TeacherSelect from '../Controls/TeacherSelect';

type SessionCreateForm = {
    reference: string;
    date: string;
    teacher: string | null;
    room: string | null;
    timeslots: string[];
    spare1: string;
}
const generateSessionReference = () => {
    return "Session#" + uuidv4();
}

const generateInitialSession = (): SessionCreateForm => {
    console.log("generateInitialSession called");
    return {
        reference: generateSessionReference(),
        date: "",
        teacher: null,
        room: null,
        timeslots: [],
        spare1: ""
    }
}
const sessionInit = generateInitialSession()

const SessionCreateComponent = () => {
    const [session, setSession] = React.useState<SessionCreateForm>(sessionInit);
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        console.log("handleInputChange", name, value);
        setSession({
            ...session,
            [name]: value
        });
    };
    const resetForm = () => {
        console.log("resetForm called");
        setSession(generateInitialSession());
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", session);
        resetForm();
    };

    return (
        <Box sx={{
            width: '500px',
        }} >
            <h1>Session Create</h1>
            <form onSubmit={handleSubmit}>
                <Box sx={{ py: "5px" }}>
                    <TextField
                        fullWidth
                        label="Session ID (Read only)"
                        value={session.reference}
                        name='reference'
                        onChange={handleInputChange}
                        disabled
                    />
                </Box>
                <Box sx={{ py: "5px" }}>
                    <TextField
                        type='date'
                        fullWidth
                        label="Date"
                        value={session.date}
                        name='date'
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
                <Box sx={{ py: "5px" }}>
                    <TextField
                        fullWidth
                        label="Teacher"
                        value={session.teacher === null ? "" : session.teacher}
                        name='teacher'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ py: "5px" }}>
                    <TextField
                        fullWidth
                        label="Room"
                        value={session.room === null ? "" : session.room}
                        name='room'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ py: "5px" }}>
                    <TeacherSelect
                        value={session.spare1}
                        name="spare1"
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ py: "5px" }}>
                    <Button type='submit'>
                        Submit
                    </Button>
                    <Button onClick={resetForm}>
                        Reset
                    </Button>
                    <Button onClick={() => { console.log(session) }}>
                        Print
                    </Button>
                </Box>

            </form>



        </Box >
    )
}
export {
    SessionCreateComponent
};