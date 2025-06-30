export const setNotification = (dispatch, message, timeout = 5000) => {
  console.log('setNotification', message)
  dispatch({ type: 'SHOW', payload: message })
  setTimeout(() => {
    dispatch({ type: 'HIDE' })
  }, timeout)
}
