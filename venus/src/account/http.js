export async function fetchRegistration(user) {
  const response = await fetch("http://localhost:8080/account/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("An error");
  }
  return response.json();
}
