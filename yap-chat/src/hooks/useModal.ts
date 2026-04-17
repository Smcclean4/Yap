import { useCallback, useState } from 'react'

export const useModal = () => {

  const [isShowing, setIsShowing] = useState(false);

  const toggle = useCallback(() => {
    setIsShowing((prev) => !prev)
  }, [])

  return {
    isShowing,
    toggle
  }
}