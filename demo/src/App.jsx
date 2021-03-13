import React from 'react'
import { Link, Route } from 'wouter'

import Minimal from './sandboxes/yogan-react/src/App'
import styles from './styles.module.css'

const links = {
  'yogan-minimal': Minimal,
}

const Example = ({ link }) => {
  const Component = links[link]
  // David did this and he's ashamed 👇👇👇
  // const Lazy = useMemo(() => React.lazy(() => import(`./sandboxes/${link}/src/App`)), [link])

  return (
    <div>
      <Link href="/">
        {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className={styles.back}>← Back</a>
      </Link>
      <Component />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Route path="/">
        <h1>Leva demos</h1>
          <h2>Sandboxes</h2>
          <div className={styles.linkList}>
            {Object.keys(links).map((link) => (
              <Link key={link} href={`/${link}`}>
                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={styles.link}>{link}</a>
              </Link>
            ))}
          </div>
      </Route>
      <Route path="/:link">{(params) => <Example link={params.link} />}</Route>
    </>
  )
}
