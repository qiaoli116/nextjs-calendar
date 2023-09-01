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
import { SingleMonthComponet, SingleDayComponet } from '../../../components/Calendar/calendar';

import calUtils, { MonthItem, DayItem } from '../../../components/Calendar/calendarUtils';

const sessions = [
    {
        date: "2023-07-27",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1001111111",
            "name": "Qiao Li 1"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-08-03",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1002222222",
            "name": "Qiao Li 2"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-08-10",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1001111111",
            "name": "Qiao Li 1"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-08-17",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1003333333",
            "name": "Qiao Li 3"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-08-24",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1001111111",
            "name": "Qiao Li 1"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-08-31",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1002222222",
            "name": "Qiao Li 2"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-09-07",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "1004444444",
            "name": "Qiao Li 4"
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    },
    {
        date: "2023-09-14",
        subjectCode: "S03",
        subjectTitle: "Expose website security vulnerabilities",
        blockCode: "1",
        crns: [
            {
                "crn": "18318",
                "unitCode": "VU23214",
                "unitTitle": "Expose website security vulnerabilities"
            }
        ],
        teacher: {
            "id": "",
            "name": ""
        },
        room: "B1.2.05",
        timeslots: [
            "0900-0930",
            "0930-1000",
            "1000-1030",
            "1030-1100",
            "1100-1130",
            "1130-1200"
        ]
    }
];

// create days for 2023/07, 2023/08, 2023/09
const days202307: DayItem[] = calUtils.initMonthDays(2023, 6);
const days202308: DayItem[] = calUtils.initMonthDays(2023, 7);
const days202309: DayItem[] = calUtils.initMonthDays(2023, 8);

// act
// fill days with sessions
calUtils.fillDaysWithSessions(days202307.concat(days202308).concat(days202309), sessions);

export default function SubjectSinglePage({ params }: { params: { subject: string } }) {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

    return (
        <>
            <Box><Typography variant='lable' sx={{ pl: "5px" }}>CRN</Typography><Typography variant='value'>12345</Typography></Box>
            <SingleDayComponet sessions={sessions} />
            <SingleMonthComponet year={2023} monthIndex={6} days={days202307} />
            <SingleMonthComponet year={2023} monthIndex={7} days={days202308} />
            <SingleMonthComponet year={2023} monthIndex={8} days={days202309} />
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
