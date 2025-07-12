import React, { useState }  from "react";
import { useParams } from "react-router-dom";
import Campaign from "./Campaign";
import { ALL_CAMPAIGNS } from "../../Data/CampaignData";
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

const CampaignTopLevel = ({testCampaign}) => {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState('');

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
	  setOpen(false);
	  setError('');
	};
  

		const { campaigns, loading } = useCampaigns();
		const { campaignId } = useParams();
		const campaign = testCampaign || campaigns.find((c) => c.campaignId === campaignId)?.campaign;

	// Use 600px as the breakpoint for "sm" without needing the theme provider
	const isSmallScreen = useMediaQuery("(max-width:600px)");



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
				<h2
					style={{
						padding: "0px 6px",
						margin: "20px 0 10px 0",
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
					<Paper sx={GridStyle}>
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
