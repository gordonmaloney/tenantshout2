// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ENDPOINT } from '../../Endpoints';
import { useNavigate } from 'react-router-dom';
import { BtnStyle, TextFieldStyle } from '../../MUIStyles';


/**
 * Renders an admin login form. On successful login, stores JWT and calls onLogin.
 * @param {{ onLogin?: () => void }} props
 */
export default function AdminLogin({ onLogin = () => {} }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${ENDPOINT}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      onLogin(); // safely calls parent callback
      navigate('/admin'); // redirect to admin dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, backgroundColor: "white", padding: '20px', borderRadius: '10px' }}>
      <Typography gutterBottom >
       <h2 style={{margin: '0px', padding: '0p'}}>Log in to view this page</h2>
      </Typography>
      <TextField
      sx={TextFieldStyle}
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button sx={BtnStyle} fullWidth onClick={handleSubmit}>
        Log In
      </Button>
    </Box>
  );
}
