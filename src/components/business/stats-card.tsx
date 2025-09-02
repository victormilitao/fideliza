import { Stamp } from '@/components/ui/stamp'

interface StatsCardProps {
  count: number
  stamps: number
  totalStamps: number
  iconSize?: number
}

export const StatsCard = ({
  count,
  stamps,
  totalStamps,
  iconSize = 24,
}: StatsCardProps) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[120px]'>
      <div className='text-3xl font-bold text-primary-600 mb-2'>{count}</div>
      <div className='flex items-center gap-2 text-gray-600'>
        <Stamp size={iconSize} />
        <span className='text-sm'>
          {stamps.toString().padStart(2, '0')}/
          {totalStamps.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
