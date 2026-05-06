type HeaderProps = {
  title?: string;
};

export function Header({ title = "Learn.io" }: HeaderProps) {
  return (
    <header className='w-full bg-background-azul-royal-profundo bg-[linear-gradient(180deg,#26388f_0%,#2f43ad_48%,#3b55c2_100%)] '>
      <div className='flex items-center h-[60px] m-auto max-w-[1440px] px-11'>
        <h1 className='m-0 text-white text-[1.05rem] leading-none font-medium'>{title}</h1>
      </div>
      <nav className='w-full bg-background-azul-escuro-vibrante bg-[linear-gradiente(180deg, #3148a9_0%, #3853bc_52%, #4361cb_100% )]' aria-label="Navegacao principal">
        <div className='flex items-center gap-[72px] h-10 m-auto max-w-[1440px] p-11'>
          <a href="#" className='text-white cursor-pointer text-[0.95rem] leading-none no-underline'>
            Postagens
          </a>
          <a href="#" className='text-white cursor-pointer text-[0.95rem] leading-none no-underline'>
            Administrativo
          </a>
        </div>
      </nav>
    </header>
  );
}
