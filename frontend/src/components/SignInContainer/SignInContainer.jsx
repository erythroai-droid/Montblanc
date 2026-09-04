"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useIntl } from "react-intl";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import { API_BASE_URL } from "../../api/api.js";
import styles from "./AuthContainer.module.scss";

const SignInContainer = () => {
	const intl = useIntl();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, login, loading: authLoading } = useAuth();

	const [formData, setFormData] = useState({
		login: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam === "invalid_credentials") {
			setError(intl.formatMessage({ id: "login_error" }));
		} else if (errorParam === "oauth_cancelled") {
			setError(intl.locale === "ru" ? "Вход был отменён." : "Sign in was cancelled.");
		} else if (errorParam === "oauth") {
			setError("OAuth authentication failed. Please try again.");
		}
	}, [searchParams, intl]);

	// If already authenticated, redirect
	useEffect(() => {
		if (!authLoading && user && user.isAuth) {
			const redirectTarget = searchParams.get("redirect");
			if (redirectTarget) {
				router.push(redirectTarget);
			} else if (user.isAdmin) {
				router.push("/admin");
			} else {
				router.push("/");
			}
		}
	}, [user, authLoading, router, searchParams]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.login.trim() || !formData.password) {
			setError(intl.formatMessage({ id: "login_error" }));
			return;
		}

		setLoading(true);
		setError("");

		try {
			const res = await login(formData);
			if (res.success) {
				const redirectTarget = searchParams.get("redirect");
				if (redirectTarget) {
					router.push(redirectTarget);
				} else if (res.user?.isAdmin) {
					router.push("/admin");
				} else {
					router.push("/");
				}
			} else {
				setError(res.message || intl.formatMessage({ id: "login_error" }));
			}
		} catch (err) {
			setError(err.message || intl.formatMessage({ id: "login_error" }));
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "authentification" })}</h2>
			<div className={styles.container}>
				<form onSubmit={handleSubmit} className={styles.authForm}>
					{error && <p className={styles.errorMessage}>{error}</p>}

					<div className={styles.formGroup}>
						<label htmlFor="login">{intl.formatMessage({ id: "login" })}</label>
						<input
							id="login"
							type="text"
							name="login"
							placeholder={intl.formatMessage({ id: "login" })}
							required
							minLength={3}
							value={formData.login}
							onChange={(e) => setFormData({ ...formData, login: e.target.value })}
							disabled={loading}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="password">{intl.formatMessage({ id: "password" })}</label>
						<input
							id="password"
							type="password"
							name="password"
							placeholder={intl.formatMessage({ id: "password" })}
							required
							minLength={3}
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
							disabled={loading}
						/>
					</div>

					<button type="submit" disabled={loading} className={styles.submitButton}>
						{loading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "submit" })}
					</button>
				</form>

				<p className={styles.footerLink}>
					{intl.formatMessage({ id: "no_account" })}{" "}
					<Link href={searchParams.get("redirect") ? `/sign-up?redirect=${encodeURIComponent(searchParams.get("redirect"))}` : "/sign-up"}>
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
		</section>
	);
};

export default SignInContainer;
