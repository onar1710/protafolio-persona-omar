import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

type Body = {
  referencia?: string;
  montoCentavos?: number;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Body;
    const referencia = typeof body?.referencia === 'string' ? body.referencia : '';
    const montoCentavosRaw = body?.montoCentavos;

    const montoCentavos =
      typeof montoCentavosRaw === 'number' && Number.isFinite(montoCentavosRaw) ? montoCentavosRaw : 0;

    if (!referencia || !montoCentavos) {
      return new Response(JSON.stringify({ error: 'Faltan datos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secreto = import.meta.env.WOMPI_INTEGRITY_SECRET;
    if (!secreto) {
      return new Response(JSON.stringify({ error: 'Secreto no configurado' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cadena = `${referencia}${montoCentavos}COP${secreto}`;
    const firma = crypto.createHash('sha256').update(cadena, 'utf8').digest('hex');

    return new Response(JSON.stringify({ firma }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
