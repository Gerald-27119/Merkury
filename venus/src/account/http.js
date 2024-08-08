export async function fetchRegistration(user) {
  try {
    const response = await fetch("http://localhost:8080/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      const error = new Error(errorDetails);
      error.status = response.status;
      throw error.status;
    }

    const responseData = await response.text();
    return responseData.response;
  } catch (error) {
    throw error;
  }
}
