import React from 'react';
import Select from '@mui/material/Select';
import { timeslotsOfWorkDay } from '../Calendar/timeslotUtils';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { v4 as uuidv4 } from 'uuid';

export default function TimeSlotsSelect({ values, name, onChange }:
    { values?: string[], name?: string, onChange?: (e: any) => void }) {
    console.log("TimeSlotsSelect values: ", values);
    const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
        const { options } = event.target;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        onChange && onChange({
            target: {
                name: name,
                value: value
            }
        });
    };
    const elementId = "id-" + uuidv4();
    return (
        <>
            <FormControl>
                <InputLabel shrink htmlFor={elementId}>Timeslots</InputLabel>
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
                    onChange={handleChangeMultiple}
                    label="Timeslots"
                    inputProps={{
                        size: timeslotsOfWorkDay.length,
                        id: elementId,
                    }}
                >
                    {timeslotsOfWorkDay.map((timeslot: string) => {
                        const selected: boolean = values !== undefined && values.includes(timeslot) ? true : false
                        return (
                            <option key={timeslot} value={timeslot} selected={selected}>
                                {timeslot}
                            </option>
                        );
                    })}
                </Select>
            </FormControl>

        </>
    );

}