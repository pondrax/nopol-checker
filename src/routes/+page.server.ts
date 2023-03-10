import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = ({url}) => {
  const nopol = url.searchParams.get('nopol')
  return {
    nopol,
    origin:url.origin
  }
}

export const actions: Actions = {
  async default({request, fetch}){
    const form = await request.formData()
    const nopol = form.get('nopol')
    const req = await fetch('/api?nopol='+ nopol)
    const result = await req.json()
    console.log(result)
    return result
  }
}