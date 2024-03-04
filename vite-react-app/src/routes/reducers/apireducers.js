import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken } from './authSlice';


const baseQuery = (baseQueryOptions) => async (args, api, extraOptions) => {
  const result = await fetchBaseQuery(baseQueryOptions)(args, api, extraOptions);
	//https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
  if (result.error && result.error.data && result.error.data.status === 401) {
    // if unauthorized error, then logout, so delete token api.dispatch
    api.dispatch(setToken(null));
  }

  return result;
};

export const api = createApi({
	baseQuery: baseQuery({
		baseUrl: `${process.env.NODE_ENV === 'production' ? 'https://tweetnest.onrender.com': 'http://localhost:5000'}/api/`,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token;
			if(token) {
				// to login to our nodejs app
				headers.set('Authorization', `Bearer ${token}`);
			}
			return headers;
		}
	}),
	tagTypes: ['Medias'],
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: 'users/login',
				method: 'POST',
				body: credentials,
			}),
		}),
		register: builder.mutation({
			query: (newinfo) => ({
				url: 'users/register',
				method: 'POST',
				body: newinfo,
			})
		}),
		currentUser: builder.query({
			query: () => 'users/current'
		}),
		medias: builder.query({
			query: ({ sortBy, sortOrder, media_type }) => `users/getMediaDetails?sortBy=${sortBy}&sortOrder=${sortOrder}&media_type=${media_type}`,
			providesTags: (result) =>
				Array.isArray(result) ? [
            ...result.map(m => ({ type: 'Medias', id: m.mediauserinfo.puuid })),
            { type: 'Medias' },
					]
					:
					[{ type: 'Medias' }]
		}),
		updatelastcheckdate: builder.mutation({
			query: (dateobj) => ({
				url: 'users/updateLastCheckDate',
				method:'POST',
				body: dateobj,
			})
		}),
		addMedia: builder.mutation({
			query: (mediaobj) => ({
				url: 'users/addMedia',
				method: 'POST',
				body: mediaobj,
			}),
			invalidatesTags: ['Medias'],
		}),
		deleteMedia: builder.mutation({
			query: (delObj) => ({
				url: 'users/deleteMedia',
				method: 'POST',
				body: delObj,
			}),
			/*
			invalidatesTags: (result, error, args) => {
				return [{ type: 'Medias', id: args.media_id }]
			},*/ // causes race condition if multiple invalidates in a row in our case.
		}),
	})
});

export const { useLoginMutation, useLazyCurrentUserQuery, useRegisterMutation, useLazyMediasQuery, useLazyUpdateLastCheckDate, useAddMediaMutation, useDeleteMediaMutation } = api;

//how to access api data, you get it only through the subscription call 'useLoginMutation' { data, isLoading, }?
//how does the id refetch work. so each useLoginMutation call, if it has different parameters, it will create it's own data instance.
// thats why the 'providesTags' will be different for each one. some will refetch some won't.
// react router will fetch any calls in loader. Can we use rtkquery subscription in a loader. or are the hooks specific only to component use.
// purpose of a loader is to call api before component is mounted/rendered.
// query can use lazy, but mutation already returns 'lazy trigger' by default