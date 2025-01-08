import {
  boolean,
  integer,
  json,
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
import type {AdapterAccountType} from 'next-auth/adapters'
import {relations, sql} from "drizzle-orm";

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

export const userSkillRelations = relations(userSkills, ({one}) => ({
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}))

export const skillRelations = relations(skills, ({many}) => ({
  userSkills: many(userSkills),
}))

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
//endregion
