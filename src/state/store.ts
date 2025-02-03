import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ArchivyState } from './models'

export const useArchivyStore = create<ArchivyState>()(
  persist(
    (set) => ({
      status: {
        startDate: new Date(new Date().getTime() - (1 * 60 * 60 * 1000)),
        endDate: new Date(new Date().getTime() + (1 * 60 * 60 * 1000)),
      },
      maxFailures: 4,
      traitres: {},
      alarmLengthSeconds: 120,
      corruptionTimeSeconds: 30,
      setWholeState: (newState: ArchivyState) => set(() => ({ ...newState, status: { ...newState.status } }))
    }),
    {
      name: 'archivy-state', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useArchivyStore