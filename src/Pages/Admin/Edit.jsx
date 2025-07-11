import React from 'react'
import { useParams } from "react-router-dom";

import { ALL_CAMPAIGNS } from "../../Data/CampaignData";
import { useCampaigns } from '../../CampaignContext';

import Create from './Create'



const Edit = () => {


    const { campaigns, loading } = useCampaigns();
        const combinedCampaigns = [...ALL_CAMPAIGNS, ...campaigns]
        const { campaignId } = useParams();
        const campaign =  combinedCampaigns.find((c) => c.campaignId === campaignId)?.campaign;



    if (loading) {
        return <></>
    }
  return (
    
    <Create edittingCampaign={campaign} 
    />
  )
}

export default Edit