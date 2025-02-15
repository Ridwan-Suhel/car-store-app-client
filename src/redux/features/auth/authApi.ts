import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    signup: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    getUsers: builder.query({
      query: () => "/auth/users",
    }),
    // get single user
    getSingleUser: builder.query({
      query: (id) => `/auth/user/${id}`
    }),
    // update single user
    updateSingleUser: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/auth/${userId}`,
        method: "PUT",
        body: payload,
      }),
    }),
    // update single user
    updateSingleUserByPassword: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/auth/password/${userId}`,
        method: "PUT",
        body: payload,
      }),
    }),
    blockUser: builder.mutation({
      query: ({ userId, isBlocked, token }) => ({
        url: `/admin/users/${userId}/block`,
        method: 'PATCH',
        body: { isBlocked },
        headers: {
          Authorization: `${token}`,
        },
      }),
    }),
  }),
});

export const { useLoginMutation,useSignupMutation, 
  useGetUsersQuery, useBlockUserMutation,
  useUpdateSingleUserMutation,
  useUpdateSingleUserByPasswordMutation,
   useGetSingleUserQuery} = authApi;
