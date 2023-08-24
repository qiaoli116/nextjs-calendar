import calUtils, { MonthItem, DayItem } from './calendarUtils';
import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';

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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
            "id": "1001234567",
            "name": "Qiao Li"
        },
        room: "B1.2.05",
        timeSlots: [
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
calUtils.fillDaysWithSubject(days202307.concat(days202308).concat(days202309), sessions);



type SingleMonthComponetProps = MonthItem;

const DayItemComponent = (props: any) => {
    return (
        <Box>
            {props.children}
        </Box>
    );
}
const SingleMonthComponet = () => {
    return (
        <>
            <h1>Month component {days202307.length}</h1>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 25px)' }}>
                {days202307.map((dayItem: DayItem, index: number) => {
                    return (
                        <DayItemComponent key={index}>
                            {Number.isNaN(dayItem.day) ? "" : dayItem.day}
                        </DayItemComponent>
                    );
                })}
            </Box>
        </>

    );
};

type MultiMonthComponetProps = MonthItem[];
const MultiMonthComponet = () => {
    return (
        <>
            <h1>Month component {days202307.length}</h1>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 25px)' }}>
                {days202307.map((dayItem: DayItem, index: number) => {
                    return (
                        <DayItemComponent key={index}>
                            {Number.isNaN(dayItem.day) ? "" : dayItem.day}
                        </DayItemComponent>
                    );
                })}
            </Box>
        </>

    );
}

export {
    SingleMonthComponet
};