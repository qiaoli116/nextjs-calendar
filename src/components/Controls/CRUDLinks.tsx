import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArticleIcon from '@mui/icons-material/Article';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function CRUDLinksComponent({ baseURL = "/", resourceId = "", createLink = true, readLink = true, updateLink = true, deleteLink = true, hasIcon = true, hasText = true }:
    {
        baseURL: string,
        resourceId?: string,
        createLink?: boolean,
        readLink?: boolean,
        updateLink?: boolean,
        deleteLink?: boolean,
        hasIcon?: boolean,
        hasText?: boolean
    }) {
    const style1 = {
        "display": "flex",
        "align-items": "center"
    }
    return (
        <>
            <Box sx={style1}>
                {createLink && (
                    <Box component="span" sx={{ mr: "10px" }} >
                        <Link underline="hover" href={`${baseURL}/create`}>
                            <Box sx={style1}>
                                {hasIcon && <Box sx={{ pr: "2px" }}><AddBoxIcon sx={{ mb: "-4px" }} /></Box>}
                                {hasText && <Box sx={{ pl: "2px" }}>CREATE</Box>}
                            </Box>
                        </Link>
                    </Box>
                )}
                {readLink && (
                    <Box component="span" sx={{ mr: "10px" }} >
                        <Link underline="hover" href={`${baseURL}/view/${resourceId}`}>
                            <Box sx={style1}>
                                {hasIcon && <Box sx={{ pr: "2px" }}><ArticleIcon sx={{ mb: "-4px" }} /></Box>}
                                {hasText && <Box sx={{ pl: "2px" }}>VIEW</Box>}
                            </Box>
                        </Link>
                    </Box>
                )}
                {updateLink && (
                    <Box component="span" sx={{ mr: "10px" }} >
                        <Link underline="hover" href={`${baseURL}/edit/${resourceId}`}>
                            <Box sx={style1}>
                                {hasIcon && <Box sx={{ pr: "2px" }}><EditIcon sx={{ mb: "-4px" }} /></Box>}
                                {hasText && <Box sx={{ pl: "2px" }}>EDIT</Box>}
                            </Box>
                        </Link>
                    </Box>
                )}
                {deleteLink && (
                    <Box component="span" sx={{ mr: "10px" }} >
                        <Link underline="hover" href={`${baseURL}/delete/${resourceId}`}>
                            <Box sx={style1}>
                                {hasIcon && <Box sx={{ pr: "2px" }}><DeleteIcon sx={{ mb: "-4px" }} /></Box>}
                                {hasText && <Box sx={{ pl: "2px" }}>DELETE</Box>}
                            </Box>
                        </Link>
                    </Box>
                )}
            </Box>
        </>
    )
}