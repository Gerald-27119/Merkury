interface InputsProps {
  name: string;
  type: string;
  id: string;
}

export const inputs: InputsProps[] = [
  { name: "username", type: "text", id: "username" },
  { name: "email", type: "email", id: "email" },
  { name: "password", type: "password", id: "password" },
  { name: "confirm password", type: "password", id: "confirm-password" },
];
