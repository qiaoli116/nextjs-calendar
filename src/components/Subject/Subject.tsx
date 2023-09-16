
import React from 'react';
import { ISubject } from '../../dataService/subjects';
import { v4 as uuidv4 } from 'uuid';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
/*
function setValueByPath(obj, pathStr, value) {
  const path = pathStr.split(/[\[\].]/).filter(part => part !== '');

  path.reduce((currentObj, key, index) => {
    if (index === path.length - 1) {
      // Last part of the path, set the value
      currentObj[key] = value;
    } else if (!currentObj[key]) {
      // Create an object or array if it doesn't exist
      if (/^\d+$/.test(path[index + 1])) {
        currentObj[key] = [];
      } else {
        currentObj[key] = {};
      }
    }
    return currentObj[key];
  }, obj);

  return obj;
}

const pathStr = "key1.key2[1].key3";
const value = "v1";
const obj = {};

setValueByPath(obj, pathStr, value);
console.log(JSON.stringify(obj, null, 2));
*/

const generateSubjectReference = () => {
    return "Subject#" + uuidv4();
}

const generateInitialSubject = (): ISubject => {
    return {
        reference: generateSubjectReference(),
        code: "",
        title: "",
        term: "",
        department: "",
        block: "",
        qualification: {
            code: "",
            title: "",
        },
        deliveryMode: "",
        dateRange: {
            startDate: "",
            endDate: "",
        },
        units: [],
        sessions: [],
    }
}

const boxSx = {
    py: "8px"
}
const SubjectCreateOrUpdateComponent = ({ reference, create = false }:
    { reference?: string, create?: boolean }) => {
    const [subject, setSubject] = React.useState<ISubject>(generateInitialSubject());
    // this is a general purpose handler for all input fields
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setSubject({
            ...subject,
            [name]: value
        });
    };
    const resetForm = () => {
        console.log("resetForm called");
        setSubject(generateInitialSubject());
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("handleSubmit", subject);
        console.log("handleSubmit", JSON.stringify(subject, null, 2));

    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Subject ID"
                        name='reference'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Code"
                        name='code'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Title"
                        name='title'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Term"
                        name='term'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Department"
                        name='department'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Block"
                        name='block'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Qualification Code"
                        name='qualification.code'
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        label="Qualification Title"
                        name='qualification.title'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Subject ID"
                        name='reference'
                        onChange={handleInputChange}
                    />
                </Box>
                <Box sx={boxSx}>
                    <TextField
                        fullWidth
                        label="Subject ID"
                        name='reference'
                        onChange={handleInputChange}
                    />
                </Box>
            </form>
        </>
    )
}