import { createContext, useContext, useState, useEffect } from 'react';
import { ENDPOINT } from './Endpoints';

export const CampaignContext = createContext();

export const useCampaigns = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(ENDPOINT + 'campaigns/');
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <CampaignContext.Provider value={{ campaigns, setCampaigns, loading, fetchCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
};
