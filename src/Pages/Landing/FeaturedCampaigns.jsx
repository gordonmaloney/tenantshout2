// src/components/FeaturedCampaigns.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  MobileStepper,
} from '@mui/material';
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';

import SwipeableViews from 'react-swipeable-views-react-18-fix';
import { useCampaigns } from '../../CampaignContext';
import { BtnStyleSmall, MobileStepperStyle, StepperStyle } from '../../MUIStyles';

const FEATURED_IDS = [
  'renthikes',
  'landlordchris',
  'regctteetest',
  'anotherCampaignId' // add your IDs here
];


const StyledMobileStepper = styled(MobileStepper)(({ theme }) => ({
    backgroundColor: 'white',
    padding: 0,
  
    // Dots container
    '& .MuiMobileStepper-dots': {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
    },
  
    // Inactive dots
    '& .MuiMobileStepper-dot': {
      backgroundColor: '#ccc',
      width: 8,
      height: 8,
      margin: '0 4px',
      opacity: 1,               // override default semi-transparent
    },
    // Active dot
    '& .MuiMobileStepper-dotActive': {
      backgroundColor: 'var(--textfield-outline)',
      opacity: 1,               // make sure it’s fully opaque
    },
  }));


export default function FeaturedCampaigns() {
  const { campaigns } = useCampaigns();
  const featured = campaigns.filter(c => FEATURED_IDS.includes(c.campaignId));
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = featured.length;

  const handleNext = () => {
    setActiveStep(prev => (prev + 1) % maxSteps);
  };
  const handleBack = () => {
    setActiveStep(prev => (prev + maxSteps - 1) % maxSteps);
  };

  return (
    <Box sx={{ maxWidth: 600, flexGrow: 1, mx: 'auto' }}>

        <h2 style={{padding: '0 10px', margin: '0'}}>Featured campaigns:</h2>
      <SwipeableViews
        index={activeStep}
        onChangeIndex={setActiveStep}
        enableMouseEvents
      >
        {featured.map((c, idx) => (
          <Box key={c.campaignId} sx={{ p: 2 }}>
            <Card
            className='featuredCard'
            sx={{maxWidth: '350px', margin: '0 auto'}}
            >

              <CardContent>
                <Typography gutterBottom>
                    <center>
                <h3 style={{margin: '0 auto'}}>  {c.campaign.title}</h3></center>
                </Typography>
                <Typography variant="body2">
                  {c.campaign.blurb}
                </Typography>

                <center>

                <Link
								to={`/act/${c.campaign.id}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
										<Button sx={BtnStyleSmall}>Take action</Button></Link></center>
              </CardContent>
            </Card>
          </Box>
        ))}
      </SwipeableViews>

  <StyledMobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={maxSteps === 0}
            sx={{ color: 'var(--textfield-outline)' }}  // force green
          >
            Next
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={maxSteps === 0}
            sx={{ color: 'var(--textfield-outline)' }}  // force green
          >
            Back
          </Button>
        }
      />
    </Box>
  );
}
