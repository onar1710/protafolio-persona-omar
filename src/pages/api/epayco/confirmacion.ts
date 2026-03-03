export const prerender = false;

import { createHash } from 'node:crypto';

function sha256Hex(input: string): string {
  return createHash('sha256')
    .update(input, 'utf8')
    .digest('hex');
}

function normalize(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function safeEqual(a: string, b: string): boolean {
  const aa = a.toLowerCase();
  const bb = b.toLowerCase();
  if (aa.length !== bb.length) return false;
  let out = 0;
  for (let i = 0; i < aa.length; i++) out |= aa.charCodeAt(i) ^ bb.charCodeAt(i);
  return out === 0;
}

async function parseBody(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text();
    const params = new URLSearchParams(text);
    return Object.fromEntries(Array.from(params.entries()));
  }

  if (contentType.includes('application/json')) {
    const json = (await request.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(json).map(([k, v]) => [k, normalize(v)]));
  }

  const text = await request.text();
  const params = new URLSearchParams(text);
  return Object.fromEntries(Array.from(params.entries()));
}

export async function POST({ request }: { request: Request }): Promise<Response> {
  const pCustId = process.env.EPAYCO_P_CUST_ID_CLIENTE || '';
  const pKey = process.env.EPAYCO_P_KEY || '';

  if (!pCustId || !pKey) {
    return new Response('Missing server configuration', { status: 500 });
  }

  const body = await parseBody(request);

  const xSignature = normalize(body.x_signature);
  const xRefPayco = normalize(body.x_ref_payco);
  const xTransactionId = normalize(body.x_transaction_id);
  const xAmount = normalize(body.x_amount);
  const xCurrencyCode = normalize(body.x_currency_code);

  const toSign = `${pCustId}^${pKey}^${xRefPayco}^${xTransactionId}^${xAmount}^${xCurrencyCode}`;
  const expected = sha256Hex(toSign);

  if (!xSignature || !safeEqual(xSignature, expected)) {
    return new Response('Invalid signature', { status: 401 });
  }

  return new Response('OK', { status: 200 });
}
