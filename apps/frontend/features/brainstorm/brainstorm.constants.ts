export const BrainstormCacheTags = {
  base: 'brainstorm',
  list: 'brainstorm:list',
  detail: (id: string) => `${BrainstormCacheTags.base}:${id}`,
}
