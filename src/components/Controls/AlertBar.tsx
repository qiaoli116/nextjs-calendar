
import React from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function AlertLoading({ message }: { message: string }) {
    return (
        <Alert severity="info">
            <CircularProgress color="inherit" size={20} />&nbsp;&nbsp;{message} ...
        </Alert>
    )
}

export function AlertBar({ message, severity, onClick }: {
    message: string,
    severity: "info" | "success" | "warning" | "error",
    onClick?: () => void
}) {
    return (
        <Alert severity={severity} sx={{ position: 'relative' }}>
            {message}
            <IconButton aria-label="close"
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 3,
                }}
                onClick={onClick}
            >
                <CloseIcon />
            </IconButton>
        </Alert >
    )
}
