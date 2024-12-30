import {
    boolean,
    integer,
    json,
    pgTable,
    primaryKey,
    text, time,
    timestamp, uniqueIndex,
    uuid,
    varchar,
    check, pgEnum,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'
import {sql} from "drizzle-orm";

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
/*
* SkillData for a User and a Project. All can have multiple skills
*/
export const SkillData = pgTable('SkillData', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name:varchar().notNull(),
    level: integer().notNull(),
    isUserOrProject: varchar({enum: ['user', 'project']}).notNull(),
    userId: uuid().references(() => users.id),
    projectsId: integer().references(() => projects.id),

}, (skillData) => ({
    validLevel: check('valid_level',  sql`${skillData.level} >= 0`)
}))
export type SkillDataInsert = typeof SkillData.$inferInsert
export type SkillDataSelect = typeof SkillData.$inferSelect


//Project Tables
/**
 * Data specific for one project
 */
export const projects = pgTable('projects', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  status: varchar({ enum: ['open', 'closed'] }).notNull(),
    createdAt: timestamp( {mode:"date"}).defaultNow(),
    updatedAt: timestamp({mode:"date"}).defaultNow().$onUpdate(() => sql`current_timestamp`),
  isPublic: boolean().notNull().default(true),
  allowApplications: boolean().notNull().default(true),
  additionalInfo: json().default({}),
})
export type ProjectInsert = typeof projects.$inferInsert
export type ProjectSelect = typeof projects.$inferSelect

/**
 * ProjectIssues for a project. A project can have multiple issues
 */
export const projectIssue = pgTable('projectIssue', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer().notNull().references(() => projects.id), // Fremdschlüssel auf projects.id
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: timestamp( {mode:"date"}).defaultNow(),
    updatedAt: timestamp({mode:"date"}).defaultNow().$onUpdate(() => sql`current_timestamp`),
});
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
} as const
const weekdayEnum = pgEnum("WeekdayEnum", Object.values(Weekdays) as [string, ...string[]])

export const projectTimetable = pgTable('projectTimetable', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer().notNull().references(() => projects.id),
    weekdays: weekdayEnum().notNull(),
    startTime: time('startTime').notNull(),
    endTime: time('endTime').notNull(),
}, (timeTable) => ({
    uniqueWeekday: uniqueIndex('unique_weekday').on(timeTable.weekdays), //
    validTimeRange: check('valid_time_range',  sql`${timeTable.startTime} < ${timeTable.endTime}`) //
}))
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
