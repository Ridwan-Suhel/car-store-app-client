import { baseApi } from '../../api/baseApi';
const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (payload) => ({
        url: '/orders',
        method: 'POST',
        body: payload,
      }),
    }),
    getProducts: builder.query({
        query: () => "/cars",
      }),
    verifyOrder: builder.query({
      query: (order_id) => ({
        url: "/orders/verify",
        params: { order_id },
        method: "GET",
      }),
    }),
    filterProduct: builder.query({
      query: (searchTerm) => {
        console.log("Filter Product Query - searchTerm:", searchTerm); // Log searchTerm here
    
        return {
          url: "/cars",
          params: searchTerm ,
          method: "GET",
        };
      },
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: '/cars',
        method: 'POST',
        body: payload,
      }),
    }),

    // Update a product (PUT method)
    updateProduct: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/cars/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),
    // Delete a product (DELETE method)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/cars/${id}`,
        method: 'DELETE',
      }),
    }),

    getOrders: builder.query({
      query: () => "/orders",
    }),

    // Delete a product (DELETE method)
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
    }),
    // Update a order (PUT method)
    updateOrder: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

  }),
});

export const { useGetProductsQuery, useCreateOrderMutation,
  useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation,
  useVerifyOrderQuery, useFilterProductQuery,
useGetOrdersQuery, useDeleteOrderMutation, useUpdateOrderMutation } = productApi;