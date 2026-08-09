"use client";

import { createContext, useMemo, useContext, useState, useEffect } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import messages from '../../i18n/messages.jsx';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
	const [locale, setLocale] = useState('en');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const savedLocale = localStorage.getItem('locale');
		if (savedLocale && (savedLocale === 'en' || savedLocale === 'ru' || savedLocale === 'he')) {
			setLocale(savedLocale);
		}
		setMounted(true);
	}, []);

	const handleSetLocale = (newLocale) => {
		setLocale(newLocale);
		if (typeof window !== 'undefined') {
			localStorage.setItem('locale', newLocale);
		}
	};

	const value = useMemo(() => ({ locale, setLocale: handleSetLocale }), [locale]);

	return (
		<LanguageContext.Provider value={value}>
			<IntlProvider locale={locale} messages={messages[locale] || messages['en']} defaultLocale="en">
				{children}
			</IntlProvider>
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	const intl = useIntl();
	if (!context) {
		throw new Error('useLanguage must be used within a LanguageProvider');
	}
	return {
		locale: context.locale,
		setLocale: context.setLocale,
		translate: (id) => intl.formatMessage({ id }),
	};
};

export default LanguageContext;