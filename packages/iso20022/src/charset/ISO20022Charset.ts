// Author: Monica Zhu (CoCa Foundation / UW2ICG Chair)
// SPDX-License-Identifier: Apache-2.0

import { ISO20022_CHARSET, ISO20022_LATIN_CHARSET } from '../types';

/**
 * ISO 20022 Character Set Validator and Converter
 * Compliant with ISO 20022: UTF-8 encoding, multi-language support
 */
export class ISO20022Charset {
  /**
   * Validate string contains only ISO 20022 allowed characters
   * Standard requires Latin character set support with UTF-8 encoding
   */
  static validateCharset(text: string): {
    valid: boolean;
    invalidChars: string[];
    suggestions: string[];
  } {
    const invalidChars: string[] = [];
    const suggestions: string[] = [];

    for (const char of text) {
      if (!ISO20022_LATIN_CHARSET.includes(char) && !this.isExtendedChar(char)) {
        invalidChars.push(char);
        suggestions.push(this.suggestReplacement(char));
      }
    }

    return {
      valid: invalidChars.length === 0,
      invalidChars,
      suggestions
    };
  }

  /**
   * Check for extended characters (UTF-8 support)
   */
  private static isExtendedChar(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 0x00C0 && code <= 0x00FF) ||
           (code >= 0x2013 && code <= 0x2014) ||
           (code >= 0x4E00 && code <= 0x9FFF);
  }

  /**
   * Suggest replacement characters
   */
  private static suggestReplacement(char: string): string {
    const replacements: Record<string, string> = {
      '“': '"',
      '”': '"',
      '‘': "'",
      '’': "'",
      '–': '-',
      '—': '-',
      '…': '...',
      '™': '(TM)',
      '®': '(R)',
      '©': '(C)'
    };
    return replacements[char] || `[${char}]`;
  }

  /**
   * Sanitize string (remove invalid characters or replace with suggestions)
   */
  static sanitize(text: string): string {
    const result = this.validateCharset(text);
    if (result.valid) return text;

    let sanitized = text;
    for (let i = 0; i < result.invalidChars.length; i++) {
      sanitized = sanitized.replace(result.invalidChars[i], result.suggestions[i]);
    }
    return sanitized;
  }

  /**
   * Validate JMBC extension field character set
   */
  static validateJmbcExtension(extension: Record<string, any>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const fields = ['jmbcTxId', 'utxoDomain', 'jmbcChain', 'settlementAsset'];

    for (const field of fields) {
      if (extension[field]) {
        const result = this.validateCharset(String(extension[field]));
        if (!result.valid) {
          errors.push(`Field '${field}' contains invalid characters: ${result.invalidChars.join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get character set information
   */
  static getCharsetInfo(): {
    name: string;
    encoding: string;
    latinCharset: string;
    extendedSupported: boolean;
  } {
    return {
      name: 'ISO 20022 Character Set',
      encoding: ISO20022_CHARSET,
      latinCharset: ISO20022_LATIN_CHARSET,
      extendedSupported: true
    };
  }
}
