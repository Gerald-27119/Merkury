import { Provider } from "../../enum/provider";

export default interface UserEditData {
  email: string;
  username: string;
  provider: Provider;
  isPasswordChanged: boolean;
  oldPassword: string;
}
