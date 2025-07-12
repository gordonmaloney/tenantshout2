import React from "react";

import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Box,
	Button,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { ALL_CAMPAIGNS } from "../../Data/CampaignData";
import { BtnStyle, BtnStyleSmall } from "../../MUIStyles";
import { useCampaigns } from '../../CampaignContext';
import FeatureCards from "./FeatureCards";
import FeaturedCampaigns from "./FeaturedCampaigns";
import img6 from './imgs/img6.jpeg'

const GridStyle = {
	//border: "1px solid grey",

	width: "90%",
	maxWidth: "600px",
margin: '50px auto 0 auto',
	
};


const Landing = () => {
	const { campaigns, loading } = useCampaigns();




	return (
		<div>


			<div style={{...GridStyle, margin: '100px auto'}} spacing={1} justifyContent="space-around">


			<Box sx={{ maxWidth: 600, mx: 'auto', backgroundColor: "white", padding: '20px', borderRadius: '10px' }}>

				<center>
			<h1>TenantAct</h1>
			</center>

			<center>A Living Rent platform for digital campaign actions - mobilise members to send emails, tweets, or phone calls to targets.
<br/><br/>
<Link to="./login">
<Button sx={BtnStyle}>Get started</Button></Link>
</center>
</Box>

			</div>

			<Grid container spacing={2} sx={{ width: '100vw', backgroundColor: 'white', padding: '20px 0', margin: '20px auto 80px auto' }} alignItems={"center"} justifyContent={"space-around"}>
      {/* Left side: your image */}
      <Grid item xs={0} md={3}    sx={{
          display: { xs: 'none', md: 'block' },
        }}>
   <div style={{width: '100%'}}>

	<img src={img6} 
	style={{maxWidth: '460px', margin: '0 auto', borderRadius: '10px'}}
	alt="Living Rent members on May Day" />
   </div>
      </Grid>

      {/* Right side: the slider */}
      <Grid item xs={12} md={9}>
        <FeaturedCampaigns />
      </Grid>
    </Grid>



<div style={{width: '95%', maxWidth: '1000px', margin: '0 auto'}}>
			<FeatureCards />
			</div>






		</div>
	);
};

export default Landing;