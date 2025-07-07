import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseUrl = "http://localhost:5002/api";

export const baseUrl =
  import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api";

export const mainApi = createApi({
  reducerPath: "mainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
});
