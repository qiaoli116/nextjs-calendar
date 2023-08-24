import calUtils, { MonthItem, DayItem } from './calendarUtils';
import * as React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PrecisionManufacturing } from '@mui/icons-material';
import { blue } from '@mui/material/colors';


const DayItemComponent = ({ dayItem, children }: { dayItem?: DayItem, children?: React.ReactNode }) => {
    const boxSx = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: (dayItem && dayItem.sessions) ? 'primary.main' : 'transparent',
        color: (dayItem && dayItem.sessions) ? 'white' : 'black',
        p: "3px"
    }
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
    );
}

const SingleMonthHeaderComponet = () => {
    return (
        <>
            <DayItemComponent>M</DayItemComponent>
            <DayItemComponent>T</DayItemComponent>
            <DayItemComponent>W</DayItemComponent>
            <DayItemComponent>T</DayItemComponent>
            <DayItemComponent>F</DayItemComponent>
            <DayItemComponent>S</DayItemComponent>
            <DayItemComponent>S</DayItemComponent>
        </>

    )
}

const SingleMonthComponet = ({ year, monthIndex, days }: any) => {
    console.log(blue[200])
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