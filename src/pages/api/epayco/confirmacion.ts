export const prerender = false;
export async function POST({ request }: { request: Request }): Promise<Response> {
  void request;
  return new Response('Gone', { status: 410 });
}
