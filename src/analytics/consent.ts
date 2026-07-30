export type ConsentValue = 'granted' | 'denied';

export type ConsentSettings = {
  ad_storage: ConsentValue;
  analytics_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  functionality_storage: ConsentValue;
  personalization_storage: ConsentValue;
  security_storage: ConsentValue;
};

export type ConsentChoice = 'all' | 'rejected' | 'custom';

export const CONSENT_STORAGE_KEY = 'cookie-consent';

export const REJECTED_CONSENT: ConsentSettings = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
};

export const ACCEPTED_CONSENT: ConsentSettings = {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'granted',
  security_storage: 'granted',
};

export const createCustomConsent = ({
  analytics,
  marketing,
  preferences,
}: {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}): ConsentSettings => ({
  ...REJECTED_CONSENT,
  analytics_storage: analytics ? 'granted' : 'denied',
  ad_storage: marketing ? 'granted' : 'denied',
  ad_user_data: marketing ? 'granted' : 'denied',
  ad_personalization: marketing ? 'granted' : 'denied',
  functionality_storage: preferences ? 'granted' : 'denied',
  personalization_storage: preferences ? 'granted' : 'denied',
});

type StoredConsent = {
  choice: ConsentChoice;
  settings: ConsentSettings;
};

const isConsentValue = (value: unknown): value is ConsentValue => value === 'granted' || value === 'denied';

const isConsentSettings = (value: unknown): value is ConsentSettings => {
  if (!value || typeof value !== 'object') return false;
  const settings = value as Record<keyof ConsentSettings, unknown>;
  return Object.keys(REJECTED_CONSENT).every((key) => isConsentValue(settings[key as keyof ConsentSettings]));
};

export const getStoredConsent = (): StoredConsent | null => {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    // Preserve choices made with the previous banner while migrating to v2.
    if (stored === 'granted') return { choice: 'all', settings: ACCEPTED_CONSENT };
    if (stored === 'denied') return { choice: 'rejected', settings: REJECTED_CONSENT };

    const parsed = JSON.parse(stored) as StoredConsent;
    if (!['all', 'rejected', 'custom'].includes(parsed.choice) || !isConsentSettings(parsed.settings)) return null;

    return {
      choice: parsed.choice,
      settings: { ...parsed.settings, security_storage: 'granted' },
    };
  } catch {
    return null;
  }
};

export const persistConsent = (choice: ConsentChoice, settings: ConsentSettings) => {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ choice, settings }));
};

export const updateConsentMode = (settings: ConsentSettings) => {
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function gtagFallback(...args: unknown[]) {
    window.dataLayer.push(arguments);
  };
  window.gtag = gtag;
  gtag('consent', 'update', settings);
};
