import { relations, sql } from 'drizzle-orm'
import {
  type AnyPgColumn,
  boolean,
  check,
  date,
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
import { Roles, type RolesType, RolesValues } from './constants'
import exp from "node:constants";

export const pgRoles = pgEnum('role', RolesValues as [string, ...string[]])

/**
 * Test data should only demonstrate the usage of the library
 */
export const test = pgTable('test', {
  id: uuid().primaryKey().notNull().defaultRandom(),
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
  roles: pgRoles()
    .array()
    .notNull()
    .$type<RolesType[]>()
    .$defaultFn(() => [Roles.defaultUser]),
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
 * Data specific for one user
 */
export const skills = pgTable('skills', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  skill: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type SkillsInsert = typeof skills.$inferInsert
export type SkillsSelect = typeof skills.$inferSelect

export const userSkills = pgTable('userSkills', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  skillId: uuid('skillId')
    .notNull()
    .references(() => skills.id, { onDelete: 'cascade' }),
  level: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type UserSkillsInsert = typeof userSkills.$inferInsert
export type UserSkillsSelect = typeof userSkills.$inferSelect

export const userSkillRelations = relations(userSkills, ({ one }) => ({
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
}))

export const skillRelations = relations(skills, ({ many }) => ({
  userSkills: many(userSkills),
}))

export const userSkillVerification = pgTable('userSkillVerification', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  verifierId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userSkillId: uuid('skillId')
    .notNull()
    .references(() => userSkills.id, { onDelete: 'cascade' }),
  status: varchar({ enum: ['pending', 'approved', 'rejected'] }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})
export type UserSkillVerificationInsert =
  typeof userSkillVerification.$inferInsert
export type UserSkillVerificationSelect =
  typeof userSkillVerification.$inferSelect

export const userRatings = pgTable('userRatings', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  raterId: uuid('userId')
    .notNull()
    .references(() => users.id),
  rateeId: uuid('userId')
    .notNull()
    .references(() => users.id),
  ratingType: varchar({ enum: ['friendly', 'reliable'] }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
})
export type UserRatingsInsert = typeof userRatings.$inferInsert
export type UserRatingsSelect = typeof userRatings.$inferSelect

export const userFollows = pgTable('userFollows', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  followerId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  followeeId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp().notNull().defaultNow(),
})
export type UserFollowsInsert = typeof userRatings.$inferInsert

/**
 * This table stores all the projects a user is and was part of.
 * They may also add other projects to their timeline that they worked on
 * but did not use this platform.
 */
export const userProjects = pgTable('userProjects', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id),
  // for projects from this platform
  projectId: uuid('projectId')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
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
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id),
  projectId: uuid('projectId')
    .notNull()
    .references(() => projects.id),
  enableNotifications: boolean().notNull().default(true),
  preferredNotificationChannel: varchar({ enum: ['email', 'push', 'both'] })
    .notNull()
    .default('email'),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

/**
 * Data specific for one project
 */
export const projects = pgTable('projects', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  status: varchar({ enum: ['open', 'closed'] }).notNull(),
  phase: text(),

  location: text(),
  isPublic: boolean().notNull().default(true),
  allowApplications: boolean().notNull().default(true),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`),
})

export type ProjectInsert = typeof projects.$inferInsert
export type ProjectSelect = typeof projects.$inferSelect

export const projectLinks = pgTable('projectLinks', {
    id: uuid().primaryKey().notNull().defaultRandom(),
    projectId: uuid('projectId')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    linkText: text().notNull(),
    linkUrl: text().notNull(),
})
export type ProjectLinksInsert = typeof projectLinks.$inferInsert
export type ProjectLinksSelect = typeof projectLinks.$inferSelect


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
    name: text().notNull(),
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

/**
 * Ressources for a project, referencing Project and Ressource
 */
export const projectResource = pgTable('projectResource', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  label: text().notNull(),
  link: text().notNull(),
  fileUpload: text().notNull(), //TODO fileUpload
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`),
})
export type ProjectResourceInsert = typeof projectResource.$inferInsert
export type ProjectResourceSelect = typeof projectResource.$inferSelect

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

export const projectBookmarks = pgTable(
  'project_bookmark',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: uuid('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.projectId] }),
  }),
)
export type projectBookmarkInsert = typeof projectBookmarks.$inferInsert
export type projectBookmarkSelect = typeof projectBookmarks.$inferSelect

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
//endregion

export const projectRelations = relations(projects, ({ many }) => ({
  issues: many(projectIssue, {
    relationName: 'projectIssues',
  }),
  timetable: many(projectTimetable, {
    relationName: 'projectTimetable',
  }),
  projectLinks: many(projectLinks, {
        relationName: 'projectLinks',
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

export const skillProjectRelations = relations(skill, ({ many }) => ({
  projectSkills: many(projectSkill),
}))

export const linkProjectRelations = relations(projectLinks, ({ one }) => ({
    project: one(projects, {
        fields: [projectLinks.projectId],
        references: [projects.id],
        relationName: 'projectLinks',
    }),
}))
export const issueRelations = relations(projectIssue, ({ one }) => ({
  project: one(projects, {
    fields: [projectIssue.projectId],
    references: [projects.id],
    relationName: 'projectIssues',
  }),
}))

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
