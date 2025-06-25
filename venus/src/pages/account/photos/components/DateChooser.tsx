import { ConfigProvider, DatePicker } from "antd";
import { Dayjs } from "dayjs";

interface DateChooserProps {
  type: "from" | "to";
  onChange: (value: Dayjs) => void;
}

export default function DateChooser({ type, onChange }: DateChooserProps) {
  return (
    <div className="flex items-center">
      <p>{type === "to" ? "To:" : "From:"}</p>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#363041",
            colorBgContainer: "#363041",
            colorText: "#e5e5e5",
            borderRadius: 8,
          },
          components: {
            DatePicker: {
              colorBorder: "transparent",
              colorBgContainer: "#363041",
              colorTextPlaceholder: "#e5e5e5",
              colorTextDisabled: "#939394",
              colorBgElevated: "#363041",
            },
          },
        }}
      >
        <DatePicker
          onChange={onChange}
          style={{
            border: "none",
            boxShadow: "none",
            backgroundColor: "#363041",
            color: "#e5e5e5",
          }}
        />
      </ConfigProvider>
    </div>
  );
}
