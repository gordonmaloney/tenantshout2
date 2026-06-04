import { createContext, useContext, useState, useEffect } from 'react';
import { ENDPOINT } from './Endpoints';

export const CampaignContext = createContext();

export const useCampaigns = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCampaigns = async () => {
    try {
      setError("");
      const res = await fetch(ENDPOINT + 'campaigns/');
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      setCampaigns(data);
    } catch {
      setError("Could not load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <CampaignContext.Provider value={{ campaigns, setCampaigns, loading, error, fetchCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
};
