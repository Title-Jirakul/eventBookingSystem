import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

const BulkDeleteConfirmDialog = ({
    open,
    title,
    description,
    onClose,
    onConfirm,
    confirmationText = 'DELETE',
    isSubmitting = false,
}) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        if (!open) {
            setValue('')
        }
    }, [open])

    const handleConfirm = async () => {
        await onConfirm()
    }

    return (
        <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {description}
                </DialogContentText>
                <TextField
                    autoFocus
                    fullWidth
                    label={`Type ${confirmationText} to continue`}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    disabled={isSubmitting}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleConfirm}
                    disabled={isSubmitting || value !== confirmationText}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default BulkDeleteConfirmDialog
