let masterId = 1
export class User {
    static users: User[] = []
    id: number
    name: string
    job: string
    str: number
    vit: number
    int: number
    dex: number
    luc: number
    constructor(name: string, job: string) {
        this.id = masterId++
        this.name = name
        this.job = job
        this.str = Math.floor(Math.random() * 20) + 1
        this.vit = Math.floor(Math.random() * 20) + 1
        this.int = Math.floor(Math.random() * 20) + 1
        this.dex = Math.floor(Math.random() * 20) + 1
        this.luc = Math.floor(Math.random() * 20) + 1
        console.log(this)
    }
    static init() {
        User.users = [User.new("くらうど", "勇者"), User.new("アリババ", "盗賊")]
    }
    static new(name: string, job: string) {
        const user = new User(name, job)
        User.users.push(user)
        return user
    }
    static register(user: User) {
        User.users.push(user)
    }
}
export class UserCreateRequest {
    name: string
    job: string
    constructor(name: string, job: string) {
        this.name = name
        this.job = job
    }
}
User.init()
export type TestApiError = { code: number, message: string }
export class TestApi {
    static listUsers = async (keyword: string) => {
        console.log(User.users)
        const filterUsers = (keyword && keyword !== "") ? User.users.filter(u => (u.name.indexOf(keyword) !== -1)) : User.users
        await TestApi.doSomething(filterUsers)
        return filterUsers
    }
    static createUser = async (request: UserCreateRequest) => {
        const callback = (request: UserCreateRequest) => {
            const user = new User(request.name, request.job)
            User.register(user)
            return user
        }
        await TestApi.doSomething(request, callback).then((value) => (value))
        return User.users[User.users.length - 1]
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
