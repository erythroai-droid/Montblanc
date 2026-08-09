"use client";

import React from 'react';
import PhoneIcon from "../../../icons/PhoneIcon/PhoneIcon.jsx";
import MailIcon from "../../../icons/MailIcon/MailIcon.jsx";
import ChatIcon from "../../../icons/ChatIcon/ChatIcon.jsx";
import {useIntl} from "react-intl";
const iconStyle = {
	width: "18px",
	height: "18px",
	fill:"#2c2c2c"
}
const Support = () => {
	const intl = useIntl();
	return (
		<section className="section_04">
			<div className="section_04__container">
				<div className="section_04__container icons">
					<PhoneIcon {...iconStyle} />
					<p>
						<span className="black">{intl.formatMessage({ id: "phone" })}</span> 050 145-28-41
					</p>
				</div>
				<div className="section_04__container icons">
					<MailIcon {...iconStyle}/>
					<p>
						<span className="black">e-mail:</span> info@montblank.com
					</p>

				</div>
				<div className="section_04__container icons">
					<ChatIcon {...iconStyle}/>
					<p>
						<span className="black">{intl.formatMessage({ id: "support" })}:</span> support@montblank.com
					</p>
				</div>
			</div>
		</section>
	);
};

export default Support;
