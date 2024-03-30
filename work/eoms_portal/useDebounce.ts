import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay: number = 500): T => {
    const [debounceValue, setDebounceValue] = useState<T>(value)
    useEffect(() => {

        const debounce = setTimeout(() => {
            setDebounceValue(value)
        }, delay);

        return () => {
            clearTimeout(debounce)
        }
    }, [value, delay])
    return debounceValue
}

export default useDebounce
