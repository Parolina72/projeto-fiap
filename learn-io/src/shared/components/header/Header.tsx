import styles from "./Header.module.css";

type HeaderProps = {
  title?: string;
};

export function Header({ title = "Learn.io" }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <nav className={styles.subnav} aria-label="Navegacao principal">
        <div className={styles.subnavContainer}>
          <a href="#" className={styles.subnavLink}>
            Postagens
          </a>
          <a href="#" className={styles.subnavLink}>
            Administrativo
          </a>
        </div>
      </nav>
    </header>
  );
}
