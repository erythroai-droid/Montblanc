"use client";

import React, { useState } from "react";
import Close from "../../icons/Close/Close.jsx";
import { useIntl } from "react-intl";
import { API_BASE_URL } from "../../api/api.js";

const closeStyle = {
	width: "20px",
	height: "20px",
	fill: "#ffffff",
};

const ModalOverlay = ({ isOverlayOpen, onCloseOverlay }) => {
	const intl = useIntl();
	const [formData, setFormData] = useState({
		login: '',
		password: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleClose = (e) => {
		if (e) e.preventDefault();
		onCloseOverlay();
	};

	const loginActionUrl = `${API_BASE_URL}/login`;

	return (
		<div className="overlay" data-modal-autorization="">
			<div className="popup_autorization">
				<div className="popup_autorization__container">
					<div className="popup_autorization__header">
						<h3>{intl.formatMessage({ id: "authentification" })}</h3>
						<div className="popup_autorization__close">
							<button className="cart-close" onClick={handleClose}>
								<Close {...closeStyle} />
							</button>
						</div>
					</div>
					<div className="popup_autorization__content">
						<form action={loginActionUrl} method="POST">
							<input
								type="text"
								placeholder={intl.formatMessage({ id: "login" })}
								name="login"
								required
								minLength={3}
								value={formData.login}
								onChange={(e) => setFormData({ ...formData, login: e.target.value })}
							/>
							<input
								type="password"
								placeholder={intl.formatMessage({ id: "password" })}
								name="password"
								required
								minLength={3}
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							/>
							<button type="submit" className="button" disabled={loading}>
								{loading ? "..." : intl.formatMessage({ id: "submit" })}
							</button>
						</form>
						
						{error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

						<div style={{ marginTop: "16px", textAlign: "center" }}>
							<p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Or sign in with</p>
							<div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
								<a
									href={`${API_BASE_URL}/oauth2/authorization/google`}
									className="button"
									style={{ fontSize: "12px", padding: "6px 12px", textDecoration: "none" }}
								>
									Google
								</a>
								<a
									href={`${API_BASE_URL}/oauth2/authorization/twitter`}
									className="button"
									style={{ fontSize: "12px", padding: "6px 12px", textDecoration: "none" }}
								>
									X (Twitter)
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalOverlay;
