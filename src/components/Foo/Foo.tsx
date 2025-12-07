import { useStore } from '@nanostores/react'

import { count } from '@/store/atoms/count'

import styles from './Foo.module.scss'

const Foo = (): JSX.Element => {
  const $count = useStore(count)

  return (
    <div className={styles.foo}>
      <h3>Foo Component</h3>
      <button className={styles.foo__button} onClick={() => count.set($count + 1)}>
        count is {$count}
      </button>
    </div>
  )
}

export default Foo
