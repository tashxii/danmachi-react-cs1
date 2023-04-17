import { City, CityCreateRequest } from "./testApiClasses"

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
