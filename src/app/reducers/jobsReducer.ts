import { createAppSlice } from "@/app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { JobsRunningData } from "@/models/jobs"

interface JobsSliceState {
  runningJobsData: JobsRunningData
}

const initialState: JobsSliceState = {
  runningJobsData: {
    runningJobsCount: 0,
  },
}

export const JobsReducerSlice = createAppSlice({
  name: "jobs",
  initialState,
  reducers: {
    setRunningJobsCount: (
      state: JobsSliceState,
      action: PayloadAction<number>,
    ) => {
      state.runningJobsData.runningJobsCount = action.payload
    },
  },
  selectors: {
    runningJobs: (state: JobsSliceState) => state.runningJobsData,
  },
})

export const { setRunningJobsCount } = JobsReducerSlice.actions

export const { runningJobs } = JobsReducerSlice.selectors
