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
import InputLabel from '@mui/material/InputLabel';


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



const MultiSelectNativeComponet = ({ items, selectValue, setSelectValue, label }: {
    items: { value: string, text: string }[],
    selectValue: string[],
    setSelectValue: React.Dispatch<React.SetStateAction<string[]>>,
    label: string
}) => {
    const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { options } = event.target;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectValue(value);
    };

    return (
        <div>
            <FormControl sx={{ m: 1 }}>
                <InputLabel shrink htmlFor={label + "_select-multiple-native"}>
                    {label}
                </InputLabel>
                <Select
                    sx={{
                        "& select": {
                            overflow: "hidden",
                            pt: "14px",
                            pb: "14px",
                            pl: "14px",
                            pr: "16px !important",
                        }
                    }}
                    multiple
                    native
                    value={selectValue}
                    // @ts-ignore Typings are not considering `native`
                    onChange={handleChangeMultiple}
                    label="Native"
                    inputProps={{
                        id: label + "_select-multiple-native",
                        size: items.length,
                    }}
                >
                    {items.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.text}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}


// sometimes we want to display different text in the menu item and the chip, instead of using value of the multi select
// for example, teacher id is used as value, but we want to display teacher name in the menu item and chip
// thus we need to pass in a callback to get the text for menu item and chip
// and if we don't pass in the callback, we will just use the value as the text
type getMenuItemTextCallback = (item: string) => string;
type getChipTextCallback = (item: string) => string;
const MultiSelectChipComponet = ({ items, getMenuItemText, getChipText, selectValue, setSelectValue, label }: {
    items: string[],
    getMenuItemText?: getMenuItemTextCallback,
    getChipText?: getChipTextCallback
    selectValue: string[],
    setSelectValue: React.Dispatch<React.SetStateAction<string[]>>,
    label: string
}) => {
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
    const handleChange = (event: SelectChangeEvent<typeof selectValue>) => {
        const {
            target: { value },
        } = event;
        console.log("value:", value);
        setSelectValue(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
            <InputLabel id={label + "-multiple-chip-label"}>{label}</InputLabel>
            <Select
                labelId={label + "-multiple-chip-label"}
                id={label + "-multiple-chip"}
                multiple
                value={selectValue}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label={label} />}
                renderValue={(selected: string[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: any) => (
                            <Chip key={value} label={getChipText ? getChipText(value) : value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {items.map((item) => (
                    <MenuItem
                        key={item}
                        value={item}
                        sx={{
                            fontSize: "0.75rem"
                        }}
                    >
                        {getMenuItemText ? getMenuItemText(item) : item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl >
    );
}

const FilterComponet = ({ sessions }: { sessions: Session[] }) => {
    let teacherIdList: string[] = Array.from(calUtils.buildSetFromSessions(sessions, (session) => {
        console.log(session.teacher);
        return session.teacher ? session.teacher.id : "1000000000";
    }));
    let roomList: string[] = Array.from(calUtils.buildSetFromSessions(sessions, (session) => session.room ? session.room : "B0.0.0"));
    let subjectList: string[] = Array.from(calUtils.buildSetFromSessions(sessions, (session) => session.subjectCode));
    console.log("teacherIdList", teacherIdList);
    // build the mapping from teacher id to teacher name
    let teacherMapping: any = {};
    if (sessions !== undefined) {
        sessions.forEach((session) => {
            if (session.teacher !== null) {
                teacherMapping[session.teacher.id] = session.teacher.name;
            }
        });
    }

    // build the mapping from subject code to subject title
    let subjectMapping: any = {};
    if (sessions !== undefined) {
        sessions.forEach((session) => {
            if (session.subjectCode !== null) {
                subjectMapping[session.subjectCode] = session.subjectTitle;
            }
        });
    }

    // used for filtering states
    const [teachers, setTeachers] = React.useState<string[]>(teacherIdList);
    const [rooms, setRooms] = React.useState<string[]>(roomList);
    const [subjects, setSubjects] = React.useState<string[]>(subjectList);
    return (
        <>
            <MultiSelectNativeComponet
                items={teacherIdList.map((teacherId) => { return { value: teacherId, text: teacherMapping[teacherId] } })}
                selectValue={teachers}
                setSelectValue={setTeachers}
                label="Teachers"
            />
            <MultiSelectNativeComponet
                items={roomList.map((room) => { return { value: room, text: room } })}
                selectValue={rooms}
                setSelectValue={setRooms}
                label="Rooms"
            />
            <MultiSelectNativeComponet
                items={subjectList.map((subjectCode) => { return { value: subjectCode, text: subjectMapping[subjectCode] } })}
                selectValue={subjects}
                setSelectValue={setSubjects}
                label="Subjects"
            />
        </>
    )
}

const SingleDayComponet = ({ dateString, sessions }: { dateString?: string, sessions?: Session[] }) => {

    // build the list of teacher and room to create filters
    let teacherIdList: string[] | null = sessions === undefined ? null : Array.from(calUtils.buildSetFromSessions(sessions, (session) => session.teacher ? session.teacher.id : ""));
    let roomList: string[] | null = sessions === undefined ? null : Array.from(calUtils.buildSetFromSessions(sessions, (session) => session.room ? session.room : ""));

    // build the mapping from teacher id to teacher name
    let teacherMapping: any = {};
    if (sessions !== undefined) {
        sessions.forEach((session) => {
            if (session.teacher !== null) {
                teacherMapping[session.teacher.id] = session.teacher.name;
            }
        });
    }

    // used for filtering states
    const [teachers, setTeachers] = React.useState<string[]>(teacherIdList === null ? [] : teacherIdList);
    const [rooms, setRooms] = React.useState<string[]>(roomList === null ? [] : roomList);
    const [rooms2, setRooms2] = React.useState<string[]>(roomList === null ? [] : roomList);

    return (
        <>
            {teacherIdList && (<MultiSelectChipComponet
                items={teacherIdList}
                getMenuItemText={(teacherId) => teacherId + " - " + teacherMapping[teacherId]}
                getChipText={(teacherId) => teacherMapping[teacherId]}
                selectValue={teachers}
                setSelectValue={setTeachers}
                label="Teacher"
            />)}
            {roomList && (<MultiSelectChipComponet
                items={roomList}
                selectValue={rooms}
                setSelectValue={setRooms}
                label="Room"
            />)}

            {teacherIdList && (<MultiSelectNativeComponet
                items={teacherIdList.map((teacherId) => { return { value: teacherId, text: teacherMapping[teacherId] } })}
                selectValue={rooms2}
                setSelectValue={setRooms2}
                label="Room"
            />)}
            <Box>
                <Typography></Typography>
            </Box>
            <Box width={{ xs: "100px", sm: "300px", md: "500px" }} bgcolor={blue[200]}>
                content
            </Box>


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
    SingleDayComponet,
    FilterComponet
};