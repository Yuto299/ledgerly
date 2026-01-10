import { NextRequest } from 'next/server'
import { getUserId } from '@/lib/auth/session'
import { handleApiError, handleApiSuccess } from '@/lib/api/errorHandler'
import { updateCustomerSchema } from '@/features/customers/schemas/customerSchema'
import { getCustomerById } from '@/application/usecases/customers/getCustomerById'
import { updateCustomer } from '@/application/usecases/customers/updateCustomer'
import { deleteCustomer } from '@/application/usecases/customers/deleteCustomer'

/**
 * GET /api/customers/:id
 * 顧客詳細取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const result = await getCustomerById(params.id, userId)
    
    return handleApiSuccess(result)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PUT /api/customers/:id
 * 顧客更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const body = await request.json()
    
    // バリデーション
    const validatedData = updateCustomerSchema.parse(body)
    
    const customer = await updateCustomer(params.id, userId, validatedData)
    
    return handleApiSuccess(customer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/customers/:id
 * 顧客削除（論理削除）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId()
    const customer = await deleteCustomer(params.id, userId)
    
    return handleApiSuccess(customer)
  } catch (error) {
    return handleApiError(error)
  }
}
