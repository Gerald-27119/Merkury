import AccountWrapper from "../components/AccountWrapper";
import { AccountWrapperType } from "../../../model/enum/account/accountWrapperType";
import AccountTitle from "../components/AccountTitle";
import Button from "../../../components/buttons/Button";
import { ButtonVariantType } from "../../../model/enum/buttonVariantType";

export default function Settings() {
    return (
        <AccountWrapper variant={AccountWrapperType.SETTINGS}>
            <AccountTitle text="Settings" />
            <div className="flex">
                <div className="mt-5 flex w-1/3 flex-col space-y-4 lg:ml-27">
                    <h1 className="text-3xl font-semibold">Account details</h1>
                    <div className="flex flex-col space-y-3">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-xl font-semibold">
                                Your information
                            </h3>
                            <div className="bg-darkBgSoft flex w-96 items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                                <p>Username</p>
                                <button className="text-violetLight cursor-pointer">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-xl font-semibold">E-mail</h3>
                            <div className="bg-darkBgSoft flex w-96 items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                                <p>username@gamil.com</p>
                                <button className="text-violetLight cursor-pointer">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-xl font-semibold">Password</h3>
                            <div className="bg-darkBgSoft flex w-96 items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                                <input
                                    type="password"
                                    disabled
                                    value="********"
                                />
                                <button className="text-violetLight cursor-pointer">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex w-1/2 flex-col space-y-4 lg:ml-27">
                    <h1 className="text-3xl font-semibold">Change password</h1>
                    <div className="flex w-1/2 flex-col space-y-3">
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-xl font-semibold">
                                Old Password
                            </h3>
                            <div className="bg-darkBgSoft flex items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                                <input type="password" value="********" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-xl font-semibold">
                                New Password
                            </h3>
                            <div className="bg-darkBgSoft flex items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                                <input type="password" value="********" />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <h3 className="text-xl font-semibold">
                                Confirm Password
                            </h3>
                            <div className="bg-darkBgSoft flex items-center justify-between rounded-md px-2.5 py-2 shadow-md dark:shadow-black/50">
                                <input type="password" value="********" />
                            </div>
                        </div>
                        <Button
                            className="mt-10"
                            variant={ButtonVariantType.FAVORITE_SPOT_MENU}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </AccountWrapper>
    );
}
