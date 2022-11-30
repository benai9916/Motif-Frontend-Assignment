export const getDate = () => {
  let dateTime = new Date()
  dateTime.setSeconds(0)
  return dateTime.toLocaleString("en-US")?.replace(',', '')?.replace(':00', '')
}