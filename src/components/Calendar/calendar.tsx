import calUtils, { MonthItem, DayItem } from './calendarUtils';
import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PrecisionManufacturing } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { timeslotOfDay } from './timeslotUtils';

const SessionTimeSlotComponent = ({ timeslots }: { timeslots: string[] }) => {
    return (
        <>
            {timeslotOfDay.map((timeslot: string, index: number) => {
                return (
                    <Box key={index}>

                        <Typography
                            sx={{
                                color: (timeslots.indexOf(timeslot) >= 0) ? blue[500] : "inherit"
                            }}
                        >
                            {timeslot}
                        </Typography>
                    </Box>
                )
            })}
        </>
    )
}

const DayItemComponent = ({ dayItem, isHeader, children }: { dayItem?: DayItem, isHeader?: boolean, children?: React.ReactNode }) => {
    console.log(dayItem, isHeader, children)
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
        return (
            <Box
                sx={boxSx}
            >
                <Typography
                    sx={{
                        fontSize: '0.75rem !important',
                    }}
                    component="div"
                >
                    {children}
                </Typography>

            </Box>
        )
    }

    // not header && has session
    boxSx['cursor'] = 'pointer';
    boxSx['&:hover'] = {
        bgcolor: blue[100]
    };
    boxSx['bgcolor'] = 'primary.main';
    boxSx['color'] = 'white';

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? dayItem.date : undefined;
    let allTimeslots: string[] = [];
    // check if dayItem.sessions is array
    if (Array.isArray(dayItem.sessions)) {
        dayItem.sessions.forEach((session) => {
            allTimeslots = allTimeslots.concat(session.timeslots);
        });
    }
    return (
        < >
            <Box
                onClick={handleClick}
                sx={boxSx}
            >
                <Typography
                    sx={{
                        fontSize: '0.75rem !important',
                    }}
                    component="div"
                >
                    {children}
                </Typography>


            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    <SessionTimeSlotComponent
                        timeslots={allTimeslots}
                    />
                </Typography>
            </Popover>
        </>

    );
}

const SingleMonthHeaderComponet = () => {
    return (
        <>
            <DayItemComponent isHeader>M</DayItemComponent>
            <DayItemComponent isHeader>T</DayItemComponent>
            <DayItemComponent isHeader>W</DayItemComponent>
            <DayItemComponent isHeader>T</DayItemComponent>
            <DayItemComponent isHeader>F</DayItemComponent>
            <DayItemComponent isHeader>S</DayItemComponent>
            <DayItemComponent isHeader>S</DayItemComponent>
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

export {
    SingleMonthComponet
};