/**
 * CRUX GUIDE client.
 *
 * Architecture (Phase 4):
 *   browser ──(user's Supabase JWT)──▶ Supabase Edge Function `crux-guide`
 *                                          │  verifies the user, applies safety system prompt,
 *                                          │  reads GEMINI_API_KEY from server-side secrets
 *                                          ▼
 *                                   Google Gemini API
 *
 * The Gemini key never reaches the browser. This file only talks to our own backend.
 */

export interface GuideMessage {
  role: 'user' | 'model';
  text: string;
}

export class GuideNotConfiguredError extends Error {
  constructor() {
    super('CRUX GUIDE isn’t connected yet. The secure Gemini backend is set up in Phase 4.');
    this.name = 'GuideNotConfiguredError';
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

export async function askGuide(history: GuideMessage[], opts: { accessToken?: string; signal?: AbortSignal } = {}): Promise<string> {
  if (!SUPABASE_URL || !opts.accessToken) throw new GuideNotConfiguredError();

  const res = await fetch(`${SUPABASE_URL}/functions/v1/crux-guide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${opts.accessToken}` },
    body: JSON.stringify({ messages: history }),
    signal: opts.signal,
  });
  if (res.status === 404 || res.status === 503) throw new GuideNotConfiguredError();
  if (!res.ok) throw new Error(`CRUX GUIDE had a problem (${res.status}). Please try again.`);
  const body = (await res.json()) as { reply?: string };
  if (!body.reply) throw new Error('CRUX GUIDE returned an empty answer. Please try again.');
  return body.reply;
}

const CONSENT_KEY = 'crux:guide-consent';
export const getGuideConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'yes';
  } catch {
    return false;
  }
};
export const setGuideConsent = (v: boolean) => {
  try {
    if (v) localStorage.setItem(CONSENT_KEY, 'yes');
    else localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
};
