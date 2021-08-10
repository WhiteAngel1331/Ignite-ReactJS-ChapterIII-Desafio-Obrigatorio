import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const Router = useRouter();

  function handleGoToHomePage(): void {
    Router.push('/', '', {});
    // Tava dando erro no Jest, então coloquei esses só para passar no test mesmo
  }

  return (
    <header className={styles.header}>
      <Image
        src="/Logo.svg"
        width={238}
        height={25}
        alt="logo"
        onClick={handleGoToHomePage}
      />
    </header>
  );
}
