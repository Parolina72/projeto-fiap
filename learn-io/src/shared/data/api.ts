export interface IUser {
  id?: number;
  username: string;
  password: string;
  role: string;
}

export interface IPerson {
  id?: number;
  cpf: string;
  name: string;
  birth: Date;
  email: string;
  user_id?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function createPerson(person: Omit<IPerson, "id">): Promise<IPerson> {
  console.log("Enviando requisição para criar Person:", person);
  const response = await fetch(`${API_BASE_URL}/person`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: person.name,
      email: person.email,
      cpf: person.cpf.replace(/\D/g, ''),
      birth: person.birth,
      user_id: person.user_id,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Dados do erro:", errorData);
      
      if (errorData && Array.isArray(errorData)) {
        const errorMessages = errorData.map((err: any) => {
          if (err.path && err.message) {
            return `${err.path.join('.')}: ${err.message}`;
          }
          return err.message || 'Erro desconhecido';
        }).join('; ');
        throw new Error(`Erro de validação: ${errorMessages}`);
      }
    throw new Error(errorData.message || `Erro ao criar pessoa (${response.status})`);
  }

  return response.json();
}

export async function findUserByCredentials(username: string, password: string): Promise<IUser | null> {
  const response = await fetch(
    `${API_BASE_URL}/user?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar o usuário: ${response.status}`);
  }

  const users = await response.json();

  if (Array.isArray(users)) {
    return users[0] ?? null;
  }

  return users || null;
}

export async function createUser(user: Omit<IUser, "id">): Promise<IUser> {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Dados do erro (User):", errorData);
      
      if (errorData && Array.isArray(errorData)) {
        const errorMessages = errorData.map((err: any) => {
          if (err.path && err.message) {
            return `${err.path.join('.')}: ${err.message}`;
          }
          return err.message || 'Erro desconhecido';
        }).join('; ');
        throw new Error(`Erro de validação: ${errorMessages}`);
      }
  }
  return response.json();
}