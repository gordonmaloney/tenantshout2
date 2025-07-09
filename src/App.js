import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CampaignTopLevel from './Pages/Campaign/CampaignTopLevel';
import Header from "./Components/Header";
import Landing from "./Pages/Landing/Landing";

function App() {
  return (
		<div className="content">
			<Router>
				<Header />

				<Routes>
					<Route exact path="/" element={<Landing />} />
					<Route path="/act/:campaignId" element={<CampaignTopLevel />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
