const BASE_URL = "http://localhost:4000/api";

export async function getPatients() {
  const response = await fetch(`${BASE_URL}/patients`);

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
}
