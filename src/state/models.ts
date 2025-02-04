
export interface Traitre {
  username: string
  password: string
  trahisonTime?: Date
}

export interface ArchivyActions {
  setWholeState: (newState: ArchivyState) => void
  setTrahison: (traitre: string) => void
}

export interface ArchivyState {
  endDate: Date
  startDate: Date
  maxFailures: number
  maxLoginAttempts: number
  LoginAttemptsCooldownSeconds: number
  alarmLengthSeconds: number
  corruptionTimeLimitSeconds: number
  traitres: Traitre[]
}


