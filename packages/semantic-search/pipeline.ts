import {
  type FeatureExtractionPipeline,
  type ProgressCallback,
  pipeline,
} from '@huggingface/transformers'

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
const P = () =>
  // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
  class PipelineSingleton {
    static instance = null as FeatureExtractionPipeline | null

    static async getInstance(progress_callback?: ProgressCallback) {
      if (PipelineSingleton.instance === null) {
        PipelineSingleton.instance = await pipeline(
          'feature-extraction',
          'Xenova/multilingual-e5-small',
          { progress_callback, dtype: 'fp16' },
        )
      }
      return PipelineSingleton.instance
    }
  }

type GlobalOverride = typeof globalThis & {
  pipelineSingleton: ReturnType<typeof P>
}

let pipelineInstance: ReturnType<typeof P>
if (process.env.NODE_ENV !== 'production') {
  // When running in development mode, attach the pipeline to the
  // global object so that it's preserved between hot reloads.
  // For more information, see https://vercel.com/guides/nextjs-prisma-postgres
  if (!(global as GlobalOverride).pipelineSingleton) {
    ;(global as GlobalOverride).pipelineSingleton = P()
  }
  pipelineInstance = (global as GlobalOverride).pipelineSingleton
} else {
  pipelineInstance = P()
}

export default pipelineInstance
