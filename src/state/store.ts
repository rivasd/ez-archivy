import { create } from 'zustand'
import {parseISO} from 'date-fns'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ArchivyState, ArchivyActions } from './models'

export const initialState: ArchivyState = {
  LoginCooldownMinutes: 60,
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
  corruptionTimeLimitSeconds: 30
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
      }),
      attemptCorruption: ()=>set(()=>({lastCorruptionAttempt: new Date()}))
    }),
    {
      name: 'archivy-state',
      storage: createJSONStorage(() => localStorage, {
        replacer: function (key) {
          const v = this[key];  // pure dinguerie car il y a un bogue dans zustand: https://github.com/pmndrs/zustand/discussions/2403
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