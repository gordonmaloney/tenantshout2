import React from 'react'
import { useParams } from "react-router-dom";

import { ALL_CAMPAIGNS } from "../../Data/CampaignData";
import { useCampaigns } from '../../CampaignContext';

import Create from './Create'


// This is the edit campaign page, which just loads the 'create' component pre-filled with the existing campaign,
// and the truthy 'edittingCampaign' causes it to update rather than create a new one

const Edit = () => {


    const { campaigns, loading } = useCampaigns();
        const combinedCampaigns = [...campaigns]
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