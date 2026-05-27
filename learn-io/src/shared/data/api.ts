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

export interface IPost {
  id: string;
  title: string;
  content: string;
  author_id?: number;
  created_at: string;
}

function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function findUserByCredentials(
  username: string,
  password: string
): Promise<{ user: IUser; token: string } | null> {

  const response = await fetch(`${API_BASE_URL}/user/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  // trata 401 primeiro
  if (response.status === 401) {
    throw new Error("Usuário ou senha inválidos.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || `Erro ao buscar usuário (${response.status})`
    );
  }

  const data = await response.json();

  if (data.token) {
    setAuthToken(data.token);
  } else if (data.access_token) {
    setAuthToken(data.access_token);
  }

  return data;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function getPosts(): Promise<IPost[]> {
  console.log("Buscando posts do backend...");
  console.log("URL:", `${API_BASE_URL}/api/posts`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    console.log("Resposta da API (posts):", response);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Dados do erro (posts):", errorData);
      throw new Error(errorData.message || `Erro ao buscar posts (${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error("Erro na requisição (posts):", error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Não foi possível conectar ao backend. Verifique se o backend está rodando na porta 3001 e se o CORS está configurado.');
    }
    throw error;
  }
}