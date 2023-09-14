const timeslotsOfDay = [
    "00:00-00:30", // 0
    "00:30-01:00", // 1
    "01:00-01:30", // 2
    "01:30-02:00", // 3
    "02:00-02:30", // 4
    "02:30-03:00", // 5
    "03:00-03:30", // 6
    "03:30-04:00", // 7
    "04:00-04:30", // 8
    "04:30-05:00", // 9
    "05:00-05:30", // 10
    "05:30-06:00", // 11
    "06:00-06:30", // 12
    "06:30-07:00", // 13 
    "07:00-07:30", // 14
    "07:30-08:00", // 15
    "08:00-08:30", // 16  start of day inclusive
    "08:30-09:00", // 17
    "09:00-09:30", // 18
    "09:30-10:00", // 19
    "10:00-10:30", // 20
    "10:30-11:00", // 21
    "11:00-11:30", // 22
    "11:30-12:00", // 23
    "12:00-12:30", // 24
    "12:30-13:00", // 25
    "13:00-13:30", // 26
    "13:30-14:00", // 27
    "14:00-14:30", // 28
    "14:30-15:00", // 29
    "15:00-15:30", // 30
    "15:30-16:00", // 31
    "16:00-16:30", // 32
    "16:30-17:00", // 33
    "17:00-17:30", // 34
    "17:30-18:00", // 35
    "18:00-18:30", // 36
    "18:30-19:00", // 37
    "19:00-19:30", // 38
    "19:30-20:00", // 39
    "20:00-20:30", // 40
    "20:30-21:00", // 41
    "21:00-21:30", // 42
    "21:30-22:00", // 43 
    "22:00-22:30", // 44 end of day exclusive
    "22:30-23:00", // 45
    "23:00-23:30", // 46    
    "23:30-24:00", // 47
];

const startOfDay: number = 16;
const endOfDay: number = 44;
/**
 * Returns an array of timeslot strings from start to end, inclusive.
 * 
 * @param start - index of the start of timeslot range, inclusive
 * @param end - index of the end of timeslot range, exclusive
 * @returns an array of timeslot strings
 */
const timeslotsRange = (start: number, end: number): string[] => {
    if (start < 0 || end > timeslotsOfDay.length || start > end) return [];
    return timeslotsOfDay.slice(start, end);
}


/**
 * An array of timeslot strings from start of day to end of day, inclusive.
 */
const timeslotsOfWorkDay: string[] = timeslotsRange(startOfDay, endOfDay);



/**
 * Returns the timeslot string at the given index.
 * 
 * @param slotIndex - index of the timeslot
 * @returns the timeslot string at the given index, or undefined if index is invalid
 */
const getTimeSlotString = (slotIndex: number): string | undefined => {
    if (slotIndex < 0 || slotIndex >= timeslotsOfDay.length) return undefined;
    return timeslotsOfDay[slotIndex];
}

const getTimeSlotIndex = (slotString: string): number => {
    return timeslotsOfDay.indexOf(slotString);
}


export { getTimeSlotString, getTimeSlotIndex, timeslotsRange, timeslotsOfWorkDay, timeslotsOfDay, startOfDay, endOfDay };