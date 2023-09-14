import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { v4 as uuidv4 } from 'uuid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Button from '@mui/material/Button';
import TeacherSelect from '../Controls/TeacherSelect';
import RoomSelect from '../Controls/RoomSelect';

type SessionCreateForm = {
    reference: string;
    date: string;
    teacher: string | null;
    room: string | null;
    timeslots: string[];
}
const generateSessionReference = () => {
    return "Session#" + uuidv4();
}

const generateInitialSession = (): SessionCreateForm => {
    return {
        reference: generateSessionReference(),
        date: "",
        teacher: null,
        room: null,
        timeslots: [],
    }
}
const sessionInit = generateInitialSession()

const SessionCreateComponent = () => {
    const [session, setSession] = React.useState<SessionCreateForm>(sessionInit);

    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
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
    };

    return (
        <Box sx={{
            width: '500px',
        }} >
            <h1>Session Create lala</h1>
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
                    <TeacherSelect
                        value={session.teacher === null ? "" : session.teacher}
                        name="teacher"
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={{ py: "5px" }}>
                    <RoomSelect
                        value={session.room === null ? "" : session.room}
                        name="room"
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
                </Box>
            </form>
        </Box >
    )
}
export {
    SessionCreateComponent
};