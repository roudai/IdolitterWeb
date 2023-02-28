export const getData = async (range: string) => {
  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig.public.baseURL + '取得差分?'
  const params = {
    key: runtimeConfig.public.apiKey,
    range,
  }
  const qyeryParams = new URLSearchParams(params)
  const { data } = await useFetch(baseUrl + qyeryParams)

  type dataObject = { [key: string]: string[][] }
  const idolData: dataObject = data.value as dataObject
  idolData.values.shift()

  return idolData
}

export const createRank = (data: string[][]) => {
  type User = {
    rank: number
    TwitterName: string
    TwitterID: string
    group: string
    oldNum: number
    newNum: number
    increaseNum: number
  }

  const rankData: User[] = []
  let rank = 1
  let rankup = 0
  for (let i = 0; i < data.length; i++) {
    if (rank > 100) {
      break
    }
    const oldNum = Number(data[i][3])
    const newNum = Number(data[i][4])
    const increaseNum = Number(data[i][5])
    if (oldNum === 0 || newNum / oldNum >= 3) {
      continue
    }

    rankData.push({
      rank,
      TwitterName: data[i][2],
      TwitterID: data[i][1],
      group: data[i][0],
      oldNum,
      newNum,
      increaseNum,
    })

    if (data[i][5] === data[i + 1][5]) {
      rankup = rankup + 1
    } else {
      rank = rank + rankup + 1
      rankup = 0
    }
  }
  return rankData
}
