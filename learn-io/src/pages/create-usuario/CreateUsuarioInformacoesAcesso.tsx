"use client";

import { createPerson, createUser} from "@/shared/data/api";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function CreateUsuarioInformacoesAcesso() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dadosBasicos = {
    nomeCompleto: searchParams.get('nomeCompleto') || '',
    cpf: searchParams.get('cpf') || '',
    dataNascimento: searchParams.get('dataNascimento') || '',
    email: searchParams.get('email') || '',
  };

  useEffect(() => {
    if (!dadosBasicos.nomeCompleto || !dadosBasicos.cpf || !dadosBasicos.dataNascimento || !dadosBasicos.email) {
      router.push('/create-usuario/informacoes-basicas');
    }
  }, [dadosBasicos, router]);

  const handleSalvar = async () => {
  if (!username || !password) {
    setMessage('Preencha todos os campos!');
    return;
  }

  setIsLoading(true);

  try {

    const user = await createUser({
      username,
      password,
      role: 'ALUNO',
    });

    console.log('Usuário criado:', user);

    const person = await createPerson({
      name: dadosBasicos.nomeCompleto,
      cpf: dadosBasicos.cpf,
      birth: new Date(dadosBasicos.dataNascimento),
      email: dadosBasicos.email,
      user_id: user.id!,
    });

    console.log('Pessoa criada:', person);

    setMessage('Usuário cadastrado com sucesso!');

    setUsername('');
    setPassword('');

    setTimeout(() => {
      router.push('/');
    }, 1500);

  } catch (error) {

    console.error('Erro ao salvar usuário:', error);

    setMessage(
      error instanceof Error
        ? error.message
        : 'Erro ao cadastrar o usuário. Tente novamente.'
    );

  } finally {
    setIsLoading(false);
  }
};

  return (
    <main className="mx-auto w-full max-w-[800px] px-6 py-8">
      <section className='mb-6'>
        <h2 className='m-0 text-2xl font-semibold mb-6 text-center'>Cadastrar Usuário</h2>
        {message && (
          <div className={`mb-5 rounded-md border px-4 py-3 text-sm ${message.includes('sucesso') ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}
        <div className='border border-zinc-400 dark:border-zinc-600'>
          <div className='bg-background-azul-royal-profundo bg-[linear-gradient(180deg, #26388f_0%,#2f43ad_48%,#3b55c2_100%)] px-4 py-2'>
            <span className='text-white text-sm'>Informações de Acesso</span>
          </div>

          <form className='p-0'>
            <div className='flex items-center gap-3 p-3 border-b border-zinc-400 dark:border-zinc-600'>
              <label htmlFor="username" className='w-32 text-right text-sm'>Usuário</label>
              <input type="text" id="username" name="username" placeholder="Ex: João" value={username} onChange={(e) => setUsername(e.target.value)} required className='flex-1 h-8 border border-zinc-400 dark:border-zinc-600 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400 dark:border-zinc-600'>
              <label htmlFor="password" className='w-32 text-right text-sm'>Senha</label>
              <input type="password" id="password" name="password" placeholder="Ex: 123456" value={password} onChange={(e) => setPassword(e.target.value)} required className='flex-1 h-8 border border-zinc-400 dark:border-zinc-600 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

          </form>
        </div>

        <div className='flex gap-3 pt-10 justify-center'>
          <button type='button' 
                  className='h-10 px-5 rounded-xl border border-zinc-800 bg-white text-zinc-800 text-lg shadow-md transition-opacity hover:opacity-90'
                  onClick={() => router.push('/')}>
            Cancelar
          </button>
          <button
            type="button"
            className="h-10 rounded-xl bg-background-azul-real-vibrante px-5 text-white text-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSalvar}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </section>
    </main>
  );
}