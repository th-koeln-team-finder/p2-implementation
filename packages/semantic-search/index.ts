import pipelineInstance from './pipeline'

export async function generateTextEmbeddings(input: string): Promise<number[]> {
  const pipe = await pipelineInstance.getInstance()
  const embedding = await pipe(input, { pooling: 'mean', normalize: true })
  return Array.from(embedding.data)
}
