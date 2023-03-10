import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parse } from 'node-html-parser'
import { checkNopol } from '$lib/recognize';

export const GET = (async ({ url }) => {
  const nopol = url.searchParams.get('nopol');
  if (!nopol) {
    return new Response('Nopol belum ditulis')
  }
  const html = await checkNopol(nopol)
  const dom = parse(html);
  
  let result: any = {};
  dom.querySelectorAll('tr').map(el => {
    const key = el.firstChild.innerText.toLowerCase().replace(/\s|\//g, '_')
    const value = el.lastChild.innerText
    result[key] = value
  })

  return new Response(JSON.stringify({
    success:true,
    result
  }));
}) satisfies RequestHandler;