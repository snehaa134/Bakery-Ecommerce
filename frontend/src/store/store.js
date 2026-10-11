import {configureStore} from "@reduxjs/toolkit";
import { authApi } from "../servicesApis/authServices/authServices";
import { adminAuthApi } from "../servicesApis/adminAuthServices/adminAuthServices";
export const Store = configureStore({
reducer:{
[authApi.reducerPath]:authApi.reducer,
[adminAuthApi.reducerPath]: adminAuthApi.reducer,
[categoryApi.reducerPath]:categoryApi.reducer
},
middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(authApi.middleware,adminAuthApi.middleware, categoryApi.middleware)
})
export default Store;