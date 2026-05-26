"use client";
import { useState } from "react";
import { IMaskInput } from 'react-imask';
import { useRouter } from "next/navigation";

export function CreateUsuarioInformacoesBasicas() {
  const [tipoInput, setTipoInput] = useState('text');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const handleAccept = (value: string) => {
    console.log("Unmasked CPF:", value);
    setCpf(value); 
  }

  const handleProximo = () => {
    if (!nomeCompleto || !cpf || !dataNascimento || !email) {
      alert("Preencha todos os campos!");
      return;
    }

    const params = new URLSearchParams({
      nomeCompleto,
      cpf,
      dataNascimento,
      email,
    });
    router.push(`/create-usuario/informacoes-acesso?${params.toString()}`);
  };

  return (
    <main className="mx-auto w-full max-w-[800px] px-6 py-8">
      <section className='mb-6'>
        <h2 className='m-0 text-2xl font-semibold mb-6 text-center'>Cadastrar Usuário</h2>
        <div className='border border-zinc-400'>
          <div className='bg-background-azul-royal-profundo bg-[linear-gradient(180deg, #26388f_0%,#2f43ad_48%,#3b55c2_100%)] px-4 py-2'>
            <span className='text-white text-sm'>Informações Básicas</span>
          </div>

          <form className='p-0'>
            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="nomeCompleto" className='w-32 text-right text-sm'>Nome Completo</label>
              <input type="text" id="nomeCompleto" name="nomeCompleto" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Ex: João da Silva Santos" required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="cpf" className='w-32 text-right text-sm'>CPF</label>
              <IMaskInput  mask="000.000.000-00" placeholder="000.000.000-00" value={cpf} onAccept={(value) => handleAccept(value)} id="cpf" name="cpf" required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="dataNascimento" className='w-32 text-right text-sm '>Data de Nascimento</label>
              <input type={tipoInput} onFocus={() => setTipoInput('date')} onBlur={(e) => {
          if (!e.target.value) setTipoInput('text');
        }} id="dataNascimento" name="dataNascimento" placeholder="DD/MM/AAAA" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="email" className='w-32 text-right text-sm'>Email</label>
              <input type="email" id="email" name="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
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
            className="h-10 rounded-xl bg-background-azul-real-vibrante px-5 text-white text-lg shadow-md transition-opacity hover:opacity-90"
            onClick={handleProximo}
          >
            Próximo
          </button>
        </div>
      </section>
    </main>
  );
}