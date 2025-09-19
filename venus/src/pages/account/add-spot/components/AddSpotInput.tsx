import FormInput from "../../../../components/form/FormInput";
import { SpotToAddDto } from "../../../../model/interface/account/add-spot/spotToAddDto";
import { ChangeEvent, useState } from "react";
import { spotSchema } from "../validation-schema/spotSchema";

interface AddSpotInputProps {
    config: { name: keyof SpotToAddDto; type: string; id: string }[];
    spot: SpotToAddDto;
    onChange: <K extends keyof SpotToAddDto>(
        key: K,
        value: SpotToAddDto[K],
    ) => void;
}

export default function AddSpotInput({
    config,
    spot,
    onChange,
}: AddSpotInputProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (name: keyof SpotToAddDto, value: string) => {
        const singleFieldSchema = spotSchema.pick({ [name]: true });
        const result = singleFieldSchema.safeParse({ [name]: value });

        if (!result.success) {
            const message = result.error.issues[0].message;
            setErrors((prev) => ({ ...prev, [name]: message }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleChange = (
        name: keyof SpotToAddDto,
        e: ChangeEvent<HTMLInputElement>,
    ) => {
        onChange(name, e.target.value);
        validateField(name, e.target.value);
    };

    return (
        <div className="w-full space-y-3">
            {config.map(({ name, type, id }) => (
                <FormInput
                    key={id}
                    id={id}
                    label={name}
                    type={type}
                    value={spot[name] as string}
                    onChange={(e) => handleChange(name, e)}
                    onBlur={() => validateField(name, spot[name] as string)}
                    isValid={{
                        value: !errors[name],
                        message: errors[name] || "",
                    }}
                />
            ))}
        </div>
    );
}
