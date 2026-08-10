"use client";

import React from 'react';
import PhoneIcon from "../../../icons/PhoneIcon/PhoneIcon.jsx";
import MailIcon from "../../../icons/MailIcon/MailIcon.jsx";
import ChatIcon from "../../../icons/ChatIcon/ChatIcon.jsx";
import { useIntl } from "react-intl";
import styles from "./Support.module.scss";

const iconStyle = {
	width: "18px",
	height: "18px",
	fill: "#2c2c2c"
};

const Support = () => {
	const intl = useIntl();
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.item}>
					<PhoneIcon {...iconStyle} />
					<p>
						<span className={styles.black}>{intl.formatMessage({ id: "phone" })}</span> 050 145-28-41
					</p>
				</div>
				<div className={styles.item}>
					<MailIcon {...iconStyle}/>
					<p>
						<span className={styles.black}>e-mail:</span> info@montblank.com
					</p>
				</div>
				<div className={styles.item}>
					<ChatIcon {...iconStyle}/>
					<p>
						<span className={styles.black}>{intl.formatMessage({ id: "support" })}:</span> support@montblank.com
					</p>
				</div>
			</div>
		</section>
	);
};

export default Support;
