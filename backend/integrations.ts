// LevelUp.ai Agent 5 API Integrations
// Proxycurl, WhatsApp parser, 360dialog, PostHog, Stripe
// See CLAUDE.md for full architecture

export type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
export interface LinkedInProfile { name: string; role: string; company: string; }
