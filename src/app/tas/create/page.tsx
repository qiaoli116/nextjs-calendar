'use client'
import * as React from 'react';
import { TASCreateComponent } from '../../../components/Sections/TAS';
import { ITASCreateInput } from '../../../types';
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


export default function TASCreatePage() {
    const router = useRouter();
    const onTASCreateSuccess = (tas: ITASCreateInput) => {
        console.log("onTASCreateSuccess - ", "tas", tas);
        router.push(`/tas/view/${tas.department.toLowerCase()}/${tas.year}/${tas.qualification.code.toLowerCase()}`);
    }
    return (
        <>

            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" href="/tas">
                    TAS List
                </Link>
                <Typography color="text.primary">Create</Typography>
            </Breadcrumbs>
            <h2>Create a teacher</h2>
            <TASCreateComponent
                onCreateSuccess={onTASCreateSuccess}
            />

        </>

    );
}
