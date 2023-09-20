
// ref = term#department#block#qualificationCode-subjectCode
const subjects = [
    {
        reference: "subject#200de2fc-8800-4bdd-8d4e-2332e41efeee",
        code: "22603VIC-01",
        title: "Secure a PC",
        term: "202320",
        department: "CAIT",
        block: "c4-cyber-campus-feb-g1",
        qualification: {
            code: "22603VIC",
            title: "Certificate IV in Cyber Security"
        },
        deliveryMode: "Blended" as const,
        dateRange: {
            startDate: "2023-06-05",
            endDate: "2023-07-01"
        },
        units: [
            {
                crn: "18318",
                code: "VU23214",
                title: "Configure and secure networked end points"
            }
        ],
        sessions: [
        ]
    }
];


export default subjects;
