// src/utils/colors.ts

/**
 * ANSI color and control code mappings for BASIC-style tags
 */
export const ANSI_COLORS: Record<string, string> = {
    '{clear}': '\x1b[2J',  // Clear screen
    '{reset}': '\x1b[0m',  // Reset attributes
    '{black}': '\x1b[30m',
    '{white}': '\x1b[37m',
    '{red}': '\x1b[31m',
    '{cyan}': '\x1b[36m',
    '{purple}': '\x1b[35m',
    '{green}': '\x1b[32m',
    '{blue}': '\x1b[34m',
    '{yellow}': '\x1b[93m',
    '{orange}': '',
    '{brown}' : '',  
    '{pink}'  : '\x1b[91m',  
    '{gray1}' : '\x1b[90m',  
    '{gray2}' : '\x1b[90m',  
    '{ltgrn}' : '\x1b[92m',  
    '{ltblu}' : '\x1b[94m',  
    '{gray3}' : '\x1b[90m',  
    '{revson}': '',
    '{revsoff}': '',
    '{newline}': '\r\n',

  };
  
  /**
   * PETSCII color and control code mappings for BASIC-style tags
   * Using C64 PETSCII screen codes (0–63) via CHR$(code)
   */
  export const PETSCII_COLORS: Record<string, string> = {
    '{clear}' : '\x93',  
    '{reset}' : '\x92\x05', 
    '{black}' : '\x90',  
    '{white}' : '\x05', 
    '{red}'   : '\x1c',    
    '{cyan}'  : '\x9f',   
    '{purple}': '\x9c', 
    '{green}' : '\x1e',  
    '{blue}'  : '\x1f',   
    '{yellow}': '\x9e', 
    '{orange}': '\x81',  
    '{brown}' : '\x95',  
    '{pink}'  : '\x96',  
    '{gray1}' : '\x97',  
    '{gray2}' : '\x98',  
    '{ltgrn}' : '\x99',  
    '{ltblu}' : '\x9a',  
    '{gray3}' : '\x9b',  
    '{revson}': '\x12',
    '{revsoff}': '\x92',
    '{newline}': '\x0d',
};
  
  export function colorizeANSI(line: string): string {
    let result = line;
    for (const [tag, code] of Object.entries(ANSI_COLORS)) {
      result = result.split(tag).join(code);
    }
    // Ensure reset at end
    return result + ANSI_COLORS['{reset}'];
  }
  
  export function colorizePETSCII(line: string): string {
    let result = line;

    // Substitute tags for PETSCII codes
    for (const [tag, code] of Object.entries(PETSCII_COLORS)) {
      result = result.split(tag).join(code);
    }

    // Swap case to approximate PETSCII mapping
    result = result
      .split('')
      .map(ch => {
        if (ch >= 'a' && ch <= 'z') return ch.toUpperCase();
        if (ch >= 'A' && ch <= 'Z') return ch.toLowerCase();
        return ch;
      })
      .join('');
  
    // Wrap lines at 40 columns
    const width = 40;
    const lines: string[] = [];
    let start = 0;
    while (start < result.length) {
      lines.push(result.slice(start, start + width));
      start += width;
    }
    return lines.join('\x0d');
  }
  