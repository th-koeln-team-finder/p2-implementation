import { relations, sql } from 'drizzle-orm'
import {
  type AnyPgColumn,
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  check,
  date,
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
  bio: text('bio'),
  url: text('url'),
  location: text('location'),
  allowInvites: boolean().notNull().default(true),
  isPublic: boolean().notNull().default(true),
  languagePreference: varchar({ enum: ['en', 'de'] }).notNull().default('en'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
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

/**
 * Data specific for one user
*/
export const skills = pgTable('skills', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  skill: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type SkillsInsert = typeof skills.$inferInsert
export type SkillsSelect = typeof skills.$inferSelect

export const userSkills = pgTable('userSkills', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('userId').notNull().references(() => users.id, {onDelete: 'cascade'}),
  skillId: integer('skillId').notNull().references(() => skills.id, {onDelete: 'cascade'}),
  level: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type UserSkillsInsert = typeof userSkills.$inferInsert
export type UserSkillsSelect = typeof userSkills.$inferSelect

export const userSkillVerification = pgTable('userSkillVerification', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  verifierId: uuid('userId').notNull().references(() => users.id, {onDelete: 'cascade'}),
  userSkillId: integer('skillId').notNull().references(() => userSkills.id, {onDelete: 'cascade'}),
  status: varchar({ enum: ['pending', 'approved', 'rejected'] }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type UserSkillVerificationInsert = typeof userSkillVerification.$inferInsert
export type UserSkillVerificationSelect = typeof userSkillVerification.$inferSelect

export const userRatings = pgTable('userRatings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  raterId: uuid('userId').notNull().references(() => users.id),
  rateeId: uuid('userId').notNull().references(() => users.id),
  ratingType: varchar({ enum: ['friendly', 'reliable'] }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
})
export type UserRatingsInsert = typeof userRatings.$inferInsert
export type UserRatingsSelect = typeof userRatings.$inferSelect

export const userFollows = pgTable('userFollows', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  followerId: uuid('userId').notNull().references(() => users.id, {onDelete: 'cascade'}),
  followeeId: uuid('userId').notNull().references(() => users.id, {onDelete: 'cascade'}),
  createdAt: timestamp().notNull().defaultNow(),
})
export type UserFollowsInsert = typeof userRatings.$inferInsert

/**
 * This table stores all the projects a user is and was part of.
 * They may also add other projects to their timeline that they worked on
 * but did not use this platform.
 */
export const userProjects = pgTable('userProjects', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('userId').notNull().references(() => users.id),
  // for projects from this platform
  projectId: integer('projectId').notNull().references(() => projects.id),
  // for projects not from this platform
  projectName: varchar({ length: 255 }),
  projectJoinedDate: date().notNull(),
  projectLeftDate: date(),
  projectDescription: varchar({ length: 255 }),
  visible: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type UserProjectsInsert = typeof userProjects.$inferInsert
export type UserProjectsSelect = typeof userProjects.$inferSelect

export const userProjectSettings = pgTable('userProjectSettings', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('userId').notNull().references(() => users.id),
  projectId: integer('projectId').notNull().references(() => projects.id),
  enableNotifications: boolean().notNull().default(true),
  preferredNotificationChannel: varchar({ enum: ['email', 'push', 'both'] }).notNull().default('email'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

/**
 * Data specific for one project
 */
export const projects = pgTable('projects', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  status: varchar({ enum: ['open', 'closed'] }).notNull(),
  createdAt: varchar({ length: 255 }).notNull(),
  updatedAt: varchar({ length: 255 }).notNull(),
  isPublic: boolean().notNull().default(true),
  allowApplications: boolean().notNull().default(true),
  additionalInfo: json().default({}),
})
export const ProjectIssue = pgTable('ProjectIssue', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer().notNull().references(() => projects.id), // Fremdschlüssel auf projects.id
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: varchar({ length: 255 }).notNull(),
    updatedAt: varchar({ length: 255 }).notNull(),
});
export const ProjectTimetable = pgTable('ProjectTimetable', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer().notNull().references(() => projects.id),
    weekdays: varchar({enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}).notNull(),
    startTime: time('startTime').notNull(),
    endTime: time('endTime').notNull(),
}, (timeTable) => ({
    uniqueWeekday: uniqueIndex('unique_weekday').on(timeTable.weekdays), //
    validTimeRange: check('valid_time_range',  sql`${timeTable.startTime} < ${timeTable.endTime}`) //
}))


export type ProjectInsert = typeof projects.$inferInsert
export type ProjectSelect = typeof projects.$inferSelect

//region Technical Tables
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
//endregion

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

export const userSkillRelations = relations(userSkills, ({one}) => ({
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}))

export const skillRelations = relations(skills, ({many}) => ({
  userSkills: many(userSkills),
}))