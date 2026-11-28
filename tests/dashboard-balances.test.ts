import { totalAvailableMinor } from '../src/dashboard/owned-accounts';
import { accountPage, ownedAccount } from './fixtures/banking-api';

const secondAccount = { ...ownedAccount, accountId: '00000000-0000-4000-8000-000000000002' };

it('totals a complete page of PHP balances with exact centavo precision', () => {
  const second = { ...secondAccount, availableBalanceMinor: '9' };
  expect(totalAvailableMinor({ accounts: [ownedAccount, second] })).toBe('9007199254741002');
  expect(totalAvailableMinor({ accounts: [{ ...ownedAccount, availableBalanceMinor: '0' }] })).toBe('0');
});

it('does not total incomplete, empty, invalid, duplicate, or overflowing pages', () => {
  const max = { ...ownedAccount, availableBalanceMinor: '9223372036854775807' };
  expect(totalAvailableMinor(accountPage)).toBeNull();
  expect(totalAvailableMinor({ accounts: [] })).toBeNull();
  expect(totalAvailableMinor({ accounts: [{ ...ownedAccount, availableBalanceMinor: '1.0' }] })).toBeNull();
  expect(totalAvailableMinor({ accounts: [max] })).toBe(max.availableBalanceMinor);
  expect(totalAvailableMinor({ accounts: [ownedAccount, ownedAccount] })).toBeNull();
  expect(totalAvailableMinor({ accounts: [max, secondAccount] })).toBeNull();
});
