interface AccountTileProps {
    text: string;
}

export default function AccountTitle({ text }: AccountTileProps) {
    return (
        <h1
            data-testid={text}
            className="text-center text-4xl font-semibold capitalize lg:ml-27 lg:text-start"
        >
            {text}
        </h1>
    );
}
