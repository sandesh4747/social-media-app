import { mainApi } from "../../app/mainApi";

export const postApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all posts
    getAllPosts: builder.query({
      query: () => ({
        url: "post",
        method: "GET",
      }),
      providesTags: ["Post"],
    }),

    // Create a post
    createPost: builder.mutation({
      query: (formData) => ({
        url: "post/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Post"],
    }),

    // Get a single post
    getSinglePost: builder.query({
      query: (postId) => ({
        url: `post/${postId}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),

    // Like/unlike
    toogleLike: builder.mutation({
      query: (id) => ({
        url: `post/like/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ id, data }) => ({
        url: `post/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `post/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    // Add a comment
    addComment: builder.mutation({
      query: ({ id, data }) => ({
        url: `post/comment/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    // Edit a comment
    editComment: builder.mutation({
      query: ({ id, commentId, data }) => ({
        url: `post/${id}/comment/${commentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    // Delete a comment
    deleteComment: builder.mutation({
      query: ({ id, commentId }) => ({
        url: `post/${id}/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useCreatePostMutation,
  useGetSinglePostQuery,
  useToogleLikeMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = postApi;
