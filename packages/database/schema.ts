import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

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
})
export type UserInsert = typeof users.$inferInsert
export type UserSelect = typeof users.$inferSelect
/**
 * Skills for a User and a Project. All can have multiple skills
 */
export const skill = pgTable('skill', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar().notNull(),
})
export type SkillInsert = typeof skill.$inferInsert
export type SkillSelect = typeof skill.$inferSelect

//Project Tables
/**
 * Data specific for one project
 */
export const projects = pgTable('projects', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  status: varchar({ enum: ['open', 'closed'] }).notNull(),
  isPublic: boolean().notNull().default(true),
  allowApplications: boolean().notNull().default(true),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`),
})
export type ProjectInsert = typeof projects.$inferInsert
export type ProjectSelect = typeof projects.$inferSelect

/**
 * Skills for a project, referencing Project and Skill
 */
export const projectSkill = pgTable(
  'projectSkill',
  {
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    skillId: uuid()
      .notNull()
      .references(() => skill.id, { onDelete: 'cascade' }),
    level: integer().notNull(),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
    updatedAt: timestamp({ mode: 'date' })
      .defaultNow()
      .$onUpdate(() => sql`current_timestamp`),
  },
  (projectSkill) => ({
    pk: primaryKey({ columns: [projectSkill.projectId, projectSkill.skillId] }),
    validLevel: check(
      'valid_projectSkill_level',
      sql`${projectSkill.level} >= 0`,
    ),
  }),
)
export type ProjectSkillInsert = typeof projectSkill.$inferInsert
export type ProjectSkillSelect = typeof projectSkill.$inferSelect

export const userSkill = pgTable(
  'userSkill',
  {
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    skillId: uuid()
      .notNull()
      .references(() => skill.id, { onDelete: 'cascade' }),
    level: integer().notNull(),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
    updatedAt: timestamp({ mode: 'date' })
      .defaultNow()
      .$onUpdate(() => sql`current_timestamp`),
  },
  (userSkill) => ({
    pk: primaryKey({ columns: [userSkill.userId, userSkill.skillId] }), //
    validLevel: check('valid_userSkill_level', sql`${userSkill.level} >= 0`),
  }),
)
export type UserSkillInsert = typeof userSkill.$inferInsert
export type UserSkillSelect = typeof userSkill.$inferSelect

/**
 * ProjectIssues for a project. A project can have multiple issues
 */
export const projectIssue = pgTable('projectIssue', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }), // Fremdschlüssel auf projects.id
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`),
})
export type ProjectIssueInsert = typeof projectIssue.$inferInsert
export type ProjectIssueSelect = typeof projectIssue.$inferSelect

/**
 * ProjectTimetable for a project. Data for set Working Times
 */
export const Weekdays = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
  standalone: 'standalone',
} as const
export const weekdayEnum = pgEnum(
  'weekdayEnum',
  Object.values(Weekdays) as [string, ...string[]],
)

export const projectTimetable = pgTable(
  'projectTimetable',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    projectId: uuid()
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    weekdays: weekdayEnum().notNull(),
    description: text().notNull(),
  },
  (timeTable) => ({
    uniqueWeekday: uniqueIndex('unique_weekday').on(
      timeTable.projectId,
      timeTable.weekdays,
    ),
  }),
)
export type ProjectTimetableInsert = typeof projectTimetable.$inferInsert
export type ProjectTimetableSelect = typeof projectTimetable.$inferSelect

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

export const projectRelations = relations(projects, ({ many }) => ({
  issues: many(projectIssue, {
    relationName: 'projectIssues',
  }),
  timetable: many(projectTimetable, {
    relationName: 'projectTimetable',
  }),
  projectSkills: many(projectSkill),
}))

export const projectSkillRelations = relations(projectSkill, ({ one }) => ({
  skill: one(skill, {
    fields: [projectSkill.skillId],
    references: [skill.id],
  }),
  project: one(projects, {
    fields: [projectSkill.projectId],
    references: [projects.id],
  }),
}))

export const timetableRelations = relations(projectTimetable, ({ one }) => ({
  project: one(projects, {
    fields: [projectTimetable.projectId],
    references: [projects.id],
    relationName: 'projectTimetable',
  }),
}))

export const skillRelations = relations(skill, ({ many }) => ({
  projectSkills: many(projectSkill),
}))

export const issueRelations = relations(projectIssue, ({ one }) => ({
  project: one(projects, {
    fields: [projectIssue.projectId],
    references: [projects.id],
    relationName: 'projectIssues',
  }),
}))
