"use client";
import { useState } from "react";
import { IMaskInput } from 'react-imask';

export function CreateUsuarioInformacoesBasicas() {
  const [tipoInput, setTipoInput] = useState('text');
  const handleAccept = (value: string) => {
    console.log("Unmasked CPF:", value); 
  }

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
              <input type="text" id="nomeCompleto" name="nomeCompleto" placeholder="Ex: João da Silva Santos" required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="cpf" className='w-32 text-right text-sm'>CPF</label>
              <IMaskInput  mask="000.000.000-00" placeholder="000.000.000-00" onAccept={(value) => handleAccept(value)} id="cpf" name="cpf" required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="dataNascimento" className='w-32 text-right text-sm '>Data de Nascimento</label>
              <input type={tipoInput} onFocus={() => setTipoInput('date')} onBlur={(e) => {
          if (!e.target.value) setTipoInput('text');
        }} id="dataNascimento" name="dataNascimento" placeholder="DD/MM/AAAA" required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400'>
              <label htmlFor="email" className='w-32 text-right text-sm'>Email</label>
              <input type="email" id="email" name="email" placeholder="email@example.com" required className='flex-1 h-8 border border-zinc-400 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>
          </form>
        </div>

        <div className='flex gap-3 pt-10 justify-center'>
          <button type='button' className='h-10 px-5 rounded-xl border border-zinc-800 bg-white text-zinc-800 text-lg shadow-md transition-opacity hover:opacity-90'>
            Cancelar
          </button>
          <button
            type="button"
            className="h-10 rounded-xl bg-background-azul-real-vibrante px-5 text-white text-lg shadow-md transition-opacity hover:opacity-90"
            
          >
            Próximo
          </button>
        </div>
      </section>
    </main>
  );
}