"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { useAuth } from "../../context/AuthContext/AuthContext.jsx";
import styles from "../SignInContainer/AuthContainer.module.scss";

const SignUpContainer = () => {
	const intl = useIntl();
	const router = useRouter();
	const { register, login } = useAuth();

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
			setError("Password must be at least 6 characters");
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
				try {
					const loginRes = await login({
						login: formData.login.trim(),
						password: formData.password,
					});
					if (loginRes.success) {
						setTimeout(() => {
							router.push("/");
						}, 1200);
						return;
					}
				} catch (_) {}

				setTimeout(() => {
					router.push("/sign-in");
				}, 1500);
			} else {
				setError(res?.message || intl.formatMessage({ id: "registration_error" }));
			}
		} catch (err) {
			setError(err.message || intl.formatMessage({ id: "registration_error" }));
		} finally {
			setLoading(false);
		}
	};

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
						<label htmlFor="email">{intl.formatMessage({ id: "yourEmail" })}</label>
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
					<Link href="/sign-in">
						{intl.formatMessage({ id: "sign_in" })}
					</Link>
				</p>
			</div>
		</section>
	);
};

export default SignUpContainer;
