import Store from 'electron-store'

const schema = {
  status:{
    type: "object",
    properties: {
      endDate :{
        type: "string"
      },
      startDate: {
        type: "string"
      }
    }
  },
  maxFailures:{
    type: "number"
  },
  alarmLengthSeconds: {
    type: "number"
  },
  corruptionTimeSeconds: {
    type: "number"
  }
}

const defaultState = {
  state:{
    status: {
      startDate: '2025-02-03T17:40:00.000-04:mm',
      endDate: '2025-02-04T17:40:00.000-04:mm'
    },
    maxFailures: 4,
    alarmLengthSeconds: 60,
    corruptionTimeSeconds: 30,
    traitres: {
      akela: {
        username: "akela",
        password: "password"
      },
      hathi: {
        username: "hathi",
        password: "password"
      }
    }
  }
}

const store = new Store({
  defaults: defaultState
});


export const handleConfigRead = async () => {
  return store.get('state')
}

export const handlerConfigWrite = async (storeContents) => {
  store.set(storeContents, 'archive')
}

export default store