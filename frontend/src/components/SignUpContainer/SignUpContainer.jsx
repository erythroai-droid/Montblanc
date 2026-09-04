"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useIntl } from "react-intl";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import styles from "../SignInContainer/AuthContainer.module.scss";

const SignUpContainer = () => {
	const intl = useIntl();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, register, login, loading: authLoading } = useAuth();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		login: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

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

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!formData.name.trim()) {
			setError(intl.formatMessage({ id: "inputName" }));
			return;
		}
		if (!formData.email.trim()) {
			setError(intl.formatMessage({ id: "inputEmail" }));
			return;
		}
		if (!formData.login.trim()) {
			setError(intl.formatMessage({ id: "login" }));
			return;
		}
		if (formData.password.length < 6) {
			setError(intl.locale === "ru" ? "Пароль должен быть не менее 6 символов" : "Password must be at least 6 characters");
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setError(intl.formatMessage({ id: "passwords_mismatch" }));
			return;
		}

		setLoading(true);

		try {
			const res = await register({
				name: formData.name.trim(),
				email: formData.email.trim(),
				login: formData.login.trim(),
				password: formData.password,
			});

			if (res && res.success) {
				setSuccess(intl.formatMessage({ id: "registration_success" }));
				// Auto-login upon successful registration
				const redirectTarget = searchParams.get("redirect");
				try {
					const loginRes = await login({
						login: formData.login.trim(),
						password: formData.password,
					});
					if (loginRes.success) {
						setTimeout(() => {
							router.push(redirectTarget || "/");
						}, 1000);
						return;
					}
				} catch (_) {}

				setTimeout(() => {
					router.push(redirectTarget ? `/sign-in?redirect=${encodeURIComponent(redirectTarget)}` : "/sign-in");
				}, 1200);
			} else {
				setError(res?.message || intl.formatMessage({ id: "registration_error" }));
			}
		} catch (err) {
			setError(err.message || intl.formatMessage({ id: "registration_error" }));
		} finally {
			setLoading(false);
		}
	};

	const redirectParam = searchParams.get("redirect");
	const signInHref = redirectParam ? `/sign-in?redirect=${encodeURIComponent(redirectParam)}` : "/sign-in";

	return (
		<section className={styles.section}>
			<h2>{intl.formatMessage({ id: "sign_up" })}</h2>
			<div className={styles.container}>
				<form onSubmit={handleSubmit} className={styles.authForm}>
					{error && <p className={styles.errorMessage}>{error}</p>}
					{success && <p className={styles.successMessage}>{success}</p>}

					<div className={styles.formGroup}>
						<label htmlFor="name">{intl.formatMessage({ id: "yourName" })}</label>
						<input
							id="name"
							type="text"
							name="name"
							placeholder={intl.formatMessage({ id: "yourName" })}
							required
							minLength={2}
							value={formData.name}
							onChange={handleChange}
							disabled={loading}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="email">{intl.formatMessage({ id: "yourEmail", defaultMessage: "Email" })}</label>
						<input
							id="email"
							type="email"
							name="email"
							placeholder="example@mail.com"
							required
							value={formData.email}
							onChange={handleChange}
							disabled={loading}
						/>
					</div>

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
							onChange={handleChange}
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
							minLength={6}
							value={formData.password}
							onChange={handleChange}
							disabled={loading}
						/>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="confirmPassword">{intl.formatMessage({ id: "confirm_password" })}</label>
						<input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							placeholder={intl.formatMessage({ id: "confirm_password" })}
							required
							minLength={6}
							value={formData.confirmPassword}
							onChange={handleChange}
							disabled={loading}
						/>
					</div>

					<button type="submit" disabled={loading} className={styles.submitButton}>
						{loading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "submit" })}
					</button>
				</form>

				<p className={styles.footerLink}>
					{intl.formatMessage({ id: "have_account" })}{" "}
					<Link href={signInHref}>
						{intl.formatMessage({ id: "sign_in" })}
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

export default SignUpContainer;
