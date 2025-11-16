/**
 * Banking service with API integration
 * 
 * Provides banking connection management with fallback to mock data during development.
 * Set NEXT_PUBLIC_API_URL to enable real API integration.
 * Marketing mode (?marketing=1) always uses mock data regardless of environment.
 */

import {
  fetchBankingConnectionStatus,
  connectPlaid,
  connectTeller,
  disconnectProvider,
} from "@/lib/api/client"
import { isMarketingMode } from "@/lib/marketingMode"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === 'development'
const DEMO_USER_ID = "demo_user" // TODO: Get from auth context

/**
 * Get banking connection status
 */
export async function getBankingConnectionStatus() {
  // Marketing mode: Always use mock data
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return {
      user_id: DEMO_USER_ID,
      connections: {},
    }
  }

  if (USE_MOCK_DATA) {
    return {
      user_id: DEMO_USER_ID,
      connections: {},
    }
  }

  try {
    return await fetchBankingConnectionStatus(DEMO_USER_ID)
  } catch (error) {
    console.error('Failed to fetch banking connection status:', error)
    return {
      user_id: DEMO_USER_ID,
      connections: {},
    }
  }
}

/**
 * Connect Plaid account
 */
export async function linkPlaidAccount(accessToken: string, itemId: string) {
  if (USE_MOCK_DATA) {
    console.log('Mock: Would connect Plaid account')
    return {
      success: true,
      provider: 'plaid',
      connected_at: new Date().toISOString(),
    }
  }

  try {
    return await connectPlaid(accessToken, itemId)
  } catch (error) {
    console.error('Failed to connect Plaid account:', error)
    throw error
  }
}

/**
 * Connect Teller account
 */
export async function linkTellerAccount(accessToken: string, enrollmentId: string) {
  if (USE_MOCK_DATA) {
    console.log('Mock: Would connect Teller account')
    return {
      success: true,
      provider: 'teller',
      connected_at: new Date().toISOString(),
    }
  }

  try {
    return await connectTeller(accessToken, enrollmentId)
  } catch (error) {
    console.error('Failed to connect Teller account:', error)
    throw error
  }
}

/**
 * Disconnect banking provider
 */
export async function unlinkProvider(provider: 'plaid' | 'teller') {
  if (USE_MOCK_DATA) {
    console.log(`Mock: Would disconnect ${provider}`)
    return {
      success: true,
      provider,
      disconnected_at: new Date().toISOString(),
    }
  }

  try {
    return await disconnectProvider(provider)
  } catch (error) {
    console.error(`Failed to disconnect ${provider}:`, error)
    throw error
  }
}
