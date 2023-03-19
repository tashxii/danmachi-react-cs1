export class City {
  static cities: City[] = []
  static register(city: City) {
    City.cities = City.cities.concat(city)
  }

  masterClanKey: number = 1
  masterCharaKey: number = 1
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

  removeClan = (clan: Clan) => {
    this.clans = this.clans.filter(c => (c.clanKey !== clan.clanKey))
  }

  removeChara = (chara: Chara) => {
    this.charas = this.charas.filter(c => (c.charaKey !== chara.charaKey))
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
  clanKey: number | undefined
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
