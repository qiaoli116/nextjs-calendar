"use client"

import { FilterComponet } from "../../../../../../components/Calendar/calendar";
import { SessionCreateComponent } from "../../../../../../components/Session/Session";
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


export default function BlocksPage({ params }: { params: { termCode: string, department: string } }) {
    return (
        <>
            <h1>Blocks Page</h1>
            <p>Term Code: {params.termCode}</p>
            <p>Department: {params.department}</p>
            <FilterComponet
                sessions={sessions}
            />
            <SessionCreateComponent />
        </>
    )
}