
const subjectsBlended: any = [
    {
        term: "202320",
        department: "CAIT",
        block: "c4-cyber-campus-feb-g1",
        qualification: {
            code: "22603VIC",
            title: "Certificate IV in Cyber Security"
        },
        deliveryMode: "Blended",
        dateRange: {
            startDate: "2023-06-05",
            endDate: "2023-07-01"
        },
        subject: {
            code: "22603VIC-01",
            title: "Secure a PC"
        },
        units: [
            {
                code: "VU23214",
                title: "Configure and secure networked end points"
            }
        ],
        sessions: [
            {
                date: "2023-06-05",
                teacher: {
                    id: "1001111111",
                    name: "Qiao Li"
                },
                room: "B1.2.07",
                timeslots: [
                    "0900-0930",
                    "0930-1000",
                    "1000-1030",
                    "1030-1100",
                    "1100-1130",
                    "1130-1200"
                ],
            },
            {
                date: "2023-06-12",
                teacher: {
                    id: "1001111111",
                    name: "Qiao Li"
                },
                room: "B1.2.07",
                timeslots: [
                    "0900-0930",
                    "0930-1000",
                    "1000-1030",
                    "1030-1100",
                    "1100-1130",
                    "1130-1200"
                ],
            },
            {
                date: "2023-06-19",
                teacher: {
                    id: "1001111111",
                    name: "Qiao Li"
                },
                room: "B1.2.07",
                timeslots: [
                    "0900-0930",
                    "0930-1000",
                    "1000-1030",
                    "1030-1100",
                    "1100-1130",
                    "1130-1200"
                ],
            },
            {
                date: "2023-06-26",
                teacher: {
                    id: "1001111111",
                    name: "Qiao Li"
                },
                room: "B1.2.07",
                timeslots: [
                    "0900-0930",
                    "0930-1000",
                    "1000-1030",
                    "1030-1100",
                    "1100-1130",
                    "1130-1200"
                ],
            },
        ]
    }

];
const subjectsOnline: any = [
    {
        term: "202320",
        department: "CAIT",
        block: "c4-cyber-online-feb",
        qualification: {
            code: "22603VIC",
            title: "Certificate IV in Cyber Security"
        },
        deliveryMode: "Online",
        dateRange: {
            startDate: "2023-06-05",
            endDate: "2023-07-30"
        },
        subject: {
            code: "22603VIC-01",
            title: "Secure a PC"
        },
        units: [
            {
                code: "VU23214",
                title: "Configure and secure networked end points"
            }
        ],
        teachers: [
            {
                id: "1001111111",
                name: "Qiao Li"
            },
            {
                id: "1001111112",
                name: "John Smith"
            }
        ]
    }
]

const generalSupport: any = [
    {
        term: "202320",
        department: "CAIT",
        teacher: {
            id: "1001111111",
            name: "Qiao Li"
        },
        qualification: {
            code: "22603VIC",
            title: "Certificate IV in Cyber Security"
        },
        subject: {
            code: "22603VIC-01",
            title: "Secure a PC"
        },
        units: [
            {
                code: "VU23214",
                title: "Configure and secure networked end points"
            }
        ]
    }
]


export default { subjectsBlended };
