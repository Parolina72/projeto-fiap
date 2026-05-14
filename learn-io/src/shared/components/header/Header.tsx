import { ThemeToggle } from "@/shared/components/theme-toggle/ThemeToggle";

type HeaderProps = {
  title?: string;
};

export function Header({ title = "Learn.io" }: HeaderProps) {
  return (
    <header className='w-full'>
      <div className='learnio-header-top w-full bg-background-azul-royal-profundo bg-[linear-gradient(180deg,#26388f_0%,#2f43ad_48%,#3b55c2_100%)]'>
        <div className='flex items-center justify-between h-[60px] m-auto max-w-[1440px] px-11'>
          <h1 className='m-0 text-white text-[1.05rem] leading-none font-medium'>{title}</h1>
          <ThemeToggle />
        </div>
      </div>
      <div className='learnio-header-bottom w-full bg-background-azul-escuro-vibrante bg-[linear-gradient(180deg, #3148a9_0%, #3853bc_52%, #4361cb_100% )]' aria-label="Navegacao principal">
        <div className='flex items-center gap-[72px] h-10 m-auto max-w-[1440px] px-11'>
          <a href="#" className='text-white cursor-pointer text-[0.95rem] leading-none no-underline'>
            Postagens
          </a>
          <a href="#" className='text-white cursor-pointer text-[0.95rem] leading-none no-underline'>
            Administrativo
          </a>
          <button type='button' className='ml-auto rounded-md border border-white/30 px-4 py-2 text-white text-[0.95rem] leading-none hover:bg-white/10'>
            Login
          </button>
        </div>
        </div>
    </header>
  );
}
