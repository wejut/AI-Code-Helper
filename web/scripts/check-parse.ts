import { createSseParser } from '../src/lib/parseSse.ts'
import assert from 'node:assert/strict'

function collect(chunks: string[]): string[] {
  const parser = createSseParser()
  const pieces: string[] = []
  for (const chunk of chunks) pieces.push(...parser.push(chunk))
  pieces.push(...parser.flush())
  return pieces
}

const cases: Array<{ name: string; chunks: string[]; expect: string[] }> = [
  {
    name: 'simple tokens',
    chunks: ['data:Hello\n\n', 'data: world\n\n'],
    expect: ['Hello', ' world'],
  },
  {
    name: 'split across chunks',
    chunks: ['data:Hel', 'lo\n\ndata: ', 'Java\n\n'],
    expect: ['Hello', ' Java'],
  },
  {
    name: 'multiline data',
    chunks: ['data:line1\ndata:line2\n\n'],
    expect: ['line1\nline2'],
  },
  {
    name: 'crlf frames',
    chunks: ['data:a\r\n\r\ndata:b\r\n\r\n'],
    expect: ['a', 'b'],
  },
  {
    name: 'leading space kept',
    chunks: ['data: public\n\n', 'data: static\n\n'],
    expect: [' public', ' static'],
  },
  {
    name: 'spring event json',
    chunks: ['data:{"id":null,"event":null,"data":"hi"}\n\n'],
    expect: ['hi'],
  },
  {
    name: 'comment ignored',
    chunks: [':ping\n\n', 'data:ok\n\n'],
    expect: ['ok'],
  },
  {
    name: 'flush without terminator',
    chunks: ['data:tail'],
    expect: ['tail'],
  },
  {
    name: 'newline token',
    chunks: ['data:\ndata:\n\n'],
    expect: ['\n'],
  },
  {
    name: 'separator split across reads',
    chunks: ['data:foo\n', '\n'],
    expect: ['foo'],
  },
]

for (const item of cases) {
  assert.deepEqual(collect(item.chunks), item.expect, item.name)
  console.log('ok', item.name)
}
