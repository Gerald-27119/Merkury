import FormInput from "../../../../components/form/FormInput";
import { SpotToAddDto } from "../../../../model/interface/account/add-spot/spotToAddDto";

interface AddSpotInputProps {
    config: { name: keyof SpotToAddDto; type: string; id: string }[];
    spot: SpotToAddDto;
    onChange: <K extends keyof SpotToAddDto>(
        key: K,
        value: SpotToAddDto[K],
    ) => void;
}

//todo zrobić validację
export default function AddSpotInput({
    config,
    spot,
    onChange,
}: AddSpotInputProps) {
    return (
        <div className="w-full space-y-3">
            {config.map(({ name, type, id }) => (
                <FormInput
                    key={id}
                    id={id}
                    label={name}
                    type={type}
                    value={spot[name] as string}
                    onChange={(e) => onChange(name, e.target.value)}
                    onBlur={() => {}}
                    isValid={{
                        value: true,
                        message: "",
                    }}
                />
            ))}
        </div>
    );
}
