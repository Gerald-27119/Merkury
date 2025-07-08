import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import AccountTitle from "../components/AccountTitle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { editUserSettings, getUserData } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import DisableInput from "./components/DisableInput";
import { FormEvent, useState } from "react";
import { UserSettingsType } from "../../../model/enum/account/settings/userSettingsType";
import UserEditData from "../../../model/interface/account/settings/userEditData";
import FormInput from "../../../components/form/FormInput";
import useUserDataValidation from "../../../hooks/useUserDataValidation";

export default function Settings() {
    const [editType, setEditType] = useState(UserSettingsType.NONE);
    const [inputs, setInputs] = useState<
        { name: string; type: string; id: string }[]
    >([]);

    const {
        enteredValue,
        didEdit,
        isValid,
        handleInputChange,
        handleInputBlur,
    } = useUserDataValidation({
        password: "",
        username: "",
        email: "",
        "confirm-password": "",
    });

    const { mutateAsync } = useMutation({
        mutationFn: editUserSettings,
    });

    const { data, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: getUserData,
    });

    const handleEdit = async (e: FormEvent) => {
        e.preventDefault();

        const userEdit: UserEditData = {
            username: enteredValue.username,
            email: enteredValue.email,
            oldPassword: enteredValue.oldPassword,
            newPassword: enteredValue.newPassword,
            confirmPassword: enteredValue.confirmPassword,
            type: editType,
            provider: data?.provider!,
        };

        if (editType === UserSettingsType.PASSWORD) {
            userEdit.username = "";
            userEdit.email = "";
        }

        if (editType === UserSettingsType.EMAIL) {
            userEdit.username = "";
            userEdit.oldPassword = "";
            userEdit.confirmPassword = "";
            userEdit.newPassword = "";
        }

        if (editType === UserSettingsType.USERNAME) {
            userEdit.email = "";
            userEdit.oldPassword = "";
            userEdit.confirmPassword = "";
            userEdit.newPassword = "";
        }

        await mutateAsync(userEdit);
    };

    const handleEditType = (type: UserSettingsType) => {
        setEditType(type);

        if (type === UserSettingsType.USERNAME) {
            setInputs([{ name: "username", type: "text", id: "username" }]);
        } else if (type === UserSettingsType.EMAIL) {
            setInputs([{ name: "e-mail", type: "email", id: "email" }]);
        } else {
            setInputs([
                { name: "old password", type: "password", id: "oldPassword" },
                { name: "new password", type: "password", id: "newPassword" },
                {
                    name: "confirm password",
                    type: "password",
                    id: "confirmPassword",
                },
            ]);
        }
    };

    const inputFields = [
        {
            label: "Your information",
            value: data?.username,
            type: "text",
            id: "disabled-your-information",
            editType: UserSettingsType.USERNAME,
        },
        {
            label: "E-mail",
            value: data?.email,
            type: "email",
            id: "disabled-email",
            editType: UserSettingsType.EMAIL,
        },
        {
            label: "Password",
            value: "********",
            type: "password",
            id: "disabled-password",
            editType: UserSettingsType.PASSWORD,
        },
    ];

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <AccountWrapper variant={AccountWrapperType.SETTINGS}>
            <AccountTitle text="Settings" />
            <div className="flex">
                <div className="mt-5 flex w-1/3 flex-col space-y-4 lg:ml-27">
                    <h1 className="text-3xl font-semibold">Account details</h1>
                    <div className="flex flex-col space-y-3">
                        {inputFields.map((field) => (
                            <DisableInput
                                key={field.id}
                                label={field.label}
                                value={field.value}
                                type={field.type}
                                id={field.id}
                                onEdit={() => handleEditType(field.editType)}
                            />
                        ))}
                    </div>
                </div>
                {editType !== UserSettingsType.NONE && (
                    <div className="mt-5 flex w-1/2 flex-col space-y-4 lg:ml-27">
                        <h1 className="text-3xl font-semibold">
                            {editType === UserSettingsType.PASSWORD
                                ? "Change password"
                                : editType === UserSettingsType.EMAIL
                                  ? "Change e-mail"
                                  : "Change username"}
                        </h1>

                        <div className="flex w-1/2 flex-col space-y-3">
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={handleEdit}
                            >
                                {inputs.map(({ name, type, id }) => (
                                    <FormInput
                                        key={id}
                                        label={name}
                                        type={type}
                                        id={id}
                                        onChange={(event) =>
                                            handleInputChange(id, event)
                                        }
                                        value={enteredValue[id]}
                                        onBlur={() => handleInputBlur(id)}
                                        isValid={isValid[id]}
                                    />
                                ))}
                                <button type={"submit"}>Save</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AccountWrapper>
    );
}
