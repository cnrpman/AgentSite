const MODEL_NAME = 'gpt-5';
const FALLBACK_ENCODING = 'o200k_base';

type TokenizerState = {
  encode: (text: string) => { length: number };
  label: string;
  note?: string;
};

let tokenizerState: TokenizerState | null = null;
let tokenizerInitFailed = false;

async function getTokenizer(): Promise<TokenizerState | null> {
  if (tokenizerState || tokenizerInitFailed) return tokenizerState;
  try {
    const mod = await import('tiktoken');
    const typedMod = mod as unknown as {
      encoding_for_model?: (model: string) => { encode: (text: string) => { length: number } };
      get_encoding?: (name: string) => { encode: (text: string) => { length: number } };
    };
    const encodingForModel = typedMod.encoding_for_model;
    const getEncoding = typedMod.get_encoding;

    if (encodingForModel) {
      try {
        const enc = encodingForModel(MODEL_NAME);
        tokenizerState = { encode: enc.encode.bind(enc), label: MODEL_NAME };
        return tokenizerState;
      } catch {
        // fall through to fallback encoding
      }
    }

    if (getEncoding) {
      try {
        const enc = getEncoding(FALLBACK_ENCODING);
        tokenizerState = { encode: enc.encode.bind(enc), label: MODEL_NAME, note: `fallback ${FALLBACK_ENCODING}` };
        return tokenizerState;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
  tokenizerInitFailed = true;
  return null;
}

export async function getTokenCount(text: string): Promise<number | null> {
  const tokenizer = await getTokenizer();
  if (!tokenizer) return null;
  return tokenizer.encode(text).length;
}

export async function describeTokenCount(text: string): Promise<string | null> {
  const tokenizer = await getTokenizer();
  if (!tokenizer) return null;
  const count = tokenizer.encode(text).length;
  return tokenizer.note ? `${count} (${MODEL_NAME}, ${tokenizer.note})` : `${count} (${MODEL_NAME})`;
}
