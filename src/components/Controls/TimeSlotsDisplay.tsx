import { Box } from '@mui/material';
import { getTimeslotsOfWorkDayDict, timeslotsRange } from '../Calendar/timeslotUtils';
import { time } from 'console';
import { blue, grey } from '@mui/material/colors';


function TimeSlotsDisplayHorizontal({ timeslots }: { timeslots: string[] } = { timeslots: [] }) {
    const SlotBox = ({ occupied }: { occupied: boolean }) => {
        const bgcolor = occupied ? blue[700] : grey[400];
        return (
            <Box
                sx={{
                    height: "60px",
                    width: "25px",
                    mx: "2px",
                    bgcolor: bgcolor,
                    border: `1px solid ${grey[400]}`,
                }}
            ></Box>
        )
    }
    const LabelBox = ({ label }: { label: string }) => {
        return (
            <Box
                sx={{
                    height: "10px",
                    width: "25px",
                    mx: "2px",
                    borderLeft: (label !== "") ? `1px solid ${grey[400]}` : `0px solid ${grey[400]}`,
                    borderRight: (label !== "") ? `0px solid ${grey[400]}` : `1px solid ${grey[400]}`,
                    fontSize: "12px",
                    pl: "11px",
                }}

            >
                {label}
            </Box>
        )
    }
    const timeslotsOfWorkDayDict = getTimeslotsOfWorkDayDict(timeslots);
    console.log("TimeSlotsDisplay values: ", timeslots);
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row" }}>

                {timeslotsOfWorkDayDict.map((timeslot) => {
                    return (
                        <SlotBox occupied={timeslot.occupied} />
                    );
                })}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>

                {timeslotsOfWorkDayDict.map((timeslot) => {
                    return (
                        <LabelBox label={timeslot.label} />
                    );
                })}
            </Box>
        </>
    );
}

export { TimeSlotsDisplayHorizontal }