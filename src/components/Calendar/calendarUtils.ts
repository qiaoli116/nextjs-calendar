

export type CRN = {
    crn: string,
    unitCode: string,
    unitTitle: string,
}

export type Teacher = {
    id: string,
    name: string,
}

export type Session = {
    date: string, // yyyy-mm-dd
    subjectCode: string,
    subjectTitle: string,
    blockCode: string,
    crns: CRN[],
    teacher: { id: string, name: string },
    room: string,
    timeslots: string[],
}

export type DayItem = {
    day: number, // 1 - 31, NaN means empty
    date: string, // yyyy-mm-dd, mm is 1 - 12, dd is 1 - 31
    sessions: Session[] | null,
}

export type MonthItem = {
    year: number,
    monthIndex: number, // 0 - 11
    days: DayItem[]
}

// calculate week day of first day of month
// Monday is 0, Sunday is 6
const getDayOfWeekForFirstDayOfMonth = (year: number, monthIndex: number): number => {
    let day = new Date(year, monthIndex, 1).getDay();
    // console.log(`getDayOfWeekForFirstDayOfMonth: ${year}-${monthIndex + 1}-1 is ${day}`);
    // day is NaN
    if (isNaN(day)) {
        return day;
    }
    // day is not NaN
    if (day === 0) {
        // Sunday
        day = 6;
    } else {
        // Monday - Saturday
        day--;
    }
    return day;
}

// monthIndex: 0 - 11
const getNumberOfDaysInMonth = (year: number, monthIndex: number): number => {
    return new Date(year, monthIndex + 1, 0).getDate();
}

const getDayString = (year: number, monthIndex: number, day: number): string => {
    const month = monthIndex + 1;
    const dayString = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    return dayString;
}

// monthIndex: 0 - 11
const initMonthDays = (year: number, monthIndex: number): DayItem[] => {
    const days: DayItem[] = [];
    const dayOfWeekForFirstDayOfMonth = getDayOfWeekForFirstDayOfMonth(year, monthIndex);
    for (let i = 0; i < dayOfWeekForFirstDayOfMonth; i++) {
        let dayItem: DayItem = { day: NaN, date: '', sessions: null };
        days.push(dayItem);
    }
    const daysInMonth = getNumberOfDaysInMonth(year, monthIndex);
    for (let i = 1; i <= daysInMonth; i++) {
        let dayItem: DayItem = { day: i, date: getDayString(year, monthIndex, i), sessions: null };
        days.push(dayItem);
    }
    return days;
}

const fillDaysWithSubject = (days: DayItem[], sessions: Session[]): void => {
    for (let i = 0; i < days.length; i++) {
        const dayItem = days[i];
        const date = dayItem.date;
        const sessionsForDate = sessions.filter(session => session.date === date);
        if (sessionsForDate.length > 0) {
            if (dayItem.sessions === null) {
                dayItem.sessions = [];
            }
            dayItem.sessions.push(sessionsForDate[0]);
        }
    }
}
const calendarUtilities = {
    getDayOfWeekForFirstDayOfMonth,
    getNumberOfDaysInMonth,
    initMonthDays,
    fillDaysWithSubject
}

export default calendarUtilities;