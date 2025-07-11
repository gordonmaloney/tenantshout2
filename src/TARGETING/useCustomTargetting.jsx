import { useState, useEffect } from "react";

export function useCustomTargetting(
	customTargetting,
	{
		setLoading: externalSetLoading,
		setMessaging: externalSetMessaging,
		setNotMessaging: externalSetNotMessaging,
		setErrorMsg: externalSetErrorMsg,
	} = {}
) {
	// Unified setters (with no-op fallbacks)
	const setLoading = externalSetLoading || (() => {});
	const setMessaging = externalSetMessaging || (() => {});
	const setNotMessaging = externalSetNotMessaging || (() => {});
	const setErrorMsg = externalSetErrorMsg || (() => {});


	useEffect(() => {
		if (!customTargetting) return;

		if (customTargetting == "edregcttee") {
			setLoading(true);
			setErrorMsg("");

			const members = [
				"Neil Ross",
				"Jack Caldwell",
				"Denis Dixon",
				"Margaret Arma Graham",
				"Martha Mattos Coelho",
				"Joanna Mowat",
				"Susan Rae",
				"Conor Savage",
				"Norman Work",
			];

			fetch(
				"https://raw.githubusercontent.com/gordonmaloney/rep-data/main/edinburgh-councillors.json"
			)
				.then((res) => {
					if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
					return res.json();
				})
				.then((data) => {

                    setMessaging(data.filter((c) => members.includes(c.name)));
                    setLoading(false)
				})
				.catch((err) => {
					console.error("Error during custom targeting fetch:", err);
					setErrorMsg(err.message);
				});
		}
	}, [customTargetting]);
}
