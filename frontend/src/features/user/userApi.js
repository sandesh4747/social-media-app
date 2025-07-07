import { mainApi } from "../../app/mainApi";

export const userApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    searchUsers: builder.query({
      query: (search) => ({
        url: `user?search=${search}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getMe: builder.query({
      query: () => ({
        url: "user/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "user/update",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    toggleFollow: builder.mutation({
      query: (userId) => ({
        url: `user/follow/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    getUserPosts: builder.query({
      query: (id) => ({
        url: `user/${id}/posts`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
  }),
});

export const {
  useSearchUsersQuery,
  useGetUserPostsQuery,
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useToggleFollowMutation,
} = userApi;
