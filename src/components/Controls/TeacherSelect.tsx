"use client"
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TeacherDataService, { ITeacher } from '../../dataService/teachers';
import Box from '@mui/material/Box';

// interface Film {
//   title: string;
//   year: number;
// }


// custom filter options
// search by any substring of first name, last name, orgId, or userName
const filterOptions = createFilterOptions({
  stringify: (option: ITeacher) => (option.name.first + " " + option.name.last + " " + option.orgId + " " + option.userName),
});

export default function TeacherSelect({ value, name, onChange }: { value: string, name?: string, onChange?: (e: any) => void }) {
  const [Teachers, setTeachers] = React.useState<ITeacher[]>([]);
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly ITeacher[]>([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {

    if (!loading) {
      return undefined;
    }

    (async () => {
      console.log("TeacherSelect: useEffect: loading")
      const teachers = await TeacherDataService.getAllTeachers();
      setTeachers([...teachers]);
      console.log("TeacherSelect: useEffect: loading: active")
      setOptions([...teachers]);

    })();

    return () => {
      console.log("TeacherSelect: useEffect: loading: clear")
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      onInputChange={(event, newInputValue) => {
        onChange && onChange({
          target: {
            name: name,
            value: newInputValue
          }
        });
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      filterOptions={filterOptions}
      isOptionEqualToValue={(option, value) => option.orgId === value.orgId}
      getOptionLabel={(option) => option.orgId}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.name.last}, {option.name.first} ({option.orgId})
        </Box>
      )}
      options={options}
      loading={loading}
      renderInput={(params) => {
        console.log("Teachers: ", Teachers)
        const teacher = Teachers.find(t => t.orgId === value);
        console.log("TeacherSelect: renderInput: value", value)
        console.log("TeacherSelect: renderInput: teacher", teacher)
        return (
          <TextField
            {...params}
            label="Teacher"
            inputProps={{
              ...params.inputProps,
              value: teacher ? `${teacher.name.last}, ${teacher.name.first} (${teacher.orgId})` : value
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />)
      }}
    />
  );
}
