"use client";

export function CreateUsuarioInformacoesAcesso() {
  return (
    <main className="mx-auto w-full max-w-[800px] px-6 py-8">
      <section className='mb-6'>
        <h2 className='m-0 text-2xl font-semibold mb-6 text-center'>Cadastrar Usuário</h2>
        <div className='border border-zinc-400 dark:border-zinc-600'>
          <div className='bg-background-azul-royal-profundo bg-[linear-gradient(180deg, #26388f_0%,#2f43ad_48%,#3b55c2_100%)] px-4 py-2'>
            <span className='text-white text-sm'>Informações de Acesso</span>
          </div>

          <form className='p-0'>
            <div className='flex items-center gap-3 p-3 border-b border-zinc-400 dark:border-zinc-600'>
              <label htmlFor="username" className='w-32 text-right text-sm'>Usuário</label>
              <input type="text" id="username" name="username" placeholder="Ex: João" required className='flex-1 h-8 border border-zinc-400 dark:border-zinc-600 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
            </div>

            <div className='flex items-center gap-3 p-3 border-b border-zinc-400 dark:border-zinc-600'>
              <label htmlFor="password" className='w-32 text-right text-sm'>Senha</label>
              <input type="password" id="password" name="password" placeholder="Ex: 123456" required className='flex-1 h-8 border border-zinc-400 dark:border-zinc-600 bg-white px-2 text-sm text-zinc-900 outline-none shadow-md' />
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
            Salvar
          </button>
        </div>
      </section>
    </main>
  );
}