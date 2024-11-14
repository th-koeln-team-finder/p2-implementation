FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
ENV NODE_ENV=production

COPY --from=build /app/apps/frontend/.next/ .
COPY --from=build /app/apps/frontend/public/ ./public/
RUN mkdir -p ./standalone/apps/frontend/public/_next
RUN mv ./static ./standalone/apps/frontend/public/_next/static
RUN mv ./public/* ./standalone/apps/frontend/public/

ENV PORT=3000
EXPOSE 3000

CMD [ "node", "./standalone/apps/frontend/server.js" ]
#ENTRYPOINT ["ls", ".next"]