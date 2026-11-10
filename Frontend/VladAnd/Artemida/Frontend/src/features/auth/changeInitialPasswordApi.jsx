const USE_MOCK = import.meta.env?.VITE_USE_MOCK === 'true'
const API_URL = import.meta.env?.VITE_API_URL ?? ''

export const CHANGE_PASSWORD_ERROR = {
  WRONG_CURRENT: 'WRONG_CURRENT',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER: 'SERVER',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
}

const ERROR_MESSAGES = {
  [CHANGE_PASSWORD_ERROR.WRONG_CURRENT]: 'Текущий пароль указан неверно.',
  [CHANGE_PASSWORD_ERROR.WEAK_PASSWORD]: 'Новый пароль не подходит. Выберите другой.',
  [CHANGE_PASSWORD_ERROR.UNAUTHORIZED]: 'Сессия истекла. Войдите снова.',
  [CHANGE_PASSWORD_ERROR.RATE_LIMIT]: 'Слишком много попыток. Попробуйте позже.',
  [CHANGE_PASSWORD_ERROR.SERVER]: 'Ошибка сервера. Попробуйте позже.',
  [CHANGE_PASSWORD_ERROR.NETWORK]: 'Нет соединения с сервером. Проверьте интернет.',
  [CHANGE_PASSWORD_ERROR.UNKNOWN]: 'Не удалось сменить пароль. Попробуйте ещё раз.',
}

export class ChangePasswordError extends Error {
  constructor(code) {
    super(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN)
    this.name = 'ChangePasswordError'
    this.code = code
  }
}

function mapStatusToCode(status, body) {
  if (status === 401 && body?.code === 'WRONG_CURRENT_PASSWORD') {
    return CHANGE_PASSWORD_ERROR.WRONG_CURRENT
  }
  if (status === 401 || status === 403) return CHANGE_PASSWORD_ERROR.UNAUTHORIZED
  if (status === 400 || status === 422) return CHANGE_PASSWORD_ERROR.WEAK_PASSWORD
  if (status === 429) return CHANGE_PASSWORD_ERROR.RATE_LIMIT
  if (status >= 500) return CHANGE_PASSWORD_ERROR.SERVER
  return CHANGE_PASSWORD_ERROR.UNKNOWN
}

async function request({ currentPassword, newPassword }) {
  let response
  try {
    response = await fetch(`${API_URL}/auth/change-initial-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  } catch {
    throw new ChangePasswordError(CHANGE_PASSWORD_ERROR.NETWORK)
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    throw new ChangePasswordError(mapStatusToCode(response.status, body))
  }
  return body
}

async function mockRequest({ currentPassword }) {
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (currentPassword !== 'temp1234') {
    throw new ChangePasswordError(CHANGE_PASSWORD_ERROR.WRONG_CURRENT)
  }
  return { mustChangePassword: false }
}

export function changeInitialPassword(passwords) {
  return USE_MOCK ? mockRequest(passwords) : request(passwords)
}
