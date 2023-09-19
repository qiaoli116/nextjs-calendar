"use client"
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
    const label = "Timeslots - " + (values === undefined ? "0" : values.length / 2) + "h";
    console.log("label", label)
    return (
        <>
            <FormControl>
                <InputLabel shrink htmlFor={elementId}>{label}</InputLabel>
                <Select
                    sx={{
                        "& select": {
                            overflow: "auto",
                            mt: "14px",
                            mb: "5px",
                            pt: "0px",
                            pb: "14px",
                            pl: "18px",
                            pr: "20px !important",
                        }
                    }}
                    multiple
                    native
                    onChange={handleChangeMultiple}
                    label={label}
                    inputProps={{
                        size: 12,
                        id: elementId,

                    }}
                    value={values === undefined ? [] : values}
                >
                    {timeslotsOfWorkDay.map((timeslot: string) => {
                        const selected: boolean = values !== undefined && values.includes(timeslot) ? true : false
                        return (
                            <option key={timeslot} value={timeslot} >
                                {timeslot}
                            </option>
                        );
                    })}
                </Select>
            </FormControl>

        </>
    );

}