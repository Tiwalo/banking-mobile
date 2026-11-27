/* Generated from banking-core-api@fc06aebdc53ae2e4a28e54aaeb875294e317e8c1. Run npm run contract:generate. */
import type { components, operations } from './banking';

type AccountPage = operations['listAccounts']['responses'][200]['content']['application/json'];
type AccountLimit = NonNullable<NonNullable<operations['listAccounts']['parameters']['query']>['limit']>;
type Id = components['schemas']['Id'];
type Cursor = components['schemas']['Cursor'];
type Account = components['schemas']['Account'];
type TransferReceipt = components['schemas']['TransferReceipt'];
type Problem = components['schemas']['Problem'];

export function isId(value: unknown): value is Id;
export function isAccountLimit(value: unknown): value is AccountLimit;
export function isCursor(value: unknown): value is Cursor;
export function isAccountPage(value: unknown): value is AccountPage;
export function isAccount(value: unknown): value is Account;
export function isTransferReceipt(value: unknown): value is TransferReceipt;
export function isProblem(value: unknown): value is Problem;
