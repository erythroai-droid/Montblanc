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
									className={styles.googleBtn}
									aria-label="Sign in with Google"
								>
									<svg className={styles.oauthIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
										<path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"/>
										<path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"/>
										<path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"/>
										<path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"/>
									</svg>
									<span>{intl.formatMessage({ id: "sign_in_with_google", defaultMessage: "Sign in with Google" })}</span>
								</a>
								<a
									href="/oauth2/authorization/twitter"
									className={styles.xBtn}
									aria-label="Sign in with X"
								>
									<svg className={styles.oauthIcon} viewBox="0 0 1200 1227" width="16" height="16" fill="currentColor" aria-hidden="true">
										<path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"/>
									</svg>
									<span>{intl.formatMessage({ id: "sign_in_with_x", defaultMessage: "Sign in with X" })}</span>
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
