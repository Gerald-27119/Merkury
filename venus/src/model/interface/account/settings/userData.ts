import { Provider } from "../../../enum/provider";

export default interface UserData {
    username: string;
    email: string;
    provider: Provider;
}
