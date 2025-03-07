import pipelineInstance from './pipeline'

type TypeParam = Parameters<typeof pipelineInstance.getPipelineInstance>[0]
export async function generateTextEmbeddings(
  input: string,
  type?: TypeParam,
): Promise<number[]> {
  const pipe = await pipelineInstance.getPipelineInstance(type)
  const embedding = await pipe(input, { pooling: 'cls' })
  return Array.from(embedding.data)
}
