import { NextRequest } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { handleApiError, handleApiSuccess } from '@/lib/api/errorHandler'
import { createCustomerSchema } from '@/features/customers/schemas/customerSchema'
import { listCustomers } from '@/application/usecases/customers/listCustomers'
import { createCustomer } from '@/application/usecases/customers/createCustomer'

/**
 * GET /api/customers
 * 顧客一覧取得
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    // クエリパラメータ取得
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await listCustomers(userId, { page, limit })
    
    return handleApiSuccess(result)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/customers
 * 顧客作成
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    const body = await request.json()
    
    // バリデーション
    const validatedData = createCustomerSchema.parse(body)
    
    const customer = await createCustomer(userId, validatedData)
    
    return handleApiSuccess(customer, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
