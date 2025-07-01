import { ConfigProvider, DatePicker } from "antd";
import { Dayjs } from "dayjs";

interface DateChooserProps {
  text: string;
  onChange: (value: Dayjs) => void;
}

export default function DateChooser({ text, onChange }: DateChooserProps) {
  return (
    <div className="flex flex-col items-center sm:flex-row">
      <p>{text}</p>
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
