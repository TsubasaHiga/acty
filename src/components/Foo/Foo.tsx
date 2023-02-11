import { useStore } from '@nanostores/react'
import { count } from '@store/atoms/count'

const Foo = (): JSX.Element => {
  const $count = useStore(count)

  return (
    <div className="flex flex-col items-center justify-center">
      <h3>Foo Component</h3>
      <button className="mt-2 rounded-lg bg-white py-4 px-6 shadow" onClick={() => count.set($count + 1)}>
        count is {$count}
      </button>
    </div>
  )
}

export default Foo
