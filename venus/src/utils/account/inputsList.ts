interface InputsProps {
  name: string;
  type: string;
  id?: string;
}

export const inputs: InputsProps[] = [
  { name: "username", type: "text" },
  { name: "email", type: "email" },
  { name: "password", type: "password" },
  { name: "confirm password", type: "password", id: "confirm-password" },
];
