import { useEffect, useState, useCallback } from "react";

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const response = await fetch(import.meta.env.VITE_ADDRESS + url)
    const json = await response.json()

    if (!response) {
      setError(json.error)
      setLoading(false)
    } 
    else {
      setData(json)
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  },[fetchData])

  return {data, setData, loading, setLoading, error}
}
