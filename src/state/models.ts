
export interface Traitre {
  username: string
  password: string
  trahisonTime?: Date
}

export interface ArchivyActions {
  setWholeState: (newState: ArchivyState) => void
  setTrahison: (traitre: string) => void
  attemptCorruption: () => void
  setDisabled: () => void
  timeStep: ()=>void
}

export interface ArchivyState {
  endDate: Date
  startDate: Date
  maxFailures: number
  LoginCooldownMinutes: number
  alarmLengthSeconds: number
  corruptionTimeLimitSeconds: number
  lastCorruptionAttempt?: Date
  active: boolean
  traitres: Traitre[]
  now: Date
}


