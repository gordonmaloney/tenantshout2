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

	width: "100%",
	maxWidth: "600px",
	padding: "10px 8px 12px 8px",
	backgroundColor: "rgba(246, 243, 246, 0.8)",
	margin: "40px auto 0 auto",
	
};


const Landing = () => {
	const { campaigns, loading } = useCampaigns();





	return (
		<div>
			<Grid container style={GridStyle} spacing={1} justifyContent="space-around">
				{campaigns.map((campaign) => (
					<Grid>
						<Card
							component="div"
							key={campaign.campaign.id}
							sx={{
								display: "inline-block",
								maxWidth: 270,
								backgroundColor: "#F0F5FA",
								//margin: "auto",
								boxShadow: 3,
								borderRadius: 2,
								transition: "0.3s",
								"&:hover": { boxShadow: 6 },
							}}
						>
							<Link
								to={`/act/${campaign.campaign.id}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<CardContent>
									<h4 style={{ margin: 0 }}>{campaign.campaign.title}</h4>
									<br />
									{campaign.campaign.blurb}
									<br />
									<br />
									<center>
										<Button sx={BtnStyleSmall}>Take Action</Button>
									</center>
								</CardContent>
							</Link>
						</Card>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default Landing;