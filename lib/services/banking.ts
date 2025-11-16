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
import { getCurrentUserId } from "@/lib/auth/token"

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL

/**
 * Get banking connection status
 */
export async function getBankingConnectionStatus() {
  const userId = getCurrentUserId()
  
  // Marketing mode: Always use mock data
  if (typeof window !== 'undefined' && isMarketingMode()) {
    return {
      user_id: 'demo_user',
      connections: {},
    }
  }

  if (USE_MOCK_DATA || !userId) {
    return {
      user_id: userId || 'anonymous',
      connections: {},
    }
  }

  try {
    return await fetchBankingConnectionStatus(userId)
  } catch (error) {
    console.error('Failed to fetch banking connection status:', error)
    return {
      user_id: userId,
      connections: {},
    }
  }
}

/**
 * Connect Plaid account
 */
export async function linkPlaidAccount(accessToken: string, itemId: string) {
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
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
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
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
  const userId = getCurrentUserId()
  if (USE_MOCK_DATA || !userId) {
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
