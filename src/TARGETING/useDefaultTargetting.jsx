import { useState, useEffect } from "react";

export function useDefaultTargetting(
	campaign,
	adminDivisions,
	{
		setLoading: externalSetLoading,
		setMessaging: externalSetMessaging,
		setNotMessaging: externalSetNotMessaging,
		setErrorMsg: externalSetErrorMsg,
	} = {}
) {

	// internal defaults if parent doesn't supply
	const [loadingState, _setLoading] = useState(true);
	const [messagingState, _setMessaging] = useState([]);
	const [notMessagingState, _setNotMessaging] = useState([]);
	const [errorMsgState, _setErrorMsg] = useState("");
	const [regions, setRegions] = useState([]);
	const [msps, setMSPs] = useState([]);

	// unify setters
	const setLoading = externalSetLoading || _setLoading;
	const setMessaging = externalSetMessaging || _setMessaging;
	const setNotMessaging = externalSetNotMessaging || _setNotMessaging;
	const setErrorMsg = externalSetErrorMsg || _setErrorMsg;

	// Fetch Regions
	useEffect(() => {
		if (campaign.target !== "msps") return;
		let cancelled = false;
		setLoading(true);

		fetch(
			"https://raw.githubusercontent.com/gordonmaloney/rep-data/main/REGIONS.json"
		)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch regions");
				return res.json();
			})
			.then((data) => {
				if (!cancelled) setRegions(data);
			})
			.catch((err) => console.error("Could not load regions:", err));

		return () => {
			cancelled = true;
		};
	}, [campaign.target]);

	// Fetch MSPs
	useEffect(() => {
		if (campaign.target !== "msps") return;
		let cancelled = false;

		fetch(
			"https://raw.githubusercontent.com/gordonmaloney/rep-data/main/MSPs.json"
		)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch MSPs");
				return res.json();
			})
			.then((data) => {
				if (!cancelled) setMSPs(data);
			})
			.catch((err) => console.error("Could not load MSPs:", err));

		return () => {
			cancelled = true;
		};
	}, [campaign.target]);



	//Councillors 
	useEffect(() => {
		if (campaign.target !== "edinburgh" && campaign.target !=="glasgow") return;
		setLoading(true);
		let cancelled = false;


		fetch(
			`https://raw.githubusercontent.com/gordonmaloney/rep-data/main/${campaign.target}-councillors.json`
		)			.then((res) => {
			if (!res.ok) throw new Error("Failed to fetch councillors");
			return res.json();
		})
		.then((data) => {

			setMessaging(data.filter((c) => c.ward == adminDivisions.ward));
			setLoading(false)
		
	}).catch((err) => console.error("Could not load councillors:", err));

	return () => {
		cancelled = true;
	};


	}, [campaign.target, adminDivisions.ward]);



		//MPs 
		useEffect(() => {
			if (campaign.target !== "mps") return;
			setLoading(true);
			let cancelled = false;
	
	
			fetch(
				`https://raw.githubusercontent.com/gordonmaloney/rep-data/main/MPs.json`
			)			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch councillors");
				return res.json();
			})
			.then((data) => {
	
				setMessaging(data.filter((c) => c.constituency == adminDivisions.constituency));
				setLoading(false)
			
		}).catch((err) => console.error("Could not load MPs:", err));
	
		return () => {
			cancelled = true;
		};
	
	
		}, [campaign.target, adminDivisions.constituency]);


	// Compute messaging / notMessaging
	useEffect(() => {
		if (campaign.customTargetting) return;
		if (campaign.target !== "msps") return;

		// missing constituency
		if (!adminDivisions.scotConstituency) {
			setErrorMsg("No Scottish Constituency found...");
			setLoading(false);
			return;
		}

		// wait for fetches
		if (regions.length === 0 || msps.length === 0) return;

		const constituency = adminDivisions.scotConstituency;
		const regionObj = regions.find((r) => r.constituency === constituency);

		if (!regionObj) {
			setErrorMsg("Your constituency isn’t in our region map.");
			setLoading(false);
			return;
		}

		const regionName = regionObj.region;
		const inTarget = msps.filter(
			(msp) =>
				msp.constituency === constituency || msp.constituency === regionName
		);

		setMessaging(inTarget);
		setErrorMsg("");
		setLoading(false);
	}, [campaign.target, adminDivisions.scotConstituency, regions, msps]);

	// return raw data arrays; state values are managed by parent if setters passed
	return { regions, msps };
}
