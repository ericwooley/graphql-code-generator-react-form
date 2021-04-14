import Head from 'next/head';
import { AddUsersForm, mutationsMetaData } from '../generated/formik';
import styles from '../styles/Home.module.css';
import JSONTree from 'react-json-tree';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Add Users</h3>
            <AddUsersForm
              initialValues={{
                users: [],
              }}
              onSubmit={(addUsersData) => {
                console.log('Add Users Form Submit', addUsersData);
              }}
            />
          </div>

          <div
            className={styles.card}
            style={{ minWidth: 400, background: '#002b35', color: 'white' }}
          >
            <h3>Mutations MetaData Explorer</h3>
            {typeof window !== 'undefined' && (
              <JSONTree invertTheme={false} data={mutationsMetaData} />
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
