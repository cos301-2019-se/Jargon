export class LoginDetails {
    public email: string;
    public password: string;

    constructor() {
        this.email = "";
        this.password = "";
    }
}

export class RegisterDetails {
    public name: string;
    public surname: string;
    public email: string;
    public username: string;
    public password: string;
    public passwordConfirm: string;
    public admin: boolean;

    constructor() {
        this.name = "";
        this.surname = "";
        this.email = "";
        this.username = "";
        this.password = "";
        this.admin = false;
    }
}

export class User {
    public id: string;
    public name: string;
    public surname: string;
    public email: string;
    public username: string;
    public password: string;
    public passwordConfirm: string;
    public admin: boolean;

    constructor() {
        this.id = "";
        this.name = "";
        this.surname = "";
        this.email = "";
        this.username = "";
        this.password = "";
        this.admin = false;
    }

    compare(user: User) {
        return this.name == user.name &&
            this.surname == user.surname &&
            this.email == user.email &&
            this.username == user.username;
    }
}