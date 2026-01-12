import { ForumReportReason } from "../../../model/enum/forum/forumReportReason";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ForumReportFormFields,
    ForumReportFormSchema,
} from "../../../model/zod-schemas/forumReportFormSchema";
import FormActionButtons from "./FormActionButtons";

interface ForumReportFormProps {
    onClose: () => void;
    handleReport: (reason: ForumReportReason, details: string) => void;
}

export default function ForumReportForm({
    onClose,
    handleReport,
}: ForumReportFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForumReportFormFields>({
        resolver: zodResolver(ForumReportFormSchema),
        mode: "onBlur",
        defaultValues: {
            reason: ForumReportReason.INAPPROPRIATE_CONTENT,
            details: "",
        },
    });

    const onSubmit: SubmitHandler<ForumReportFormFields> = (data) => {
        handleReport(data.reason, data.details);
        onClose();
    };

    return (
        <div className="dark:bg-darkBgSoft dark:text-darkText bg-lightBg text-lightText fixed top-35 left-1/2 z-50 w-full max-w-xl min-w-sm -translate-x-1/2 rounded-md p-8 shadow-md">
            <button
                className="absolute top-0 right-3 cursor-pointer text-4xl font-bold text-gray-500 hover:text-red-500"
                onClick={onClose}
            >
                x
            </button>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <label className="flex flex-col">
                    Reason
                    <select
                        {...register("reason")}
                        className="dark:bg-darkBg bg-lightBgSoft mt-1 rounded-lg p-2 shadow-lg"
                    >
                        {Object.values(ForumReportReason).map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                    {errors.reason && (
                        <p className="mt-1 text-xs font-bold break-words text-red-500">
                            {errors.reason.message}
                        </p>
                    )}
                </label>

                <label className="flex flex-col">
                    Details
                    <textarea
                        {...register("details")}
                        placeholder="Provide details"
                        className="dark:bg-darkBg bg-lightBgSoft dark:placeholder-darkText/50 placeholder-lightText/60 mt-1 h-24 resize-none rounded-lg p-2 shadow-lg outline-none"
                    />
                    {errors.details && (
                        <p className="mt-1 text-xs font-bold break-words text-red-500">
                            {errors.details.message}
                        </p>
                    )}
                </label>

                <FormActionButtons onCancel={onClose} submitLabel="Report" />
            </form>
        </div>
    );
}
