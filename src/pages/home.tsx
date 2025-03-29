import { Link } from 'react-router-dom'
import { Button } from '../components/button/button'
import { Input } from '../components/input'

export const Home = () => {
  return (
    <>
      <div className='p-4 absolute w-full flex justify-end'>
        <div className='right-0'>
          <Link to={'/login'}>
            <Button variant='link'>Sair</Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col gap-6 w-3xs'>
          <Input label='Celular' type='text' />
          <Button>Enviar selos</Button>
          <Button variant='secondary'>Conferir selos</Button>
          <Button variant='secondary'>Premiar</Button>
        </div>
      </div>
    </>
  )
}
