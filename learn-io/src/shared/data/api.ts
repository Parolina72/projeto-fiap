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

function findNumericId(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as Record<string, unknown>;

  for (const key of ["id", "user_id", "author_id", "userId", "authorId"]) {
    const resolved = findNumericId(candidate[key]);

    if (typeof resolved === "number") {
      return resolved;
    }
  }

  for (const nestedValue of Object.values(candidate)) {
    const resolved = findNumericId(nestedValue);

    if (typeof resolved === "number") {
      return resolved;
    }
  }

  return undefined;
}

function readStoredJson(key: string): unknown {
  if (typeof window === "undefined") {
    return undefined;
  }

  const rawValue = localStorage.getItem(key);

  if (!rawValue || rawValue === "undefined" || rawValue === "null") {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as unknown;
  } catch (error) {
    console.error(`Erro ao ler ${key} salvo:`, error);
    return undefined;
  }
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return decodeURIComponent(
      Array.from(atob(padded), (character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`
      ).join("")
    );
  }

  return Buffer.from(padded, "base64").toString("utf-8");
}

export function extractAuthorIdFromToken(token?: string | null): number | undefined {
  if (!token) {
    return undefined;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length < 2) {
    return undefined;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(tokenParts[1])) as Record<string, unknown>;
    return (
      findNumericId(payload.author_id) ??
      findNumericId(payload.user_id) ??
      (payload.role === "PROFESSOR" ? 1 : undefined) ??
      findNumericId(payload.sub)
    );
  } catch (error) {
    console.error("Erro ao decodificar token JWT:", error);
    return undefined;
  }
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

export async function createPost(post: {
  title: string
  content: string
  image_url: string
  author_id: number
}): Promise<IPost> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error("Dados do erro (createPost):", errorData)
    throw new Error(errorData.message || `Erro ao criar post (${response.status})`)
  }

  return response.json()
}

export async function updatePost(
  id: number,
  post: Partial<{
    title: string
    content: string
    image_url: string
    author_id: number
  }>,
): Promise<IPost> {
  // busca o post atual para preencher campos não informados (API requer todos os campos)
  const existingResp = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!existingResp.ok) {
    const err = await existingResp.json().catch(() => ({}))
    throw new Error(err.message || `Erro ao buscar post (${existingResp.status})`)
  }

  const existing = await existingResp.json()

  const payload = {
    title: post.title ?? existing.title,
    content: post.content ?? existing.content,
    image_url: post.image_url ?? existing.image_url,
    author_id: post.author_id ?? existing.author_id,
  }
  // Se a API de GET não expõe `image_url` (por validação de schema), exija que o caller forneça
  if (!payload.image_url) {
    throw new Error('`image_url` é necessário para atualizar o post; forneça `image_url` no segundo argumento')
  }
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Dados do erro (updatePost):', errorData)
    throw new Error(errorData.message || `Erro ao atualizar post (${response.status})`)
  }

  return response.json()
}

export async function getMyPerson(): Promise<IPerson> {
  const response = await fetch(`${API_BASE_URL}/person/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('Dados do erro (getMyPerson):', errorData)
    throw new Error(errorData.message || `Erro ao buscar person (${response.status})`)
  }

  return response.json()
}
