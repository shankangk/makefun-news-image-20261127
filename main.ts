// news-image-20261127 entry: a newspaper front page summing up Friday, November 27, 2026.
// The poster (entry.png) was composed for this competition: three AI-generated editorial
// illustrations (an air-defence installation at dusk in Kuwait, a diplomatic
// summit hall, and New Zealand's parliament buildings in Wellington) with all text rendered in PIL, so no letter is ever
// AI-garbled. The program itself only copies that image to /output/entry.png,
// deterministically, with no network and no randomness.
// After copying it checks the output is byte-identical to the source (same size and
// SHA-256) and a valid 1024x1024 PNG, so a truncated or corrupt copy fails loudly instead of
// shipping a broken image. A size-only check could pass a same-length but corrupted
// copy; the hash cannot.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
if (!existsSync(src)) throw new Error('entry.png is missing next to main.ts');
mkdirSync(outDir, { recursive: true }); // the grader's /output may not exist yet
const out = join(outDir, 'entry.png');
copyFileSync(src, out);
const srcBuf = readFileSync(src);
const outBuf = readFileSync(out);
const sha256 = (b: Buffer) => createHash('sha256').update(b).digest('hex');
if (outBuf.length !== srcBuf.length) throw new Error(`entry.png copy is incomplete: output is ${outBuf.length} bytes, source is ${srcBuf.length}`);
if (sha256(outBuf) !== sha256(srcBuf)) throw new Error('entry.png copy is incomplete: SHA-256 mismatch with source');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!outBuf.subarray(0, 8).equals(pngSignature)) throw new Error('entry.png copy is not a valid PNG');
const width = outBuf.readUInt32BE(16);
const height = outBuf.readUInt32BE(20);
if (width !== 1024 || height !== 1024) throw new Error(`entry.png copy is not 1024x1024: got ${width}x${height}`);
