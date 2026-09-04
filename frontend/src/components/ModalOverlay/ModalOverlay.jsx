"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Close from "../../icons/Close/Close.jsx";
import { useIntl } from "react-intl";
import { API_BASE_URL } from "../../api/api.js";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import styles from "./ModalOverlay.module.scss";

const closeStyle = {
	width: "20px",
	height: "20px",
	fill: "#ffffff",
};

const ModalOverlay = ({ isOverlayOpen, onCloseOverlay }) => {
	const intl = useIntl();
	const router = useRouter();
	const { login } = useAuth();
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.login.trim() || !formData.password) {
			setError(intl.formatMessage({ id: "login_error" }));
			return;
		}

		setLoading(true);
		setError('');

		try {
			const result = await login(formData);
			if (result.success) {
				onCloseOverlay();
				router.push("/admin");
			} else {
				setError(result.message || intl.formatMessage({ id: "login_error" }));
			}
		} catch (err) {
			setError(err.message || intl.formatMessage({ id: "login_error" }));
		} finally {
			setLoading(false);
		}
	};

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
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder={intl.formatMessage({ id: "login" })}
								name="login"
								required
								minLength={3}
								value={formData.login}
								onChange={(e) => setFormData({ ...formData, login: e.target.value })}
								disabled={loading}
							/>
							<input
								type="password"
								placeholder={intl.formatMessage({ id: "password" })}
								name="password"
								required
								minLength={3}
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								disabled={loading}
							/>
							<button type="submit" disabled={loading}>
								{loading ? "..." : intl.formatMessage({ id: "submit" })}
							</button>
						</form>
						
						{error && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "10px" }}>{error}</p>}

						<p style={{ marginTop: "14px", fontSize: "13px", color: "#666" }}>
							{intl.formatMessage({ id: "no_account" })}{" "}
							<Link href="/sign-up" onClick={handleClose} style={{ color: "var(--color-green)", fontWeight: "600" }}>
								{intl.formatMessage({ id: "sign_up" })}
							</Link>
						</p>

						<div className={styles.oauthSection}>
							<div className={styles.oauthButtons}>
								<a
									href="/oauth2/authorization/google"
									className={styles.oauthBtn}
									aria-label="Sign in with Google"
								>
									<img
										src="/images/signin-assets/google_signin.svg"
										alt="Sign in with Google"
										className={styles.oauthImg}
									/>
								</a>
								<a
									href="/oauth2/authorization/twitter"
									className={`${styles.oauthBtn} ${styles.oauthXBtn}`}
									aria-label="Sign in with X"
								>
									<img
										src="/images/x-logo/web_neutral_X.png"
										alt="Sign in with X"
										className={`${styles.oauthImg} ${styles.oauthXImg}`}
									/>
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
