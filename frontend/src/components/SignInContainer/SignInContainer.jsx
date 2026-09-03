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
	const { user, login } = useAuth();

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
		} else if (errorParam === "oauth") {
			setError("OAuth authentication failed. Please try again.");
		}
	}, [searchParams, intl]);

	// If already authenticated, redirect
	useEffect(() => {
		if (user && user.isAuth) {
			if (user.isAdmin) {
				router.push("/admin");
			} else {
				router.push("/");
			}
		}
	}, [user, router]);

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
				if (res.user?.isAdmin) {
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
					<Link href="/sign-up">
						{intl.formatMessage({ id: "sign_up" })}
					</Link>
				</p>

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
		</section>
	);
};

export default SignInContainer;
