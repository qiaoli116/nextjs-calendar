import calUtils, { MonthItem, DayItem, Session } from './calendarUtils';
import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PrecisionManufacturing } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { timeslotOfDay } from './timeslotUtils';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';


const DayItemComponent = ({ dayItem, isHeader, children }: { dayItem?: DayItem, isHeader?: boolean, children?: React.ReactNode }) => {
    // console.log(dayItem, isHeader, children)
    let boxSx: any = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: "3px",
        borderRadius: "4px",

    };
    const hasSession = dayItem && dayItem.sessions;
    if (isHeader || !hasSession) {
        boxSx['cursor'] = 'default';
    }
    else {
        boxSx['cursor'] = 'pointer';
        boxSx['&:hover'] = {
            bgcolor: blue[100]
        };
        boxSx['bgcolor'] = 'primary.main';
        boxSx['color'] = 'white';
    }

    return (
        < >
            <Box sx={boxSx}>
                <Typography
                    sx={{
                        fontSize: '0.75rem !important',
                    }}
                    component="div"
                >
                    {children}
                </Typography>
            </Box>
        </>

    );
}

const SingleMonthHeaderComponet = () => {
    const weekDayLables = ["M", "T", "W", "T", "F", "S", "S"]
    return (
        <>
            {weekDayLables.map((label, index) => {
                return (
                    <DayItemComponent isHeader key={index}>
                        {label}
                    </DayItemComponent>
                );
            })}
        </>

    )
}

const SingleMonthComponet = ({ year, monthIndex, days }: any) => {

    return (
        <>
            <Box sx={{
                width: '250px',
                p: '10px 20px',
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pb: '10px'
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 'bold',
                        }}
                    >
                        {new Date(year, monthIndex).toLocaleString('default', { year: "numeric", month: 'long' })}
                    </Typography>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridGap: '5px',
                    gridTemplateColumns: 'repeat(7, 25px)',
                    backgroundColor: blue[100],
                    mb: "3px"
                }}>
                    <SingleMonthHeaderComponet />
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridGap: '5px',
                    gridTemplateColumns: 'repeat(7, 25px)',
                }}>

                    {days.map((dayItem: DayItem, index: number) => {
                        return (
                            <DayItemComponent key={index} dayItem={dayItem}>
                                {Number.isNaN(dayItem.day) ? "" : dayItem.day}
                            </DayItemComponent>
                        );
                    })}
                </Box>
            </Box>

        </>

    );
};

type MultiMonthComponetProps = MonthItem[];
const MultiMonthComponet = () => {
    return (
        <>

        </>

    );
}

const SingleSessionComponet = ({ session }: { session?: Session }) => {
    return (
        <>
            <Box>
                <Typography></Typography>
            </Box>
        </>

    );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SingleDayComponet = ({ dateString, sessions }: { dateString?: string, sessions?: Session[] }) => {

    // build the set of teacher and room to create filters
    let teacherIdList: string[] | null = sessions === undefined ? null : Array.from(calUtils.buildSetFromSessions(sessions, (session) => session.teacher ? session.teacher.id : ""));
    let roomList: string[] | null = sessions === undefined ? null : Array.from(calUtils.buildSetFromSessions(sessions, (session) => session.room ? session.room : ""));
    let teacherMapping: any = {};
    if (sessions !== undefined) {
        sessions.forEach((session) => {
            if (session.teacher !== null) {
                teacherMapping[session.teacher.id] = session.teacher.name;
            }
        });
    }
    console.log(teacherIdList);
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            <Box width={{ xs: "100px", sm: "300px", md: "500px" }} bgcolor={blue[200]}>
                content
            </Box>
            {teacherIdList && (
                <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        <MenuItem disabled value="">
                            <em>Placeholder</em>
                        </MenuItem>
                        {teacherIdList.map((teacherId) => (
                            <MenuItem
                                key={teacherId}
                                value={teacherMapping[teacherId]}
                            >
                                {teacherId + " - " + teacherMapping[teacherId]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}


            <Box sx={{
                width: {
                    xs: 100,
                    sm: 300,
                    md: 500,
                },
                bgcolor: blue[200],
            }}>
                asfasdf
            </Box>
        </>


    );
}

export {
    SingleMonthComponet,
    SingleDayComponet
};