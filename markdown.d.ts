import { Parser, Result } from './src/parser';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<HTMLElement, [
    MarkdownParser.BlockParser
  ]> {
}
export namespace MarkdownParser {
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
      BlockParser.NewlineParser,
      BlockParser.HorizontalRuleParser,
      BlockParser.HeadingParser,
      BlockParser.UListParser,
      BlockParser.OListParser,
      BlockParser.DListParser,
      BlockParser.TableParser,
      BlockParser.BlockquoteParser,
      BlockParser.PreTextParser,
      BlockParser.ExtensionParser,
      BlockParser.ParagraphParser
    ]> {
  }
  export namespace BlockParser {
    export interface NewlineParser extends
      Markdown<'newline'>,
      Parser<never, [
        never
      ]> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Markdown<'horizontalrule'>,
      Parser<HTMLHRElement, [
        never
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Markdown<'header'>,
      Parser<HTMLHeadingElement, [
        InlineParser
      ]> {
    }
    export interface UListParser extends
      // - item
      Markdown<'ulist'>,
      Parser<HTMLUListElement, [
        InlineParser
      ] | [
        UListParser,
        OListParser
      ]> {
    }
    export interface OListParser extends
      // 0. item
      Markdown<'olist'>,
      Parser<HTMLOListElement, [
        InlineParser
      ] | [
        UListParser,
        OListParser
      ]> {
    }
    export interface DListParser extends
      // ~ term
      // : description
      Markdown<'dlist'>,
      Parser<HTMLDListElement, [
        InlineParser
      ]> {
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Markdown<'table'>,
      Parser<HTMLTableElement, [
        InlineParser
      ]> {
    }
    export interface BlockquoteParser extends
      // > abc
      Markdown<'blockquote'>,
      Parser<HTMLQuoteElement, [
        BlockquoteParser,
        InlineParser.PlainTextParser
      ]> {
    }
    export interface PreTextParser extends
      // ```
      // abc
      // ```
      Markdown<'pretext'>,
      Parser<HTMLPreElement, [
        InlineParser.PlainTextParser
      ]> {
    }
    export interface ExtensionParser extends
      // ~~~
      // ABC
      // : abc
      // ~~~
      Markdown<'extension'>,
      Parser<HTMLElement, Parser<HTMLElement, any>[]> {
    }
    export interface ParagraphParser extends
      // abc
      Markdown<'paragraph'>,
      Parser<HTMLParagraphElement, [
        InlineParser
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.StrongParser,
      InlineParser.EmphasisParser,
      InlineParser.SuperScriptParser,
      InlineParser.SubScriptParser,
      InlineParser.CodeParser,
      InlineParser.ImageParser,
      InlineParser.LinkParser,
      InlineParser.AnnotationParser,
      InlineParser.HTMLParser,
      InlineParser.TextParser
    ]> {
  }
  export namespace InlineParser {
    export interface InsertionParser extends
      // ++abc++
      Markdown<'insertion'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Markdown<'deletion'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Markdown<'strong'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Markdown<'emphasis'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface SuperScriptParser extends
      // ^abc^
      Markdown<'superscript'>,
      Parser<HTMLElement, [
        TextParser
      ]> {
    }
    export interface SubScriptParser extends
      // ~abc~
      Markdown<'subscript'>,
      Parser<HTMLElement, [
        TextParser
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Markdown<'code'>,
      Parser<HTMLElement, [
        PlainTextParser
      ]> {
    }
    export interface ImageParser extends
      // ![abc](url)
      Markdown<'image'>,
      Parser<HTMLImageElement, [
        TextParser
      ]> {
    }
    export interface LinkParser extends
      // [abc](url)
      Markdown<'link'>,
      Parser<HTMLAnchorElement, [
        InlineParser
      ]> {
    }
    export interface AnnotationParser extends
      // ((abc))
      Markdown<'annotation'>,
      Parser<HTMLElement, [
        InlineParser
      ]> {
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Markdown<'html'>,
      Parser<HTMLElement, [
        InlineParser
      ] | [
        PlainTextParser
      ]> {
    }
    export interface TextParser extends
      // abc
      Markdown<'text'>,
      Parser<HTMLElement | Text, [
        never
      ]> {
    }
    export interface PlainTextParser extends
      // abc
      Markdown<'plaintext'>,
      Parser<Text, [
        never
      ]> {
    }
  }
}
