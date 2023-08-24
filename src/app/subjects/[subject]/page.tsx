'use client'
import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { SingleMonthComponet } from '../../../components/Calendar/calendar';

export default function SubjectSinglePage({ params }: { params: { subject: string } }) {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

    return (
        <>
            <p>something</p>
            <SingleMonthComponet />
            <Container>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="body1" gutterBottom>
                        crn single Page {params.subject}
                    </Typography>
                    <div style={{
                        fontWeight: 500,
                        paddingLeft: '24px',
                    }}>Apirl 2023</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            readOnly={true}
                            defaultValue={dayjs('2023-04-17')}
                            sx={{ '.MuiPickersCalendarHeader-root': { display: 'none' } }}
                        />
                    </LocalizationProvider>
                </Box>
            </Container >
        </>

    );
}
