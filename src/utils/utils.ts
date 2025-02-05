
export const toLocalISOString = (date:Date) => {
  const tzoffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 19)
}