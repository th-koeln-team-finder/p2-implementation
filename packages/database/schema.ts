import {boolean, integer, pgTable, primaryKey, text, timestamp, uuid, varchar,} from 'drizzle-orm/pg-core'
import type {AdapterAccountType} from 'next-auth/adapters'

/**
 * Test data should only demonstrate the usage of the library
 */
export const test = pgTable('test', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  checked: boolean().notNull().default(false),
})
export type TestInsert = typeof test.$inferInsert
export type TestSelect = typeof test.$inferSelect

/**
 * Data specific for one user
 */
export const users = pgTable('user', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: text('name').unique().notNull(),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  bio: text('bio'),
})
export type UserInsert = typeof users.$inferInsert
export type UserSelect = typeof users.$inferSelect

/**
 * Data used for authentication of a user, a user can have multiple accounts (so multiple login methods)
 */
export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    // biome-ignore lint/style/useNamingConvention: This is a column name given by the library
    refresh_token: text('refresh_token'),
    // biome-ignore lint/style/useNamingConvention: This is a column name given by the library
    access_token: text('access_token'),
    // biome-ignore lint/style/useNamingConvention: This is a column name given by the library
    expires_at: integer('expires_at'),
    // biome-ignore lint/style/useNamingConvention: This is a column name given by the library
    token_type: text('token_type'),
    scope: text('scope'),
    // biome-ignore lint/style/useNamingConvention: This is a column name given by the library
    id_token: text('id_token'),
    // biome-ignore lint/style/useNamingConvention: This is a column name given by the library
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)
export type AccountInsert = typeof accounts.$inferInsert
export type AccountSelect = typeof accounts.$inferSelect

/**
 * Data used for sessions, a session is a login session of a user
 */
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})
export type SessionInsert = typeof sessions.$inferInsert
export type SessionSelect = typeof sessions.$inferSelect

/**
 * Data used for webauthn authenticators, a user can have multiple authenticators
 */
export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
)
export type AuthenticatorInsert = typeof authenticators.$inferInsert
export type AuthenticatorSelect = typeof authenticators.$inferSelect
