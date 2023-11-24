import { Box } from '@mui/material';
import { getTimeslotsOfWorkDayDict, timeslotsRange } from '../Calendar/timeslotUtils';
import { time } from 'console';
import { blue, grey } from '@mui/material/colors';

const colorEmpty1 = grey[400];
const colorEmpty2 = grey[500];
const colorOccupied = blue[700];

function TimeSlotsDisplayHorizontal({ timeslots }: { timeslots: string[] } = { timeslots: [] }) {
    const SlotBox = ({ occupied, type }: { occupied: boolean, type: string }) => {
        let color = "#fff";
        if (occupied) {
            color = colorOccupied;
        } else {
            if (type === "morning" || type === "evening") {
                color = colorEmpty1;
            } else {
                color = colorEmpty2;
            }
        }
        return (
            <Box
                sx={{
                    height: "60px",
                    width: "25px",
                    mx: "2px",
                    bgcolor: color,
                    border: `1px solid ${color}`,
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
                        <SlotBox occupied={timeslot.occupied} type={timeslot.type} />
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

function TimeSlotsDisplayHorizontalBrief({ timeslots }: { timeslots: string[] } = { timeslots: [] }) {
    const SlotBox = ({ occupied, type }: { occupied: boolean, type: string }) => {
        let color = "#fff";
        if (occupied) {
            color = colorOccupied;
        } else {
            if (type === "morning" || type === "evening") {
                color = colorEmpty1;
            } else {
                color = colorEmpty2;
            }
        }
        return (
            <Box
                sx={{
                    height: "20px",
                    width: "5px",
                    mx: ".5px",
                    bgcolor: color,
                    border: `1px solid ${color}`,
                }}
            ></Box>
        )
    }
    const timeslotsOfWorkDayDict = getTimeslotsOfWorkDayDict(timeslots);
    console.log("TimeSlotsDisplay values: ", timeslots);
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row" }}>

                {timeslotsOfWorkDayDict.map((timeslot) => {
                    return (
                        <SlotBox occupied={timeslot.occupied} type={timeslot.type} />
                    );
                })}
            </Box>
        </>
    );
}

export { TimeSlotsDisplayHorizontal, TimeSlotsDisplayHorizontalBrief }