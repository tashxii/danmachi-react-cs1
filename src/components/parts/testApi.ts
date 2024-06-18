import { City, CityCreateRequest } from "./testApiClasses"

export type TestApiError = { code: number, message: string }
export class TestApi {
  static getCity = async (name: string) => {
    let foundCity = (name && name !== "") ? City.cities.find(c => (c.name.indexOf(name) !== -1)) || new City("南九州") : new City("北九州")
    await TestApi.doSomething<City>(foundCity)
    return Promise.resolve(foundCity)
  }
  static createCity = async (request: CityCreateRequest) => {
    const callback = (city: City) => {
      City.register(city)
      return city
    }
    await TestApi.doSomething<City>(request.city, callback).then((value) => (value))
    return Promise.resolve(request.city)
  }
  private static async doSomething<T>(resolveValue: T, callback?: (resolveValue: T) => T) {
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
