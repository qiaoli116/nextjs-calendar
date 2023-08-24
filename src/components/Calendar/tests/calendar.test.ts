import calUtils, { DayItem, Session } from '../calendarUtils';

describe('Calendar.getDayOfWeekForFirstDayOfMonth', () => {
    it('Calendar.getDayOfWeekForFirstDayOfMonth.TC001 - 2023/08/01 Tue', () => {
        // 2023/08/01 is Tuesday (result is 1)
        // 08 (August) is 7th month (0 - 11)
        expect(calUtils.getDayOfWeekForFirstDayOfMonth(2023, 7)).toEqual(1);
    });
    it('Calendar.getDayOfWeekForFirstDayOfMonth.TC002 - 2023/09/01 Fri', () => {
        // 2023/09/01 is Friday (result is 4)
        // 09 (September) is 8th month (0 - 11)
        expect(calUtils.getDayOfWeekForFirstDayOfMonth(2023, 8)).toEqual(4);
    });
    it('Calendar.getDayOfWeekForFirstDayOfMonth.TC003 - 2023/10/01 Sun', () => {
        // 2023/10/01 is Sunday (result is 6)
        // 10 (October) is 9th month (0 - 11)
        expect(calUtils.getDayOfWeekForFirstDayOfMonth(2023, 9)).toEqual(6);
    });
    it('Calendar.getDayOfWeekForFirstDayOfMonth.TC004 - 2023/11/01 Wed', () => {
        // 2023/11/01 is Wednesday (result is 2)
        // 11 (November) is 10th month (0 - 11)
        expect(calUtils.getDayOfWeekForFirstDayOfMonth(2023, 10)).toEqual(2);
    });

});

describe('Calendar.getNumberOfDaysInMonth', () => {
    it('Calendar.getNumberOfDaysInMonth.TC001 - 2023/01 31 days', () => {
        // 2023/08 has 31 days
        // 01 (January) is 0th month (0 - 11)
        expect(calUtils.getNumberOfDaysInMonth(2023, 0)).toEqual(31);
    });
    it('Calendar.getNumberOfDaysInMonth.TC002 - 2023/02 28 days', () => {
        // 2023/02 has 28 days
        // 02 (February) is 1st month (0 - 11)
        expect(calUtils.getNumberOfDaysInMonth(2023, 1)).toEqual(28);
    });
    it('Calendar.getNumberOfDaysInMonth.TC003 - 2023/08 31 days', () => {
        // 2023/08 has 31 days
        // 08 (August) is 7th month (0 - 11)
        expect(calUtils.getNumberOfDaysInMonth(2023, 7)).toEqual(31);
    });
    it('Calendar.getNumberOfDaysInMonth.TC004 - 2024/02 29 days', () => {
        // 2024/02 has 29 days
        // 02 (February) is 1st month (0 - 11)
        expect(calUtils.getNumberOfDaysInMonth(2024, 1)).toEqual(29);
    });
});

describe('Calendar.initMonthDays', () => {
    it('Calendar.initMonthDays.TC001 - 2023/08', () => {
        // 2023/08 has 31 days and 1st is Tuesday (1)
        // 08 (August) is 7th month (0 - 11)
        let days: DayItem[] = calUtils.initMonthDays(2023, 7);
        expect(days.length).toEqual(31 + 1);
        expect(days[0].day).toEqual(NaN);
        expect(days[1].day).toEqual(1);
        expect(days[31 + 1 - 1].day).toEqual(31);
    });
    it('Calendar.initMonthDays.TC002 - 2023/09', () => {
        // 2023/09 has 30 days and 1st is Friday (4)
        // 09 (Sepetember) is 8th month (0 - 11)
        let days: DayItem[] = calUtils.initMonthDays(2023, 8);
        expect(days.length).toEqual(30 + 4);
        expect(days[0].day).toEqual(NaN);
        expect(days[1].day).toEqual(NaN);
        expect(days[2].day).toEqual(NaN);
        expect(days[3].day).toEqual(NaN);
        expect(days[4].day).toEqual(1);
        expect(days[30 + 4 - 1].day).toEqual(30);
    });
    it('Calendar.initMonthDays.TC003 - 2023/10', () => {
        // 2023/10 has 31 days and 1st  is Sunday (result is 6)
        // 10 (October) is 9th month (0 - 11)
        let days: DayItem[] = calUtils.initMonthDays(2023, 9);
        expect(days.length).toEqual(31 + 6);
        expect(days[0].day).toEqual(NaN);
        expect(days[1].day).toEqual(NaN);
        expect(days[2].day).toEqual(NaN);
        expect(days[3].day).toEqual(NaN);
        expect(days[4].day).toEqual(NaN);
        expect(days[5].day).toEqual(NaN);
        expect(days[6].day).toEqual(1);
        expect(days[31 + 6 - 1].day).toEqual(31);
    });
    it('Calendar.initMonthDays.TC004 - 2023/11', () => {
        // 2023/11 has 30 days and 1st is Wednesday (result is 2)
        // 11 (November) is 10th month (0 - 11)
        let days: DayItem[] = calUtils.initMonthDays(2023, 10);
        expect(days.length).toEqual(30 + 2);
        expect(days[0].day).toEqual(NaN);
        expect(days[1].day).toEqual(NaN);
        expect(days[2].day).toEqual(1);
        expect(days[30 + 2 - 1].day).toEqual(30);
    });
    it('Calendar.initMonthDays.TC005 - 2024/01', () => {
        // 2024/01 has 31 days and 1st is Monday (result is 0)
        // 01 (Janurary) is 0th month (0 - 11)
        let days: DayItem[] = calUtils.initMonthDays(2024, 0);
        expect(days.length).toEqual(31 + 0);
        expect(days[0].day).toEqual(1);
        expect(days[31 + 0 - 1].day).toEqual(31);
    });
});

describe('Calendar.fillDaysWithSubject', () => {
    it('Calendar.fillDaysWithSubject.TC001 - 2023/08 with sample sessions', () => {

        // arrange
        let sessions: Session[] = [
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
        let days202307: DayItem[] = calUtils.initMonthDays(2023, 6);
        let days202308: DayItem[] = calUtils.initMonthDays(2023, 7);
        let days202309: DayItem[] = calUtils.initMonthDays(2023, 8);

        // act
        // fill days with sessions
        calUtils.fillDaysWithSubject(days202307.concat(days202308).concat(days202309), sessions);

        // asserts
        expect(days202307.length).toEqual(31 + 5);
        let date20230727: DayItem = days202307.filter((day: DayItem) => day.date === '2023-07-27')[0];
        expect(date20230727.sessions).not.toBeNull();

        expect(days202308.length).toEqual(31 + 1);
        let date20230803: DayItem = days202308.filter((day: DayItem) => day.date === '2023-08-03')[0];
        expect(date20230803.sessions).not.toBeNull();
        let date20230810: DayItem = days202308.filter((day: DayItem) => day.date === '2023-08-10')[0];
        expect(date20230810.sessions).not.toBeNull();
        let date20230817: DayItem = days202308.filter((day: DayItem) => day.date === '2023-08-17')[0];
        expect(date20230817.sessions).not.toBeNull();
        let date20230824: DayItem = days202308.filter((day: DayItem) => day.date === '2023-08-24')[0];
        expect(date20230824.sessions).not.toBeNull();
        let date20230831: DayItem = days202308.filter((day: DayItem) => day.date === '2023-08-31')[0];
        expect(date20230831.sessions).not.toBeNull();

        expect(days202309.length).toEqual(30 + 4);
        let date20230907: DayItem = days202309.filter((day: DayItem) => day.date === '2023-09-07')[0];
        expect(date20230907.sessions).not.toBeNull();
        let date20230914: DayItem = days202309.filter((day: DayItem) => day.date === '2023-09-14')[0];
        expect(date20230914.sessions).not.toBeNull();

    });


});