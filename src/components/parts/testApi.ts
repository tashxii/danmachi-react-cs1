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

User.init()
export type TestApiError = { code: number, message: string }
export class TestApi {
    static listUsers = async (keyword: string) => {
        const filterUsers = (keyword) ? User.users.filter(u => (u.name.indexOf(keyword) !== -1)) : User.users
        await TestApi.doSomething(filterUsers)
        return filterUsers
    }
    static createUser = async (user: User) => {
        User.register(user)
        await TestApi.doSomething(user)
        return user
    }
    private static async doSomething(resolveValue: any) {
        return new Promise((resolve, reject) => {
            setTimeout(
                () => {
                    const rand = Math.random()
                    console.log("確率", Math.round(rand * 100) + "%-(40%以上で成功)")
                    if (rand > 0.4) {
                        resolve(resolveValue)
                        return resolveValue
                    } else {
                        reject({ code: 334, message: "4割の確率で失敗しました" })
                    }
                }, 334 * 6) // wait a litle while
        })
    }
}
