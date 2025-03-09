import {
  AutoTokenizer,
  type FeatureExtractionPipeline,
  type PreTrainedTokenizer,
  pipeline,
} from '@huggingface/transformers'

const modelTypes = {
  small: 'Xenova/multilingual-e5-small', // Vector size: 384
  large: 'WhereIsAI/UAE-Large-V1', // Vector size: 1024
} as const

// Use the Singleton pattern to enable lazy construction of the pipeline.
// NOTE: We wrap the class in a function to prevent code duplication (see below).
const P = () =>
  // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
  class PipelineSingleton {
    static pipelineInstances = {} as Record<
      keyof typeof modelTypes,
      FeatureExtractionPipeline
    >
    static tokenizerInstances = {} as Record<
      keyof typeof modelTypes,
      PreTrainedTokenizer
    >

    static async getPipelineInstance(type: keyof typeof modelTypes = 'large') {
      if (!PipelineSingleton.pipelineInstances[type]) {
        PipelineSingleton.pipelineInstances[type] = await pipeline(
          'feature-extraction',
          modelTypes[type],
          {
            progress_callback: (info) => {
              console.log('Downloading model', type, info)
            },
            dtype: 'fp16',
          },
        )
        console.log('Model downloaded', type)
      }
      return PipelineSingleton.pipelineInstances[type]
    }

    static async getTokenizerInstance(type: keyof typeof modelTypes = 'large') {
      if (!PipelineSingleton.tokenizerInstances[type]) {
        PipelineSingleton.tokenizerInstances[type] =
          await AutoTokenizer.from_pretrained(modelTypes[type])
      }
      return PipelineSingleton.tokenizerInstances[type]
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
