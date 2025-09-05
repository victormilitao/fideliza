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
    <div className='min-w-34 miax-w-34 min-h-[120px] bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col'>
      <div className='text-3xl font-bold text-neutral-700 mb-2'>{count}</div>
      <div className='flex items-center gap-2 '>
        <Stamp size={iconSize} fill='var(--color-primary-200)' color='var(--color-primary-200)' shadow={false} />
        <span className='text-sm'>
          {stamps.toString().padStart(2, '0')}/
          {totalStamps.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
