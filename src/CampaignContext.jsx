import { createContext, useContext, useState, useEffect } from 'react';

export const CampaignContext = createContext();

export const useCampaigns = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('http://localhost:3000/campaigns');
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
