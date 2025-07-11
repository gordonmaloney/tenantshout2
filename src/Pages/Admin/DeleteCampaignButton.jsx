// src/components/DeleteCampaignButton.jsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Typography
} from '@mui/material';
import { ENDPOINT } from '../../Endpoints';
import { BtnStyleSmall } from '../../MUIStyles';

/**
 * Button to delete a campaign with confirmation dialog.
 * @param {{ campaignId: string, onDeleted?: () => void }} props
 */
export default function DeleteCampaignButton({ campaignId, onDeleted = () => {} }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  
  const handleOpen = () => {
    setConfirmText('');
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    if (confirmText !== 'delete') {
      setError('Please type "delete" to confirm.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ENDPOINT}campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to delete campaign');
      }
      onDeleted();
      handleClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Button sx={BtnStyleSmall} onClick={handleOpen}>
        Delete
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. To confirm deletion, type "delete" below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={`Type "delete" to confirm`}
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={BtnStyleSmall}>Cancel</Button>
          <Button sx={{...BtnStyleSmall, backgroundColor: 'red'}} onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
