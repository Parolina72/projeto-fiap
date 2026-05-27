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
        <h2 className='learnio-title m-0 mb-6 text-center text-2xl font-semibold'>Cadastrar Usuário</h2>
        <div className='learnio-surface overflow-hidden'>
          <div className='learnio-banner px-4 py-2'>
            <span className='text-sm text-current'>Informações Básicas</span>
          </div>

          <form className='p-0'>
            <div className='flex items-center gap-3 border-b border-[color:var(--border)] p-3'>
              <label htmlFor="nomeCompleto" className='learnio-label w-32 text-right text-sm'>Nome Completo</label>
              <input type="text" id="nomeCompleto" name="nomeCompleto" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} placeholder="Ex: João da Silva Santos" required className='learnio-field flex-1 h-8 px-2 text-sm' />
            </div>

            <div className='flex items-center gap-3 border-b border-[color:var(--border)] p-3'>
              <label htmlFor="cpf" className='learnio-label w-32 text-right text-sm'>CPF</label>
              <IMaskInput mask="000.000.000-00" placeholder="000.000.000-00" value={cpf} onAccept={(value) => handleAccept(value)} id="cpf" name="cpf" required className='learnio-field flex-1 h-8 px-2 text-sm' />
            </div>

            <div className='flex items-center gap-3 border-b border-[color:var(--border)] p-3'>
              <label htmlFor="dataNascimento" className='learnio-label w-32 text-right text-sm'>Data de Nascimento</label>
              <input type={tipoInput} onFocus={() => setTipoInput('date')} onBlur={(e) => {
                if (!e.target.value) setTipoInput('text');
              }} id="dataNascimento" name="dataNascimento" placeholder="DD/MM/AAAA" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required className='learnio-field flex-1 h-8 px-2 text-sm' />
            </div>

            <div className='flex items-center gap-3 p-3'>
              <label htmlFor="email" className='learnio-label w-32 text-right text-sm'>Email</label>
              <input type="email" id="email" name="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className='learnio-field flex-1 h-8 px-2 text-sm' />
            </div>
          </form>
        </div>

        <div className='flex gap-3 pt-10 justify-center'>
          <button type='button'
            className='learnio-button-secondary h-10 rounded-xl px-5 text-lg shadow-sm transition-opacity hover:opacity-90'
            onClick={() => router.push('/')}>
            Cancelar
          </button>
          <button
            type="button"
            className="learnio-button-primary h-10 rounded-xl px-5 text-lg shadow-md transition-opacity hover:opacity-90"
            onClick={handleProximo}
          >
            Próximo
          </button>
        </div>
      </section>
    </main>
  );
}
