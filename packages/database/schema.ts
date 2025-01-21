import { relations } from 'drizzle-orm'
import {
  type AnyPgColumn,
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import { Roles, type RolesType, RolesValues } from './constants'

export const pgRoles = pgEnum('role', RolesValues as [string, ...string[]])

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
  roles: pgRoles()
    .array()
    .notNull()
    .$type<RolesType[]>()
    .$defaultFn(() => [Roles.defaultUser]),
})
export type UserInsert = typeof users.$inferInsert
export type UserSelect = typeof users.$inferSelect

/**
 * Data for a single brainstorm
 */
export const brainstorms = pgTable('brainstorm', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  title: text('name').notNull(),
  description: text('description'),
  createdById: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})
export type BrainstormInsert = typeof brainstorms.$inferInsert
export type BrainstormSelect = typeof brainstorms.$inferSelect

/**
 * General comments for brainstorms
 */
export const brainstormComments = pgTable('brainstorm_comment', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  comment: text('comment').notNull(),
  isPinned: boolean('isPinned').notNull().default(false),
  brainstormId: uuid('brainstormId')
    .notNull()
    .references(() => brainstorms.id, { onDelete: 'cascade' }),
  parentCommentId: uuid('parentCommentId').references(
    (): AnyPgColumn => brainstormComments.id,
    {
      onDelete: 'cascade',
    },
  ),
  createdById: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})
export type BrainstormCommentInsert = typeof brainstormComments.$inferInsert
export type BrainstormCommentSelect = typeof brainstormComments.$inferSelect

export const brainstormCommentLikes = pgTable(
  'brainstorm_comment_like',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: uuid('commentId')
      .notNull()
      .references(() => brainstormComments.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.commentId] }),
  }),
)
export type BrainstormCommentLikeInsert =
  typeof brainstormCommentLikes.$inferInsert
export type BrainstormCommentLikeSelect =
  typeof brainstormCommentLikes.$inferSelect

export const brainstormBookmarks = pgTable(
  'brainstorm_bookmark',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    brainstormId: uuid('brainstormId')
      .notNull()
      .references(() => brainstorms.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.brainstormId] }),
  }),
)
export type BrainstormBookmarkInsert = typeof brainstormBookmarks.$inferInsert
export type BrainstormBookmarkSelect = typeof brainstormBookmarks.$inferSelect

export const tags = pgTable('tag', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: text('name').notNull().unique(),
})
export type TagInsert = typeof tags.$inferInsert
export type TagSelect = typeof tags.$inferSelect

export const brainstormTags = pgTable(
  'brainstorm_tag',
  {
    brainstormId: uuid('brainstormId')
      .notNull()
      .references(() => brainstorms.id, { onDelete: 'cascade' }),
    tagId: uuid('tagId')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.brainstormId, table.tagId] }),
  }),
)
export type BrainstormTagInsert = typeof brainstormTags.$inferInsert
export type BrainstormTagSelect = typeof brainstormTags.$inferSelect

export const uploadStatusEnum = pgEnum('upload_status', [
  'pending', // Someone requested a presigned URL (if there are pending uploads older than 30 minutes, then the presigend url is expired and we have to check if the file was uploaded)
  'uploaded', // Callback after upload was successful
  'failed', // Callback after upload failed
])

export const uploadedFiles = pgTable('uploaded_file', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  bucketPath: text('bucketPath').notNull(),
  fileType: text('fileType').notNull(),
  fileSize: integer('fileSize').notNull(),
  status: uploadStatusEnum().notNull().default('pending'),
  uploadedById: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  uploadedAt: timestamp('uploadedAt', { mode: 'date' }).notNull().defaultNow(),
})
export type UploadedFileInsert = typeof uploadedFiles.$inferInsert
export type UploadedFileSelect = typeof uploadedFiles.$inferSelect

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
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
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

export const brainstormRelations = relations(brainstorms, ({ one, many }) => ({
  creator: one(users, {
    fields: [brainstorms.createdById],
    references: [users.id],
  }),
  comments: many(brainstormComments, {
    relationName: 'brainstorm',
  }),
  tags: many(brainstormTags),
  bookmarks: many(brainstormBookmarks),
}))

export const brainstormCommentRelations = relations(
  brainstormComments,
  ({ one, many }) => ({
    brainstorm: one(brainstorms, {
      fields: [brainstormComments.brainstormId],
      references: [brainstorms.id],
    }),
    creator: one(users, {
      fields: [brainstormComments.createdById],
      references: [users.id],
    }),
    parentComment: one(brainstormComments, {
      relationName: 'parentComment',
      fields: [brainstormComments.parentCommentId],
      references: [brainstormComments.id],
    }),
    childComments: many(brainstormComments, {
      relationName: 'parentComment',
    }),
    likes: many(brainstormCommentLikes),
  }),
)

export const brainstormCommentLikeRelations = relations(
  brainstormCommentLikes,
  ({ one }) => ({
    user: one(users, {
      fields: [brainstormCommentLikes.userId],
      references: [users.id],
    }),
    comment: one(brainstormComments, {
      fields: [brainstormCommentLikes.commentId],
      references: [brainstormComments.id],
    }),
  }),
)

export const brainstormBookmarkRelations = relations(
  brainstormBookmarks,
  ({ one }) => ({
    user: one(users, {
      fields: [brainstormBookmarks.userId],
      references: [users.id],
    }),
    brainstorm: one(brainstorms, {
      fields: [brainstormBookmarks.brainstormId],
      references: [brainstorms.id],
    }),
  }),
)

export const brainstormTagRelations = relations(brainstormTags, ({ one }) => ({
  brainstorm: one(brainstorms, {
    fields: [brainstormTags.brainstormId],
    references: [brainstorms.id],
  }),
  tag: one(tags, {
    fields: [brainstormTags.tagId],
    references: [tags.id],
  }),
}))

export const uploadedFileRelations = relations(uploadedFiles, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [uploadedFiles.uploadedById],
    references: [users.id],
  }),
}))
