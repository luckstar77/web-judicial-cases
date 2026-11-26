import { describe, expect, it } from 'vitest';
import type { UserProfile } from '@/shared/api/types';
import { createProfileSchema, type ProfileFormValues, toProfileFormValues, toUpdateProfileRequest } from './profile-schema';

const NEW_PASSWORD = 'new-password-1';
const CURRENT_PASSWORD = 'old-password-1';

const user = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  uid: 'uid-1',
  phone: '+886912345678',
  displayName: '小租',
  email: 'demo@example.com',
  hasPassword: true,
  ...overrides,
});

const formValues = (overrides: Partial<ProfileFormValues> = {}): ProfileFormValues => ({ ...toProfileFormValues(user()), ...overrides });

const errorPaths = (values: ProfileFormValues, requireCurrentPassword: boolean) => {
  const result = createProfileSchema({ requireCurrentPassword }).safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'));
};

describe('createProfileSchema', () => {
  it('requires the current password when changing the password of an account that has one', () => {
    const values = formValues({ password: NEW_PASSWORD, confirmPassword: NEW_PASSWORD });

    expect(errorPaths(values, true)).toEqual(['currentPassword']);
    expect(errorPaths({ ...values, currentPassword: CURRENT_PASSWORD }, true)).toEqual([]);
  });

  it('does not require the current password when the password is not being changed', () => {
    expect(errorPaths(formValues({ displayName: '新暱稱' }), true)).toEqual([]);
  });

  it('lets an SMS-only account set its first password without the current password', () => {
    expect(errorPaths(formValues({ password: NEW_PASSWORD, confirmPassword: NEW_PASSWORD }), false)).toEqual([]);
  });

  it('still checks that both new passwords match', () => {
    expect(errorPaths(formValues({ password: NEW_PASSWORD, confirmPassword: 'different-1', currentPassword: CURRENT_PASSWORD }), true)).toEqual([
      'confirmPassword',
    ]);
  });
});

describe('toUpdateProfileRequest', () => {
  it('sends currentPassword together with the new password when the account has a password', () => {
    const values = formValues({ password: NEW_PASSWORD, confirmPassword: NEW_PASSWORD, currentPassword: CURRENT_PASSWORD });

    expect(toUpdateProfileRequest(values, user())).toEqual({ password: NEW_PASSWORD, currentPassword: CURRENT_PASSWORD });
  });

  it('omits currentPassword for an SMS-only account', () => {
    const values = formValues({ password: NEW_PASSWORD, confirmPassword: NEW_PASSWORD, currentPassword: 'typed-anyway' });

    expect(toUpdateProfileRequest(values, user({ hasPassword: false }))).toEqual({ password: NEW_PASSWORD });
  });

  it('never sends currentPassword when the password is unchanged', () => {
    const values = formValues({ displayName: '新暱稱', currentPassword: CURRENT_PASSWORD });

    expect(toUpdateProfileRequest(values, user())).toEqual({ displayName: '新暱稱' });
  });
});
