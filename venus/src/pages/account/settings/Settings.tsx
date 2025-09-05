import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import AccountTitle from "../components/AccountTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { editUserSettings, getUserData } from "../../../http/user-dashboard";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import DisableInput from "./components/DisableInput";
import { useState } from "react";
import { UserSettingsType } from "../../../model/enum/account/settings/userSettingsType";
import UserEditData from "../../../model/interface/account/settings/userEditData";
import FormInput from "../../../components/form/FormInput";
import Button from "../../../components/buttons/Button";
import { ButtonVariantType } from "../../../model/enum/buttonVariantType";
import useDispatchTyped from "../../../hooks/useDispatchTyped";
import { notificationAction } from "../../../redux/notification";
import { baseSchemas } from "./validation-schema/validationSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { AxiosError } from "axios";
import { Provider } from "../../../model/enum/provider";
import { getOauth2ProviderIcon } from "../../../utils/account";

type InputFieldId =
    | "username"
    | "email"
    | "oldPassword"
    | "newPassword"
    | "confirmPassword";

const inputConfig: Record<
    UserSettingsType,
    { name: string; type: string; id: InputFieldId }[]
> = {
    [UserSettingsType.USERNAME]: [
        { name: "username", type: "text", id: "username" },
    ],
    [UserSettingsType.EMAIL]: [{ name: "e-mail", type: "email", id: "email" }],
    [UserSettingsType.PASSWORD]: [
        { name: "old password", type: "password", id: "oldPassword" },
        { name: "new password", type: "password", id: "newPassword" },
        { name: "confirm password", type: "password", id: "confirmPassword" },
    ],
    [UserSettingsType.NONE]: [],
};

const getHeaderForEditType = (type: UserSettingsType): string => {
    switch (type) {
        case UserSettingsType.USERNAME:
            return "Change username";
        case UserSettingsType.EMAIL:
            return "Change e-mail";
        case UserSettingsType.PASSWORD:
            return "Change password";
        default:
            return "";
    }
};

export default function Settings() {
    const [editType, setEditType] = useState(UserSettingsType.NONE);

    const dispatch = useDispatchTyped();
    const queryClient = useQueryClient();

    const currentSchema = baseSchemas[editType] || z.object({});
    type FormSchemaType = z.infer<typeof currentSchema>;

    const {
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        trigger,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(currentSchema),
        mode: "onChange",
    });

    const { mutateAsync } = useMutation({
        mutationFn: editUserSettings,
        onSuccess: () => {
            dispatch(
                notificationAction.addSuccess({
                    message: `Successfully change your ${editType.toLowerCase()}`,
                }),
                queryClient.invalidateQueries({ queryKey: ["settings"] }),
            );
        },
        onError: (error: AxiosError) => {
            dispatch(
                notificationAction.addError({
                    message: error?.response?.data,
                }),
            );
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: getUserData,
    });

    const onSubmit: SubmitHandler<FormSchemaType> = async (formValues) => {
        const payload: UserEditData = {
            type: editType,
            provider: data?.provider!,
            ...formValues,
        };
        await mutateAsync(payload);
    };

    const handleEditType = (type: UserSettingsType) => {
        setEditType(type);
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
            {data?.provider === Provider.NONE && (
                <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0">
                    <div className="mt-5 flex w-full flex-col space-y-4 lg:ml-27 lg:w-1/3">
                        <h1 className="text-3xl font-semibold">
                            Account details
                        </h1>
                        <div className="flex w-full flex-col space-y-3">
                            {inputFields.map((field) => (
                                <DisableInput
                                    key={field.id}
                                    label={field.label}
                                    value={field.value}
                                    type={field.type}
                                    id={field.id}
                                    onEdit={() =>
                                        handleEditType(field.editType)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    {editType !== UserSettingsType.NONE && (
                        <div className="mt-5 flex w-full flex-col space-y-4 lg:mx-27 xl:mr-0 xl:w-1/2">
                            <h1 className="text-3xl font-semibold">
                                {getHeaderForEditType(editType)}
                            </h1>
                            <div className="flex w-full flex-col space-y-3 xl:w-1/2">
                                <form
                                    className="flex w-full flex-col gap-4"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    {inputConfig[editType].map(
                                        ({ name, type, id }) => (
                                            <FormInput
                                                key={id}
                                                id={id}
                                                label={name}
                                                type={type}
                                                value={watch(id) ?? ""}
                                                onChange={(e) =>
                                                    setValue(id, e.target.value)
                                                }
                                                onBlur={() => trigger(id)}
                                                isValid={{
                                                    value: !(
                                                        errors as Record<
                                                            InputFieldId,
                                                            any
                                                        >
                                                    )[id],
                                                    message:
                                                        (
                                                            errors as unknown as Record<
                                                                InputFieldId,
                                                                {
                                                                    message?: string;
                                                                }
                                                            >
                                                        )[id]?.message ?? "",
                                                }}
                                            />
                                        ),
                                    )}
                                    <Button
                                        variant={ButtonVariantType.SETTINGS}
                                        className={
                                            isValid
                                                ? "dark:hover:bg-violetDark/80 hover:bg-violetLight/80 cursor-pointer"
                                                : "cursor-default"
                                        }
                                    >
                                        Save
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {data?.provider !== Provider.NONE && (
                <div className="flex flex-col items-center rounded-md p-3 text-center text-lg">
                    <div className="mb-2 flex space-x-3">
                        <p>Your account was created via {data?.provider}</p>
                        {getOauth2ProviderIcon(data?.provider)}
                    </div>
                    <p>
                        Your email address is {data?.email} <br /> and cannot be
                        changed.
                    </p>
                </div>
            )}
        </AccountWrapper>
    );
}
