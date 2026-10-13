import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../servicesApis/authServices/authServices";
import { adminAuthApi } from "../servicesApis/adminAuthServices/adminAuthServices";
import { categoryApi } from "../servicesApis/adminCategoryServices/adminCategoryServices";
import { bannerApi } from "../servicesApis/bannerServices/bannerServices";
import { userApi } from "../servicesApis/userServices/userServices";
export const Store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminAuthApi.reducerPath]: adminAuthApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, adminAuthApi.middleware, categoryApi.middleware, bannerApi.middleware,userApi.middleware)
})
export default Store;