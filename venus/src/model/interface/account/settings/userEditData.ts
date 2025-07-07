import { Provider } from "../../../enum/provider";
import { UserSettingsType } from "../../../enum/account/settings/userSettingsType";

export default interface UserEditData {
    username: string;
    email: string;
    provider: Provider;
    oldPassword: string;
    confirmPassword: string;
    type: UserSettingsType;
}
