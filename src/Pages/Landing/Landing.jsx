import React from "react";

import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Button,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { ALL_CAMPAIGNS } from "../../Data/CampaignData";
import { BtnStyle, BtnStyleSmall } from "../../MUIStyles";
import { useCampaigns } from '../../CampaignContext';


const GridStyle = {
	//border: "1px solid grey",

	width: "90%",
	maxWidth: "600px",
	padding: "10px 8px 12px 8px",
	backgroundColor: "rgba(246, 243, 246, 0.8)",
	margin: "40px auto 0 auto",
	
};


const Landing = () => {
	const { campaigns, loading } = useCampaigns();





	return (
		<div>
			<div style={GridStyle} spacing={1} justifyContent="space-around">
				<h2 style={{margin: '0px'}}>TenantAct</h2>

				<p>A platform for Living Rent members to run advocacy campaigns</p>
			</div>
		</div>
	);
};

export default Landing;