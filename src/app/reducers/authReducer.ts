import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@/app/createAppSlice"

export interface AuthenticationSliceState {
  authToken?: string
}

const initialState: AuthenticationSliceState = {
  authToken: undefined,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const AuthenticationSlice = createAppSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    setAuthToken: create.reducer(
      (state: AuthenticationSliceState, action: PayloadAction<string>) => {
        state.authToken = action.payload
      },
    ),
    disconnect: create.reducer((state: AuthenticationSliceState) => {
      state.authToken = undefined
    }),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    /* incrementAsync: create.asyncThunk(
            async (amount: number) => {
                const response = await fetchCount(amount)
                // The value we return becomes the `fulfilled` action payload
                return response.data
            },
            {
                pending: state => {
                    state.status = "loading"
                },
                fulfilled: (state, action) => {
                    state.status = "idle"
                    state.value += action.payload
                },
                rejected: state => {
                    state.status = "failed"
                },
            },
        ),*/
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    auth_token: state => state.authToken,
  },
})

// Action creators are generated for each case reducer function.
export const { setAuthToken, disconnect } = AuthenticationSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { auth_token } = AuthenticationSlice.selectors
