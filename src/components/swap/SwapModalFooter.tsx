import { Trans } from '@lingui/macro'
import { Protocol } from '@uniswap/router-sdk'
import { Currency, Percent, TradeType } from '@uniswap/sdk-core'
import { FeeAmount } from '@uniswap/v3-sdk'
import { ElementName, EventName, NATIVE_CHAIN_ADDRESS } from 'components/AmplitudeAnalytics/constants'
import { Event } from 'components/AmplitudeAnalytics/constants'
import { TraceEvent } from 'components/AmplitudeAnalytics/TraceEvent'
import {
  formatPercentInBasisPointsNumber,
  formatToDecimal,
  getDurationFromDateMilliseconds,
  getDurationUntilTimestampSeconds,
  getTokenAddress,
} from 'components/AmplitudeAnalytics/utils'
import { useStablecoinValue } from 'hooks/useStablecoinPrice'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { ReactNode } from 'react'
import { Text } from 'rebass'
import { InterfaceTrade } from 'state/routing/types'
import { useClientSideRouter, useUserSlippageTolerance } from 'state/user/hooks'
import { computeRealizedLPFeePercent } from 'utils/prices'

import { ButtonError } from '../Button'
import { AutoRow } from '../Row'
import { getPriceImpactPercent } from './AdvancedSwapDetails'
import { SwapCallbackError } from './styleds'
import { getTokenPath, RoutingDiagramEntry } from './SwapRoute'

interface AnalyticsEventProps {
  trade: InterfaceTrade<Currency, Currency, TradeType>
  txHash: string | undefined
  allowedSlippage: Percent
  transactionDeadlineSecondsSinceEpoch: number | undefined
  isAutoSlippage: boolean
  isAutoRouterApi: boolean
  tokenInAmountUsd: string | undefined
  tokenOutAmountUsd: string | undefined
  lpFeePercent: Percent
  swapQuoteReceivedDate: Date | undefined
  routes: RoutingDiagramEntry[]
}

const formatRoutesEventProperties = (routes: RoutingDiagramEntry[]) => {
  const routesPercentages: number[] = []
  const routesProtocols: Protocol[] = []
  const routesInputCurrencySymbols: string[][] = []
  const routesOutputCurrencySymbols: string[][] = []
  const routesInputCurrencyAddresses: string[][] = []
  const routesOutputCurrencyAddresses: string[][] = []
  const routesFeeAmounts: FeeAmount[][] = []

  routes.forEach((route) => {
    routesPercentages.push(formatPercentNumber(route.percent))
    routesProtocols.push(route.protocol)
    routesInputCurrencySymbols.push(route.path.map((pathStep) => pathStep[0].symbol ?? ''))
    routesOutputCurrencySymbols.push(route.path.map((pathStep) => pathStep[1].symbol ?? ''))
    routesInputCurrencyAddresses.push(
      route.path.map((pathStep) => (pathStep[0].isNative ? NATIVE_CHAIN_ADDRESS : pathStep[0].address))
    )
    routesOutputCurrencyAddresses.push(
      route.path.map((pathStep) => (pathStep[1].isNative ? NATIVE_CHAIN_ADDRESS : pathStep[1].address))
    )
    routesFeeAmounts.push(route.path.map((pathStep) => pathStep[2]))
  })
  const routesEventProperties: Record<string, any[]> = {
    routes_percentages: routesPercentages,
    routes_protocols: routesProtocols,
  }
  routes.forEach((_, index) => {
    routesEventProperties[`route_${index}_input_currency_symbols`] = routesInputCurrencySymbols[index]
    routesEventProperties[`route_${index}_output_currency_symbols`] = routesOutputCurrencySymbols[index]
    routesEventProperties[`route_${index}_input_currency_addresses`] = routesInputCurrencyAddresses[index]
    routesEventProperties[`route_${index}_output_currency_addresses`] = routesOutputCurrencyAddresses[index]
    routesEventProperties[`route_${index}_fee_amounts_hundredths_of_bps`] = routesFeeAmounts[index]
  })
  return routesEventProperties
}

const formatAnalyticsEventProperties = ({
  trade,
  txHash,
  allowedSlippage,
  transactionDeadlineSecondsSinceEpoch,
  isAutoSlippage,
  isAutoRouterApi,
  tokenInAmountUsd,
  tokenOutAmountUsd,
  lpFeePercent,
  swapQuoteReceivedDate,
  routes,
}: AnalyticsEventProps) => ({
  estimated_network_fee_usd: trade.gasUseEstimateUSD ? formatToDecimal(trade.gasUseEstimateUSD, 2) : undefined,
  transaction_hash: txHash,
  transaction_deadline_seconds: getDurationUntilTimestampSeconds(transactionDeadlineSecondsSinceEpoch),
  token_in_amount_usd: tokenInAmountUsd ? parseFloat(tokenInAmountUsd) : undefined,
  token_out_amount_usd: tokenOutAmountUsd ? parseFloat(tokenOutAmountUsd) : undefined,
  token_in_address: getTokenAddress(trade.inputAmount.currency),
  token_out_address: getTokenAddress(trade.outputAmount.currency),
  token_in_symbol: trade.inputAmount.currency.symbol,
  token_out_symbol: trade.outputAmount.currency.symbol,
  token_in_amount: formatToDecimal(trade.inputAmount, trade.inputAmount.currency.decimals),
  token_out_amount: formatToDecimal(trade.outputAmount, trade.outputAmount.currency.decimals),
  price_impact_basis_points: formatPercentInBasisPointsNumber(getPriceImpactPercent(lpFeePercent, trade)),
  allowed_slippage_basis_points: formatPercentInBasisPointsNumber(allowedSlippage),
  is_auto_router_api: isAutoRouterApi,
  is_auto_slippage: isAutoSlippage,
  chain_id:
    trade.inputAmount.currency.chainId === trade.outputAmount.currency.chainId
      ? trade.inputAmount.currency.chainId
      : undefined,
  duration_from_first_quote_to_swap_submission_milliseconds: swapQuoteReceivedDate
    ? getDurationFromDateMilliseconds(swapQuoteReceivedDate)
    : undefined,
  ...formatRoutesEventProperties(routes),
})

export default function SwapModalFooter({
  trade,
  allowedSlippage,
  txHash,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
  swapQuoteReceivedDate,
}: {
  trade: InterfaceTrade<Currency, Currency, TradeType>
  txHash: string | undefined
  allowedSlippage: Percent
  onConfirm: () => void
  swapErrorMessage: ReactNode | undefined
  disabledConfirm: boolean
  swapQuoteReceivedDate: Date | undefined
}) {
  const transactionDeadlineSecondsSinceEpoch = useTransactionDeadline()?.toNumber() // in seconds since epoch
  const isAutoSlippage = useUserSlippageTolerance() === 'auto'
  const [clientSideRouter] = useClientSideRouter()
  const tokenInAmountUsd = useStablecoinValue(trade.inputAmount)?.toFixed(2)
  const tokenOutAmountUsd = useStablecoinValue(trade.outputAmount)?.toFixed(2)
  const lpFeePercent = computeRealizedLPFeePercent(trade)
  const routes = getTokenPath(trade)

  return (
    <>
      <AutoRow>
        <TraceEvent
          events={[Event.onClick]}
          element={ElementName.CONFIRM_SWAP_BUTTON}
          name={EventName.SWAP_SUBMITTED}
          properties={formatAnalyticsEventProperties({
            trade,
            txHash,
            allowedSlippage,
            transactionDeadlineSecondsSinceEpoch,
            isAutoSlippage,
            isAutoRouterApi: !clientSideRouter,
            tokenInAmountUsd,
            tokenOutAmountUsd,
            lpFeePercent,
            swapQuoteReceivedDate,
            routes,
          })}
        >
          <ButtonError
            onClick={onConfirm}
            disabled={disabledConfirm}
            style={{ margin: '10px 0 0 0' }}
            id={ElementName.CONFIRM_SWAP_BUTTON}
          >
            <Text fontSize={20} fontWeight={500}>
              <Trans>Confirm Swap</Trans>
            </Text>
          </ButtonError>
        </TraceEvent>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
