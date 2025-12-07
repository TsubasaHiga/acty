import { useStore } from '@nanostores/react'

import { count } from '@/store/atoms/count'

import styles from './Bar.module.scss'

const Bar = (): JSX.Element => {
  const $count = useStore(count)

  return (
    <div className={styles.bar}>
      <h3>Bar Component</h3>
      <button className={styles.bar__button} onClick={() => count.set($count + 1)}>
        count is {$count}
      </button>
    </div>
  )
}

export default Bar
