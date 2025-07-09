import React, { useState }  from "react";
import { useParams } from "react-router-dom";
import Campaign from "./Campaign";
import { ALL_CAMPAIGNS } from "../../Data/CampaignData";
import CampaignBlurbs from "./CampaignBlurbs";

import { Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMediaQuery } from "@mui/material";
import CampaignAccordion from "./CampaignAccordion";

const CampaignTopLevel = () => {
	// Use 600px as the breakpoint for "sm" without needing the theme provider
	const isSmallScreen = useMediaQuery("(max-width:600px)");

	const { campaignId } = useParams();
	const { campaign } = {
		...ALL_CAMPAIGNS.find((campaign) => campaign.campaignId == campaignId),
	};

	const GridStyle = {
		//border: "1px solid grey",
		padding: "10px 8px 12px 8px",
		backgroundColor: "var(--secondary-color)",
		marginBottom: '20px',
	};

	const [stage, setStage] = useState(0);

	if (!campaign) {
		return <div>Campaign not found</div>;
	}

	return (
		<Box
			sx={{
				width: "100vw", // Ensures full width at all screen sizes
				maxWidth: { xs: "100vw", sm: "90%" }, // Adjusts max width on mobile
				margin: "0 auto",
			}}
		>
			{isSmallScreen ? (
				<h2
					style={{
						padding: "0px 6px",
						margin: "2px 0",
						color: "var(--campaign-title)",
					}}
				>
					{campaign.title}
				</h2>
			) : (
				<h1 style={{ padding: "0px 6px", color: "var(--campaign-title)" }}>
					{campaign.title}
				</h1>
			)}
			<Grid
				container
				spacing={2}
				justifyContent="center" // Center align the grid items
				sx={{
					width: "100%",
					margin: 0, // Ensure no extra margin on the grid container
				}}
			>
				<Grid size={{ xs: 12, md: 4 }}>
					<Paper sx={GridStyle}>
						<CampaignBlurbs campaign={campaign} stage={stage} />
					</Paper>

					{campaign?.accordion && !isSmallScreen && (
						<Paper sx={GridStyle}>
							<h3 style={{ margin: "0 0 10px 5px" }}>FAQs</h3>
							<CampaignAccordion campaign={campaign} />
						</Paper>
					)}
				</Grid>
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper sx={GridStyle}>
						<Campaign campaign={campaign} stage={stage} setStage={setStage} />
					</Paper>

					{campaign?.accordion &&
						isSmallScreen && (
							<Paper sx={GridStyle}>
								<h3 style={{ margin: "0 0 10px 5px" }}>FAQs</h3>
								<CampaignAccordion campaign={campaign} />
							</Paper>
						)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default CampaignTopLevel;
