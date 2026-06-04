import React, { useState }  from "react";
import { Link, useParams } from "react-router-dom";
import Campaign from "./Campaign";
import { useCampaigns } from '../../CampaignContext';

import CampaignBlurbs from "./CampaignBlurbs";

import { Box, Paper, Button,   Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions, } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMediaQuery } from "@mui/material";
import CampaignAccordion from "./CampaignAccordion";
import { BtnStyle, BtnStyleSmall } from "../../MUIStyles";

import {BarLoader} from 'react-spinners'



//Top level 'frame' for campaign pages



const CampaignTopLevel = ({testCampaign}) => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
	  setOpen(false);
	};
  

		const { campaigns, loading, error: campaignsError } = useCampaigns();
		const { campaignId } = useParams();
		const campaign = testCampaign || campaigns.find((c) => c.campaignId === campaignId)?.campaign;

	// Use 600px as the breakpoint for "sm" without needing the theme provider
	const isSmallScreen = useMediaQuery("(max-width:600px)");



	const GridStyle = {
		border: "1px solid grey",
		padding: "10px 8px 12px 8px",
		backgroundColor: "var(--secondary-color)",
		marginBottom: '20px',
	};

	const [stage, setStage] = useState(0);

	if (!loading && (campaignsError || !campaign)) {
		return (
			<Box
				sx={{
					maxWidth: 720,
					margin: "60px auto",
					padding: "24px 20px",
					textAlign: "center",
					backgroundColor: "var(--secondary-color)",
					borderRadius: "4px",
					boxShadow: "0 2px 8px rgba(0,0,0,0.16)",
				}}
			>
				<h1>{campaignsError ? "Campaigns could not load" : "Campaign not found"}</h1>
				<p>
					{campaignsError ||
						"Sorry, this campaign link is not working. It may have been removed or the address may be wrong."}
				</p>
				<Button component={Link} to="/" sx={BtnStyleSmall}>
					Back to campaigns
				</Button>
			</Box>
		);
	}

	if (loading) {
		return <div style={{position: 'absolute', height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><BarLoader /></div> 
	}


	const handleGeneral = () => {
		const message = `Hi, I spotted a bug on ${window.location.host}, on campaign "${campaign.id}"`;
		window.open(
		  `https://wa.me/447903700751?text=${encodeURIComponent(message)}`,
		  '_blank'
		);
		handleClose();
	  };
	

	return (
		<Box
			sx={{
				width: "100vw", // Ensures full width at all screen sizes
				maxWidth: { xs: "100vw", sm: "90%" }, // Adjusts max width on mobile
				margin: "0 auto",
			}}
		>
			{isSmallScreen ? (
				<h1
					style={{
						padding: "0px 6px",
						margin: "20px 0 10px 0",
						color: "var(--campaign-title)",
						textAlign: 'center'
					}}
				>
					{campaign.title}
				</h1>
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
						<>
						{campaign?.accordion?.length > 0 && 
						<Paper sx={GridStyle}>
							<h3 style={{ margin: "0 0 10px 5px" }}>FAQs</h3>
							<CampaignAccordion campaign={campaign} />
						</Paper> }
		
					  </>
					)}
				</Grid>
				<Grid size={{ xs: 12, md: 8 }}>
					<Paper sx={{...GridStyle, padding: '14px'}}>
						<Campaign campaign={campaign} stage={stage} setStage={setStage} />
					
					</Paper>
					{campaign?.accordion &&
						isSmallScreen && (
							<>
							{campaign?.accordion?.length > 0 && 
							<Paper sx={GridStyle}>
								<h3 style={{ margin: "0 0 10px 5px" }}>FAQs</h3>
								<CampaignAccordion campaign={campaign} />

		
							</Paper>}
							
							  </>
						)}
								<Button sx={{...BtnStyleSmall, float: 'right'}} color="secondary" onClick={handleOpen}>
								Report a Bug
							  </Button>
				</Grid>
				
			</Grid>

			
			<Dialog open={open} onClose={handleClose}  fullWidth>
        <DialogTitle
		><h3 style={{margin: '0px'}}>Report a Bug</h3></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Thanks! Use the button below to send a WhatsApp message and we'll get it fixed ASAP.
          </DialogContentText>
    
        </DialogContent>
        <DialogActions>
          <Button sx={BtnStyleSmall} onClick={handleGeneral}>Report</Button>
        </DialogActions>
      </Dialog>

		</Box>
	);
};

export default CampaignTopLevel;
