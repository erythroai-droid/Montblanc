"use client";

import React, { useState } from "react";
import Close from "../../icons/Close/Close.jsx";
import { useIntl } from "react-intl";
import { API_BASE_URL } from "../../api/api.js";
import styles from "./ModalOverlay.module.scss";

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
		<div className={styles.overlay} data-modal-autorization="">
			<div className={styles.popup}>
				<div className={styles.container}>
					<div className={styles.header}>
						<h3>{intl.formatMessage({ id: "authentification" })}</h3>
						<button className={styles.closeButton} onClick={handleClose}>
							<Close {...closeStyle} />
						</button>
					</div>
					<div className={styles.content}>
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
							<button type="submit" disabled={loading}>
								{loading ? "..." : intl.formatMessage({ id: "submit" })}
							</button>
						</form>
						
						{error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

						<div className={styles.oauthSection}>
							<p>Or sign in with</p>
							<div className={styles.oauthButtons}>
								<a href={`${API_BASE_URL}/oauth2/authorization/google`}>
									Google
								</a>
								<a href={`${API_BASE_URL}/oauth2/authorization/twitter`}>
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
