import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import authReducer from './reducers/authReducer'
import userReducer from './reducers/userReducer'
import blogReducer from './reducers/blogReducer'

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    user: authReducer,
    users: userReducer,
    blog: blogReducer,
  }
})

store.subscribe(() => { console.log(store.getState()) })

export default store