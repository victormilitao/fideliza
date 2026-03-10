import { useTrialStamps } from './useTrialStamps'
import { useBusinessSubscription } from './useBusinessSubscription'
import { useMyBusiness } from './useMyBusiness'

export type TrialStatus = 'subscribed' | 'normal' | 'warning' | 'blocked'

const WARNING_THRESHOLD = 10

export const useTrialStatus = () => {
    const { business } = useMyBusiness()
    const { subscription, isLoading: isLoadingSubscription } =
        useBusinessSubscription(business?.id)
    const {
        stampsSent,
        stampsRemaining,
        totalTrialStamps,
        isLoading: isLoadingStamps,
        refetch: refetchStamps,
    } = useTrialStamps()

    const isSubscribed =
        !!subscription && subscription.status === 'complete'

    let trialStatus: TrialStatus = 'normal'

    if (isSubscribed) {
        trialStatus = 'subscribed'
    } else if (stampsRemaining <= 0) {
        trialStatus = 'blocked'
    } else if (stampsRemaining <= WARNING_THRESHOLD) {
        trialStatus = 'warning'
    }

    return {
        trialStatus,
        stampsSent,
        stampsRemaining,
        totalTrialStamps,
        isSubscribed,
        isLoading: isLoadingSubscription || isLoadingStamps,
        refetchStamps,
    }
}
