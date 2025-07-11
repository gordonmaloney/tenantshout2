import React, {useState} from "react";

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
import { BtnStyle, BtnStyleSmall } from "../../MUIStyles";
import { useCampaigns } from '../../CampaignContext';
import AdminLogin from "./AdminLogin";
import DeleteCampaignButton from "./DeleteCampaignButton";

const GridStyle = {
	//border: "1px solid grey",

	width: "100%",
	maxWidth: "90vw",
	padding: "10px 8px 12px 8px",
	backgroundColor: "rgba(246, 243, 246, 0.8)",
	margin: "40px auto 0 auto",
	
};


const AdminDashboard = () => {
	const { campaigns, loading, fetchCampaigns } = useCampaigns();



	const formatDate = (isoString) => {
		if (!isoString) return "";
		const date = new Date(isoString);
		const dd = String(date.getDate()).padStart(2, "0");
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const yy = String(date.getFullYear()).slice(-2);

		const hh = String(date.getHours()).padStart(2, "0");
		const min = String(date.getMinutes()).padStart(2, "0");


  return `${dd}/${mm}/${yy} - ${hh}:${min}`;
	  };




return (

		<div>





			<Grid container style={GridStyle} spacing={1} justifyContent="space-around">

				<Grid size={12}>
				<center>
			<Link to="../create">
			<Button sx={{...BtnStyle, margin: '30px'}}>
				Create new Campaign
			</Button>
			
			</Link></center>
				</Grid>
				{campaigns.map((campaign) => (
					<Grid>
						<Card
							component="div"
							key={campaign.campaign.id}
							sx={{
								display: "inline-block",
								width: 270,
								backgroundColor: "#F0F5FA",
								//margin: "auto",
								boxShadow: 3,
								borderRadius: 2,
								transition: "0.3s",
								"&:hover": { boxShadow: 6 },
							}}
						>
							
								<CardContent>
									<h4 style={{ margin: 0 }}>{campaign.campaign.title}</h4>
									<br />
									{campaign.campaign.blurb}
									<br /><br/>
									{formatDate(campaign?.createdAt || campaign?.updatedAt)}									<br />
<br/>
									<div
									style={{display: 'flex', justifyContent: 'space-around'}}
									>
									<Link
								to={`/act/${campaign.campaign.id}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
										<Button sx={BtnStyleSmall}>View</Button></Link>
										
										<Link
								to={`/edit/${campaign.campaign.id}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
										<Button sx={BtnStyleSmall}>Edit</Button></Link>
										
										<DeleteCampaignButton campaignId={campaign.campaign.id} 
										onDeleted={fetchCampaigns}
										/>
										</div>
								</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default AdminDashboard;