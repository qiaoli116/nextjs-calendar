
import React from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export function AlertLoading({ alertMessage }: { alertMessage: string }) {
    return (
        <Alert severity="info">
            <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;{alertMessage} ...
        </Alert>
    )
}