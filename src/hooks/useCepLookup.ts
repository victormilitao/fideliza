import { useCallback, useEffect, useRef, useState } from 'react'
import { FieldValues, Path, UseFormSetValue } from 'react-hook-form'

type ViaCepResponse = {
  cep: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

type UseCepLookupReturn = {
  isLoading: boolean
  error: string | null
}

const CEP_LENGTH = 8
const DEBOUNCE_MS = 500

export const useCepLookup = <T extends FieldValues>(
  cepValue: string | undefined,
  setValue: UseFormSetValue<T>
): UseCepLookupReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastFetchedCep = useRef<string>('')

  const fetchAddress = useCallback(
    async (cleanCep: string) => {
      if (cleanCep === lastFetchedCep.current) return

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsLoading(true)
      setError(null)
      lastFetchedCep.current = cleanCep

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Erro ao buscar CEP')
        }

        const data: ViaCepResponse = await response.json()

        if (data.erro) {
          setError('CEP não encontrado')
          return
        }

        setValue('state' as Path<T>, data.uf as never, { shouldValidate: true })
        setValue('city' as Path<T>, data.localidade as never, { shouldValidate: true })
        setValue('neighborhood' as Path<T>, data.bairro as never, { shouldValidate: true })
        setValue('address' as Path<T>, data.logradouro as never, { shouldValidate: true })
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError('Erro ao buscar CEP. Tente novamente.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [setValue]
  )

  useEffect(() => {
    if (!cepValue) return

    const cleanCep: string = cepValue.replace(/\D/g, '')

    if (cleanCep.length !== CEP_LENGTH) {
      setError(null)
      return
    }

    const timer = setTimeout(() => {
      fetchAddress(cleanCep)
    }, DEBOUNCE_MS)

    return () => clearTimeout(timer)
  }, [cepValue, fetchAddress])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return { isLoading, error }
}
