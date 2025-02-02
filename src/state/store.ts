import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {ArchivyState} from './models'

export const useArchivyStore = create<ArchivyState>()(
  persist(
    (set, get) => ({
      status:{
        startDate: new Date(new Date().getTime() - (1 * 60 * 60 * 1000)),
        endDate: new Date(new Date().getTime() + (1 * 60 * 60 * 1000)),
      },
      maxFailures: 4,
      traitres: {}
    }),
    {
      name: 'food-storage' // name of the item in the storage (must be unique)
    },
  ),
)

export default useArchivyStore