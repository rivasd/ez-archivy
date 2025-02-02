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

const store = new Store({
  defaults: {
    status: {},
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
});

export const handleConfigRead = async () => {
  return store.get('archive')
}

export const handlerConfigWrite = async (storeContents) => {
  store.set(storeContents, 'archive')
}

export default store