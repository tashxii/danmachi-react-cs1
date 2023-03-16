export class City {
  static cities: City[] = []
  static register(city: City) {
    City.cities = City.cities.concat(city)
  }
  masterClanKey: number = 0
  masterCharaKey: number = 0
  name: string
  constructor(name: string = "鬼多窮州") {
    this.name = name
  }

  get isNew() {
    return City.cities.filter(c => c === this).length === 0
  }

  clans: Clan[] = []
  charas: Chara[] = []
  addClan = (clan: Clan) => {
    clan.clanKey = this.masterClanKey++
    clan.city = this
    this.clans = this.clans.concat(clan)
  }
  addChara = (chara: Chara) => {
    chara.charaKey = this.masterCharaKey++
    chara.city = this
    this.charas = this.charas.concat(chara)
  }
}

export class Clan {
  city?: City
  clanKey: number = -1
  name: string = ""
  description: string = ""

  get charaCount() {
    return this.city?.charas.filter(c => c.clanKey === this.clanKey).length
  }

  get isNew() {
    return this.clanKey === -1
  }
}

export class Chara {
  city?: City
  charaKey: number = -1
  name: string = ""
  job: string = ""
  clanKey: number = -1
  str: number
  vit: number
  int: number
  dex: number
  luc: number
  constructor() {
    this.str = Math.floor(Math.random() * 20) + 1
    this.vit = Math.floor(Math.random() * 20) + 1
    this.int = Math.floor(Math.random() * 20) + 1
    this.dex = Math.floor(Math.random() * 20) + 1
    this.luc = Math.floor(Math.random() * 20) + 1
  }

  get isNew() {
    return this.charaKey === -1
  }
}

export class CityCreateRequest {
  city: City
  constructor(city: City) {
    this.city = city
  }
}


export type TestApiError = { code: number, message: string }
export class TestApi {
  static getCity = async (name: string) => {
    const foundCity = (name && name !== "") ? City.cities.find(c => (c.name.indexOf(name) !== -1)) : undefined
    await TestApi.doSomething(foundCity)
    return foundCity
  }
  static createCity = async (request: CityCreateRequest) => {
    const callback = (request: CityCreateRequest) => {
      City.register(request.city)
      return request.city
    }
    await TestApi.doSomething(request, callback).then((value) => (value))
    return request.city
  }
  private static async doSomething(resolveValue: any, callback?: (resolveValue: any) => any) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          const rand = Math.random()
          console.log("確率", Math.round(rand * 100) + "%-(30%以上で成功)")
          if (rand > 0.3) {
            if (callback) {
              resolve(callback(resolveValue))
            } else {
              resolve(resolveValue)
            }
          } else {
            reject({ code: 334, message: "3割の確率で失敗しました" })
          }
        }, 334) // wait a litle while
    })
  }
}
