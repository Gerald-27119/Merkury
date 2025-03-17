import { ConfigProvider, Rate } from "antd";

export default function Stars({ text, value, ...props }) {
  return (
    <div className="flex flex-col">
      <label className=" uppercase">{text}</label>
      <ConfigProvider
        theme={{
          components: {
            Rate: {
              starBg: "#939394",
            },
          },
        }}
      >
        <Rate allowHalf defaultValue={value} {...props} />
      </ConfigProvider>
    </div>
  );
}
