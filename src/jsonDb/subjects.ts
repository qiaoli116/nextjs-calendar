
// ref = term#department#block#qualificationCode-subjectCode
const subjects: any = [
    {
        "reference": "Subject.6f59b7dd-ab17-4902-8405-8939d177d147",
        "code": "ICT40120-P-01",
        "title": "Working in ICT",
        "term": "202310",
        "department": "CAIT",
        "block": "block#1234567",
        "qualification": {
            "code": "ICT40120-P",
            "title": "Certificate IV in Information Technology (Programming)"
        },
        "deliveryMode": "Blended",
        "dateRange": {
            "startDate": "2023-09-01",
            "endDate": "2023-09-30"
        },
        "units": [
            {
                "code": "ICTICT451",
                "title": "Comply with IP, ethics and privacy policies in ICT environments",
                "crn": "12345"
            },
            {
                "code": "ICTICT443",
                "title": "Work collaboratively in the ICT industry",
                "crn": "12346"
            },
            {
                "code": "BSBXCS404",
                "title": "Contribute to cyber security risk management",
                "crn": "12347"
            }
        ],
        "sessions": []
    },
];


export default subjects;
