import { useEffect, useState } from "react";

export default function useFetchSingle<T>(url: string) {
  const [data, setData] = useState<T>({} as T)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchData () {
    setLoading(true)
    setError(null)

    const response = await fetch(import.meta.env.VITE_ADDRESS + url)
    const json = await response.json()

    if (!response) {
      setError(json.error)
      setLoading(false)
    } 
    else {
      setData(json[0])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  },[url])

  return {data, setData, loading, error}
}
