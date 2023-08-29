import exp from 'constants';
import { getTimeSlotString, getTimeSlotIndex } from '../timeslotUtils';

describe('timeslotUtils', () => {
    it("timeslotUtils.getTimeSlotString", () => {
        expect(getTimeSlotString(-1)).toBeUndefined();
        expect(getTimeSlotString(0)).toBe("0000-0030");
        expect(getTimeSlotString(1)).toBe("0030-0100");
        expect(getTimeSlotString(2)).toBe("0100-0130");
        expect(getTimeSlotString(3)).toBe("0130-0200");
        expect(getTimeSlotString(4)).toBe("0200-0230");
        expect(getTimeSlotString(5)).toBe("0230-0300");
        expect(getTimeSlotString(6)).toBe("0300-0330");
        expect(getTimeSlotString(7)).toBe("0330-0400");
        expect(getTimeSlotString(46)).toBe("2300-2330");
        expect(getTimeSlotString(47)).toBe("2330-2400");
        expect(getTimeSlotString(48)).toBeUndefined();
    });

    it("timeslotUtils.mapTimeSlotStrToIndex", () => {
        expect(getTimeSlotIndex("")).toBe(-1);
        expect(getTimeSlotIndex("0000-0000")).toBe(-1);
        expect(getTimeSlotIndex("0000-0001")).toBe(-1);
        expect(getTimeSlotIndex("0000-0030")).toBe(0);
        expect(getTimeSlotIndex("0030-0100")).toBe(1);
        expect(getTimeSlotIndex("0100-0130")).toBe(2);
        expect(getTimeSlotIndex("0130-0200")).toBe(3);
        expect(getTimeSlotIndex("0830-0900")).toBe(17);
        expect(getTimeSlotIndex("0900-0930")).toBe(18);
        expect(getTimeSlotIndex("0930-1000")).toBe(19);
        expect(getTimeSlotIndex("2300-2330")).toBe(46);
        expect(getTimeSlotIndex("2330-2400")).toBe(47);
    });
});