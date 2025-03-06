import { projectApplication } from '@repo/database/schema'
import {db, Schema} from '@repo/database'
import {and, desc, eq, isNull, sql} from 'drizzle-orm'
import { unstable_cache as cache } from 'next/cache'

export const getApplicationsForProject = cache(
    async (
        id: string,
    ) => {
        return db.query.projectApplication
            .findMany({
                where: and(
                    eq(Schema.projectApplication.projectId, id),
                ),
                with: {
                    project: true,
                    user:true,
                },
                orderBy: desc(Schema.projectApplication.createdAt),
            })
            .then((applications) =>
                applications.map((application) => ({
                    ...application,
                })),
            )
    },
    ['getApplicationsForProject'],
    { tags: ['applications'] },
    /*(projectId: string) =>
        db
            .select({
                userId: projectApplication.userId,
                firstName: projectApplication.firstName,
                lastName: projectApplication.lastName,
                email: projectApplication.mail,
                phone: projectApplication.phone,
                message: projectApplication.message,
                createdAt: projectApplication.createdAt,
            })
            .from(projectApplication)
            .where(eq(projectApplication.projectId, projectId)),
    ['getApplicationsForProject'],
    { tags: ['applications'] }*/
)

/*export const getApplicationDetails = cache(
    (projectId: string, userId: string) =>
        db
            .select()
            .from(projectApplication)
            .where(
                eq(projectApplication.projectId, projectId) &&
                eq(projectApplication.userId, userId)
            )
            .limit(1),
    ['getApplicationDetails'],
    { tags: ['applications'] }
)*/