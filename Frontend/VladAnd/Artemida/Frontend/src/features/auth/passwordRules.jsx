export const PASSWORD_RULES = {
  minLength: 8,
}

export const MESSAGES = {
  currentRequired: 'Введите текущий пароль.',
  newRequired: 'Введите новый пароль.',
  confirmRequired: 'Повторите новый пароль.',
  tooShort: `Пароль должен содержать не менее ${PASSWORD_RULES.minLength} символов.`,
  sameAsCurrent: 'Новый пароль должен отличаться от текущего.',
  mismatch: 'Пароли не совпадают.',
}

export function validateChangePasswordForm({
  currentPassword = '',
  newPassword = '',
  confirmPassword = '',
}) {
  const errors = {}

  if (!currentPassword) {
    errors.currentPassword = MESSAGES.currentRequired
  }

  if (!newPassword) {
    errors.newPassword = MESSAGES.newRequired
  } else if (newPassword.length < PASSWORD_RULES.minLength) {
    errors.newPassword = MESSAGES.tooShort
  } else if (newPassword === currentPassword) {
    errors.newPassword = MESSAGES.sameAsCurrent
  }

  if (!confirmPassword) {
    errors.confirmPassword = MESSAGES.confirmRequired
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = MESSAGES.mismatch
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}
