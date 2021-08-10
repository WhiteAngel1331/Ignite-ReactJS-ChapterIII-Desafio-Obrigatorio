import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { RichText, HTMLSerializer } from 'prismic-dom';
import { format, sub } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';
import { PostType, PostProps } from '../../types/postTypes';
import styles from './post.module.scss';
import { formatData } from '../../util/formatData';

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <main>
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner do post" />
      </div>
      <div className={styles.content}>
        <div className={styles.infoZone}>
          <h1>{post.data.title}</h1>
          <div className={styles.tabInfoZone}>
            <div className={styles.tabInfoZone_Children}>
              <Image src="/calendar.svg" width={20} height={20} />
              <time>
                {format(new Date('2021-03-25T19:25:28+0000'), 'PP', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={styles.tabInfoZone_Children}>
              <Image src="/user.svg" width={20} height={20} />
              <p>{post.data.author}</p>
            </div>
            <div className={styles.tabInfoZone_Children}>
              <Image src="/clock.svg" width={20} height={20} />
              <time>4 min</time>
            </div>
          </div>
        </div>
        <div className={styles.contentZone}>
          {post.data.content.map(item => (
            <div key={item.heading}>
              <h1>{item.heading}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(item.body),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query('', { pageSize: 10 });

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('post', String(context.params.slug), {});

  return {
    props: { post },
  };
};
