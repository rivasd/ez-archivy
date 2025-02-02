
interface Status {
  endDate: Date
  startDate: Date
}

interface Traitre {
  username: string
  password: string
  trahisonTime?: Date
}

type Traitres = Record<string, Traitre>

export interface ArchivyState {
  status: Status
  maxFailures: number
  traitres: Traitres
}


