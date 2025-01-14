export async function signUp(email: string, name: string, password: string) {
  const url = `/api/auth/signup`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ email, name, password }),
  });

  if (response.status !== 200) {
    throw new Error("Something Went Wrong");
  } else {
    return true;
  }
}
