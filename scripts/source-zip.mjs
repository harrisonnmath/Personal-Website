import {readFile, readdir, stat, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {deflateRawSync} from 'node:zlib';

// Standard ZIP records keep source downloads portable without Python or packages.
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export async function writeSourceZip(paths, destination) {
  const entries = [];
  async function visit(path) {
    if ((await stat(path)).isDirectory()) {
      for (const name of (await readdir(path)).sort()) await visit(join(path, name));
    } else entries.push(path);
  }
  for (const path of paths) await visit(path);
  const records = [], directory = [];
  let offset = 0, directorySize = 0;
  for (const path of entries) {
    const bytes = await readFile(path), compressed = deflateRawSync(bytes);
    const name = Buffer.from('nicholas-harrison-website/' + path.replaceAll('\\', '/'));
    const crc = crc32(bytes);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x800, 6); // UTF-8 names
    local.writeUInt16LE(8, 8); // Deflate
    local.writeUInt16LE(33, 12); // 1980-01-01
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(bytes.length, 22);
    local.writeUInt16LE(name.length, 26);
    records.push(local, name, compressed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    local.copy(central, 6, 4, 30);
    central.writeUInt32LE(offset, 42);
    directory.push(central, name);
    directorySize += central.length + name.length;
    offset += local.length + name.length + compressed.length;
  }
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directorySize, 12);
  end.writeUInt32LE(offset, 16);
  await writeFile(destination, Buffer.concat([...records, ...directory, end]));
}
