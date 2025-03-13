
export const toLocalISOString = (date?:Date) => {
  if(!date) return undefined
  const tzoffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 19)
}