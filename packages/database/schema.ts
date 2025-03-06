import { relations, sql } from 'drizzle-orm'
import {
  type AnyPgColumn,
  boolean,
  check,
  date,
  integer,
  json,
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
import {
  Roles,
  type RolesType,
  RolesValues,
  notificationColumns,
} from './constants'

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
  firstName: text('firstName'),
  lastName: text('lastName'),
  image: uuid().references((): AnyPgColumn => uploadedFiles.id, {
    onDelete: 'cascade',
  }),
  roles: pgRoles()
    .array()
    .notNull()
    .$type<RolesType[]>()
    .$defaultFn(() => [Roles.defaultUser]),
  bio: text('bio'),
  occupation: text('occupation'),
  url: text('url'),
  location: text('location'),
  allowInvites: boolean().notNull().default(true),
  isPublic: boolean().notNull().default(true),
  languagePreference: varchar({ enum: ['en', 'de'] })
    .notNull()
    .default('en'),
  activateNotifications: boolean().notNull().default(true),
  ...notificationColumns,
  lastActive: timestamp('lastActive', { mode: 'date' }),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
export type UserInsert = typeof users.$inferInsert
export type UserSelect = typeof users.$inferSelect

export const userSkills = pgTable(
  'userSkills',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    skillId: uuid()
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    level: integer().notNull(),
    createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (userSkill) => ({
    validLevel: check('valid_userSkill_level', sql`${userSkill.level} >= 0`),
  }),
)
export type UserSkillsInsert = typeof userSkills.$inferInsert
export type UserSkillsSelect = typeof userSkills.$inferSelect

export const userSkillRelations = relations(userSkills, ({ one, many }) => ({
  skill: one(skills, {
    fields: [userSkills.skillId],
    references: [skills.id],
  }),
  userSkillVerification: many(userSkillVerification),
  user: one(users, {
    fields: [userSkills.userId],
    references: [users.id],
  }),
}))

export const userSkillVerification = pgTable('userSkillVerification', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  verifierId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userSkillId: uuid('userSkillId')
    .notNull()
    .references(() => userSkills.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
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
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
})
export type UserRatingsInsert = typeof userRatings.$inferInsert
export type UserRatingsSelect = typeof userRatings.$inferSelect

export const userFollows = pgTable('userFollows', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  followerId: uuid('followerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  followeeId: uuid('followeeId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp({ mode: 'date' }).notNull().defaultNow(),
})
export type UserFollowsInsert = typeof userFollows.$inferInsert

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
  projectId: uuid('projectId').references(() => projects.id, {
    onDelete: 'cascade',
  }),
  // for projects not from this platform
  projectName: varchar({ length: 255 }),
  projectJoinedDate: date().notNull(),
  projectLeftDate: date(),
  projectDescription: varchar({ length: 255 }),
  visible: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
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
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Skills for a User and a Project. All can have multiple skills
 */

export const skills = pgTable('skills', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  skill: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
export type SkillsInsert = typeof skills.$inferInsert
export type SkillsSelect = typeof skills.$inferSelect

export const skillRelations = relations(skills, ({ many }) => ({
  userSkills: many(userSkills),
  projectSkills: many(projectSkill),
}))

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
      .references(() => skills.id, { onDelete: 'cascade' }),
    // TODO This needs to be removed since the name is stored in the skill relation
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
 * Resources for a project, referencing Project and Resource
 */
export const projectResource = pgTable('projectResource', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  label: text().notNull(),
  href: text(),
  fileUpload: uuid().references(() => uploadedFiles.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp({ mode: 'date' }).defaultNow(),
  updatedAt: timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp`),
})
export type ProjectResourceInsert = typeof projectResource.$inferInsert
export type ProjectResourceSelect = typeof projectResource.$inferSelect

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
 * Apply for a project
 */
export const projectApplication = pgTable(
  'projectApplication',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: uuid('projectId')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    firstName: text().notNull(),
    lastName: text(),
    mail: text().notNull(),
    phone: text().notNull(),
    file: uuid().references(() => uploadedFiles.id, {
      onDelete: 'cascade',
    }),
    message: text().notNull(),
    createdAt: timestamp({ mode: 'date' }).defaultNow(),
    updatedAt: timestamp({ mode: 'date' })
      .defaultNow()
      .$onUpdate(() => sql`current_timestamp`),
  },
  (projectApplication) => ({
    pk: primaryKey({
      columns: [projectApplication.projectId, projectApplication.userId],
    }),
  }),
)
export type ProjectApplicationInsert = typeof projectApplication.$inferInsert
export type ProjectApplicationSelect = typeof projectApplication.$inferSelect

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

export const brainstormResourceType = pgEnum('brainstorm_resource_type', [
  'file',
  'link',
])
export const brainstormResources = pgTable('brainstorm_resource', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  brainstormId: uuid('brainstormId').references(() => brainstorms.id, {
    onDelete: 'cascade',
  }),
  type: brainstormResourceType().notNull(),
  label: text('label').notNull(),
  value: text('value'),
  fileValue: uuid().references(() => uploadedFiles.id, { onDelete: 'cascade' }),
})
export type BrainstormResourceInsert = typeof brainstormResources.$inferInsert
export type BrainstormResourceSelect = typeof brainstormResources.$inferSelect

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

export const pushSubscriptions = pgTable('pushSubscriptions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('userId').references(() => users.id, { onDelete: 'cascade' }),
  subscription: json().notNull(),
})

export type PushSubscriptionInsert = typeof pushSubscriptions.$inferInsert
export type PushSubscriptionSelect = typeof pushSubscriptions.$inferSelect

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

export const projectRelations = relations(projects, ({ many }) => ({
  issues: many(projectIssue, {
    relationName: 'projectIssues',
  }),
  timetable: many(projectTimetable, {
    relationName: 'projectTimetable',
  }),
  resources: many(projectResource, {
    relationName: 'projectResources',
  }),
  bookmarks: many(projectBookmarks),
  projectSkills: many(projectSkill),

  application: many(projectApplication, {
    relationName: 'projectApplication',
  }),
}))

export const projectSkillRelations = relations(projectSkill, ({ one }) => ({
  skill: one(skills, {
    fields: [projectSkill.skillId],
    references: [skills.id],
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

export const projectResourceRelations = relations(
  projectResource,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectResource.projectId],
      references: [projects.id],
      relationName: 'projectResources',
    }),
    uploadedFile: one(uploadedFiles, {
      fields: [projectResource.fileUpload],
      references: [uploadedFiles.id],
      relationName: 'projectResourceFileUpload',
    }),
  }),
)

export const FileUploadRelations = relations(uploadedFiles, ({ one }) => ({
  projectResource: one(projectResource, {
    fields: [uploadedFiles.id],
    references: [projectResource.fileUpload],
    relationName: 'projectResourceFileUpload',
  }),
}))

export const issueRelations = relations(projectIssue, ({ one }) => ({
  project: one(projects, {
    fields: [projectIssue.projectId],
    references: [projects.id],
    relationName: 'projectIssues',
  }),
}))

export const projectApplicationRelations = relations(
  projectApplication,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectApplication.projectId],
      references: [projects.id],
    }),
    user: one(users, {
      fields: [projectApplication.userId],
      references: [users.id],
    }),
  }),
)

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
  resources: many(brainstormResources),
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

export const brainstormResourceRelations = relations(
  brainstormResources,
  ({ one }) => ({
    brainstorm: one(brainstorms, {
      fields: [brainstormResources.brainstormId],
      references: [brainstorms.id],
    }),
    file: one(uploadedFiles, {
      fields: [brainstormResources.fileValue],
      references: [uploadedFiles.id],
    }),
  }),
)

export const uploadedFileRelations = relations(uploadedFiles, ({ one }) => ({
  uploadedBy: one(users, {
    fields: [uploadedFiles.uploadedById],
    references: [users.id],
  }),
}))
export const userProjectRelations = relations(userProjects, ({ one }) => ({
  project: one(projects, {
    fields: [userProjects.projectId],
    references: [projects.id],
  }),
}))

export const userSkillVerificationRelations = relations(
  userSkillVerification,
  ({ one }) => ({
    verifier: one(users, {
      fields: [userSkillVerification.verifierId],
      references: [users.id],
    }),
    userSkill: one(userSkills, {
      fields: [userSkillVerification.userSkillId],
      references: [userSkills.id],
    }),
  }),
)

export const userRelations = relations(users, ({ one, many }) => ({
  skills: many(userSkills),
  projects: many(userProjects),
  projectSettings: many(userProjectSettings),
  authenticators: many(authenticators),
  ratings: many(userRatings),
  follows: many(userFollows),
  image: one(uploadedFiles, {
    fields: [users.image],
    references: [uploadedFiles.id],
  }),
  userSkillVerification: many(userSkillVerification),
}))
