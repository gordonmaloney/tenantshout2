import React from 'react'
import { Grid2 as Grid } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import {	Button, Box
} from "@mui/material"
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <div
    style={{backgroundColor: 'white', width: '100vw', marginTop: '50px'}}
    >
        <Grid container spacing={2} justifyContent={'space-between'}
        alignItems={"center"}
        sx={{width: '95%', padding: '10px 0', margin: '0 auto'}}
        >

        <Grid xs={12} sm={8}>
        <a href="https://www.livingrent.org/"   style={{color: 'black'}} target="_blank">Living Rent</a> is Scotland's tenants' and community union.
</Grid>

<Grid xs={12} sm={4}>
<a href="https://www.livingrent.org/join" target="_blank"       style={{color: 'black'}}
>Become a member today</a>
<br/><br/>

<Box sx={{ display: 'flex', gap: 2, fontSize: '1.5rem', justifyContent: 'space-around' }}>
  <a href="https://www.instagram.com/living_rent/" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faInstagram} style={{ color: 'black' }} />
  </a>
  <a href="https://x.com/Living_Rent" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faXTwitter} style={{ color: 'black' }} />
  </a>
  <a href="https://www.facebook.com/livingrentscotland/" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faFacebookF} style={{ color: 'black' }} />
  </a>
</Box>


</Grid>

        </Grid>

    </div>
  )
}

export default Footer