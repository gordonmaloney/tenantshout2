import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';

import img1 from './imgs/img1.jpeg'
import img2 from './imgs/img2.jpeg'
import img3 from './imgs/img3.jpeg'
import img4 from './imgs/img4.jpeg'

const features = [
  {
    text: 'Pressure councillors to vote for a key motion',
    image: img1, // replace with your image URL
  },
  {
    text: 'Respond en masse to a consultation or survey',
    image: img2
  },
  {
    text: 'Pile pressure on a member defence target',
    image: img3
  },
  {
    text: 'Shower politicians with personalised member stories',
    image: img4
  },
];

export default function FeatureCards() {
  return (
    <Grid container spacing={2}>
      {features.map((feature, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card sx={{ height: '100%', maxWidth: '260px', margin: '0 auto', display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
            <CardMedia
              component="img"
              image={feature.image}
              alt={`Feature ${idx + 1}`}
              sx={{ height: 170 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <center>
                    <p style={{ margin: '0'}}>
                {feature.text}</p></center>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
