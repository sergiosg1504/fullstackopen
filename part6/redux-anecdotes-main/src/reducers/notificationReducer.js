import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    show(action) {
      return action.payload
    },
    hide() {
      return null
    }
  }
})

export const { show, hide } = notificationSlice.actions

export const setNotification = (text, timeout) => {
  return dispatch => {
    dispatch(show(text))
    setTimeout(() => {
      dispatch(hide())
    }, timeout * 1000)
  }
}
export default notificationSlice.reducer