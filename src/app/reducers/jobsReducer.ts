import { createAppSlice } from "@/app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { JobsRunningData } from "@/models/jobs"

interface JobsSliceState {
  runningJobsData: JobsRunningData
  jobsList: Array<any>
}

const initialState: JobsSliceState = {
  runningJobsData: {
    runningJobsCount: 0,
  },
  jobsList: [],
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

    setJobRunningStatus: (
      state: JobsSliceState,
      action: PayloadAction<{ jobId: string; isRunning: boolean }>,
    ) => {
      let targetJob = state.jobsList.find(e => e.id === action.payload.jobId)
      if (targetJob) {
        targetJob.isCurrentlyRunning = action.payload.isRunning
      }
    },

    setJobsList: (state: JobsSliceState, action: PayloadAction<Array<any>>) => {
      state.jobsList = action.payload
    },
  },
  selectors: {
    runningJobs: (state: JobsSliceState) => state.runningJobsData,
    jobsList: (state: JobsSliceState) => state.jobsList,
  },
})

export const { setRunningJobsCount, setJobRunningStatus, setJobsList } =
  JobsReducerSlice.actions

export const { runningJobs, jobsList } = JobsReducerSlice.selectors
