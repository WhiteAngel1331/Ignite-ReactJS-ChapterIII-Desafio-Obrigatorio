/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';
import { HomeProps } from '../types/homeTypes';
import styles from './home.module.scss';

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const Router = useRouter();
  const [posts, setPosts] = useState(postsPagination.results);
  const [pagination, setPagination] = useState(postsPagination.next_page);

  function handleGoToPost(uuid: string): void {
    Router.push(`/post/${uuid}`, '', {});
  }

  async function handleLoadMorePosts(): Promise<boolean> {
    if (!pagination) {
      return false;
    }

    const response = await fetch(pagination);
    const data = await response.json();

    setPosts([...posts, ...data.results]);
    setPagination(data.next_page);

    return true;
  }

  return (
    <main className={styles.main}>
      {posts.map(post => (
        <article key={post.uid}>
          <h1
            onClick={() => {
              handleGoToPost(post.uid);
            }}
          >
            {post.data.title}
          </h1>
          <h2>{post.data.subtitle}</h2>
          <div className={styles.informationArea}>
            <div className={styles.informationArea_Children}>
              <Image src="/calendar.svg" width={20} height={20} />
              <time>
                {format(new Date(post.first_publication_date), 'PP', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={styles.informationArea_Children}>
              <Image src="/user.svg" width={20} height={20} />
              <span>{post.data.author}</span>
            </div>
          </div>
        </article>
      ))}
      {pagination && <h3 onClick={handleLoadMorePosts}>Carregar mais posts</h3>}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query('', { pageSize: 2 });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
