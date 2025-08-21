import FormInput from "../../../../components/form/FormInput";
import { SpotToAddDto } from "../../../../model/interface/account/add-spot/spotToAddDto";

export default function AddSpotInput({ config, spot, onChange }) {
    return (
        <div className="w-full space-y-3">
            {" "}
            {config.map(({ name, type, id }) => (
                <FormInput
                    key={id}
                    id={id}
                    label={name}
                    type={type}
                    value={spot[name as keyof SpotToAddDto]}
                    onChange={(e) =>
                        onChange(name as keyof SpotToAddDto, e.target.value)
                    }
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
