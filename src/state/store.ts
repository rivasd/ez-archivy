import { create } from 'zustand'
import {parseISO} from 'date-fns'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ArchivyState, ArchivyActions } from './models'

export const initialState: ArchivyState = {
  LoginAttemptsCooldownSeconds: 60,
  maxLoginAttempts: 3,
  startDate: new Date(new Date().getTime() - (1 * 60 * 60 * 1000)),
  endDate: new Date(new Date().getTime() + (1 * 60 * 60 * 1000)),
  maxFailures: 4,
  traitres: [
    {
      username: 'Akela',
      password: 'letsfuckinggo'
    },
    {
      username: 'test',
      password: 'test'
    }
  ],
  alarmLengthSeconds: 120,
  corruptionTimeSeconds: 30
}

export const useArchivyStore = create<ArchivyState & ArchivyActions>()(
  persist(
    (set) => ({
      ...initialState,
      setWholeState: (newState: ArchivyState) => set(() => ({ ...newState, traitres:[...newState.traitres] })),
      setTrahison: (username: string)=>set((state)=>{
        const newTraitres = state.traitres.map((traitre)=>(
          traitre.username == username ? {...traitre, trahisonTime: new Date()} : {...traitre}
        ))
        return {...state, traitres: newTraitres}
      })
    }),
    {
      name: 'archivy-state', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage, {
        replacer: function (key) {
          const v = this[key];
          
          if (v instanceof Date) {
            return { __type: 'Date', value: v.toISOString() };
          }
    
          return v;
        },
        reviver: function(_, value: any) {
          if (value?.__type === 'Date') {
            return parseISO(value.value);
          }
    
          return value;
        },
      }),
    },
  ),
)

export default useArchivyStore