// src/utils/comm.ts
import { Socket } from 'net'
import { colorizeANSI, colorizePETSCII } from './colors'

export enum Mode {
  ANSI = 'ANSI',
  PETSCII = 'PETSCII'
}

/**
 * Comm handles raw-character I/O negotiation and wraps/colorizes output.
 * It provides writeLine() for full lines and write() for inline prompts,
 * plus getChar() for single-character reads and question() for line reads.
 */
export class Comm {
  public mode: Mode = Mode.ANSI
  private readonly socket: Socket
  private newline: string = '\r\n' // Default to ANSI newline;

  constructor (socket: Socket) {
    this.socket = socket
  }

  /**
   * Negotiate ANSI vs PETSCII on new raw-char connection.
   */
  async init (): Promise<void> {
    this.writeLine('DopeWars v4.20')
    this.writeLine(
      'Press Delete (0x08) for PETSCII/40-col, any other key for ANSI/80-col.'
    )

    // Wait for a single raw character
    const ch = await this.getChar(false, false)
    if (ch.charCodeAt(0) === 0x14) {
      this.mode = Mode.PETSCII
      this.writeLine('Using PETSCII mode')
    } else {
      this.mode = Mode.ANSI
      this.writeLine('Using ANSI mode')
    }
    this.newline = this.mode === Mode.PETSCII ? '\x0d' : '\r\n' // PETSCII newline
  }
  // draw a 40 or 80 column divider depending on mode
  drawDivider (): void {
    const divider = this.mode === Mode.PETSCII ? '\xc0'.repeat(40) : '─'.repeat(80)
    this.write(divider)
  }
  /**
   * Write a full line (CRLF-ending), wrapping and colorizing as per mode.
   */
  writeLine (text: string): void {
    const maxWidth = this.mode === Mode.PETSCII ? 40 : 80
    const segments = this.wrap(text, maxWidth)
    for (const seg of segments) {
      const out =
        this.mode === Mode.PETSCII ? colorizePETSCII(seg) : colorizeANSI(seg)
      this.socketWriteLine(out)
    }
  }
  crlf (): void {
    this.socketWriteLine('')
  }

  /**
   * Write inline text (no CRLF), wrapping and colorizing as needed.
   */
  write (text: string): void {
    const maxWidth = this.mode === Mode.PETSCII ? 40 : 80
    const segments = this.wrap(text, maxWidth)
    for (const seg of segments) {
      const out =
        this.mode === Mode.PETSCII ? colorizePETSCII(seg) : colorizeANSI(seg)
      this.socketWrite(out)
    }
  }

  writeRaw (text: string): void {
    this.socketWrite(text)
  }

  async question (query: string): Promise<string> {
    this.write(query)
    return this.input('')
  }

  private wrap(text: string, width: number): string[] {
    if (!text) return [];
  
    const tagRegex = /{[^}]+}/g;
    const segments = text.split('{newline}');
    const allLines: string[] = [];
  
    for (const segment of segments) {
      const matches = [...segment.matchAll(/\S+\s*/g)];
      let current = '';
      let visibleLength = 0;
  
      for (const match of matches) {
        const word = match[0]; // includes trailing spaces
        const visibleWord = word.replace(tagRegex, '');
        const proposed = current + word;
        const proposedLength = visibleLength + visibleWord.length;
  
        if (proposedLength > width && current.trim()) {
          allLines.push(current.trimEnd());
          current = word.replace(/^\s+/, ''); // trim leading space on new line
          visibleLength = visibleWord.length - (word.length - word.trimStart().length);
        } else {
          current = proposed;
          visibleLength = proposedLength;
        }
      }
  
      if (current.trim()) {
        allLines.push(current.trimEnd());
      }
  
      if (segment !== segments[segments.length - 1]) {
        allLines.push('');
      }
    }
  
    return allLines;
  }
  
  
  
  socketWriteLine (line: string): void {
    const fullLine = line + this.newline
    const buf = Buffer.from(fullLine, 'binary')
    console.log(
      '→ sending bytes:',
      buf
        .toJSON()
        .data.map(b => b.toString(16).padStart(2, '0'))
        .join(' ')
    )
    this.socket.write(buf)
  }

  async pause(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  socketWrite (text: string): void {
    const buf = Buffer.from(text, 'binary')
    // console.log(
    //   '→ sending bytes:',
    //   buf
    //     .toJSON()
    //     .data.map(b => b.toString(16).padStart(2, '0'))
    //     .join(' ')
    //)
    this.socket.write(buf)
  }
  /**
   * Display a "Press Any Key" message and wait for key press.
   */
  async getAnyKey (): Promise<void> {
    this.writeLine(' ')
    this.writeLine('{white}       Press Any Key To Continue')
    await this.getChar(false, false) // wait for a single char
  }

  close (): void {
    this.socket.end()
  }
  async input (query: string): Promise<string> {
    if (query) this.writeRaw(query)

    let buffer = ''
    while (true) {
      const ch = await this.getChar(true, true)
      const byte = ch.charCodeAt(0)
      //console.log('→ received byte:', byte.toString(16).padStart(2, '0'))

      // Handle newline
      if (ch === '\r' || ch === '\n' || ch === '\x13') {
        break
      }

      buffer += ch
    }
    return buffer
  }

  async getChar (echo: boolean, convert: boolean): Promise<string> {
    return new Promise(resolve => {
      const onData = (data: Buffer) => {
        this.socket.removeListener('data', onData)
        let byte = data[0]
        if (echo) {
          this.writeRaw(String.fromCharCode(byte))
        }
        if (convert) {
          // if (this.mode === Mode.PETSCII) {
          //     // PETSCII alphabetic range inversion
          //     if (byte >= 0xC1 && byte <= 0xDA) {
          //         byte -= 0x80;
          //     } else if (byte >= 0x41 && byte <= 0x5A) {
          //         byte += 0x80;
          //     }
          // }
        }

        const ch = String.fromCharCode(byte)
        resolve(ch)
      }

      this.socket.on('data', onData)
    })
  }
}
