/**
 * Web3Forms access key — public client key (domain-restricted on web3forms.com).
 * Override with VITE_WEB3FORMS_KEY in .env.local if you rotate the key.
 */
export const WEB3FORMS_ACCESS_KEY =
  (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined)?.trim() ||
  '27fd6a80-d2fb-4f48-b53c-08ef083a04d0';

export const WEB3FORMS_SUBMIT_URL = 'https://api.web3forms.com/submit';
