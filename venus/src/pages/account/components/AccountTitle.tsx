interface AccountTileProps {
  text: string;
}

export default function AccountTitle({ text }: AccountTileProps) {
  return <h1 className="text-4xl font-semibold capitalize lg:ml-27">{text}</h1>;
}
