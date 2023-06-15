import { Parser, Ctx } from './src/combinator/data/parser';
import { Dict } from 'spica/dict';

declare abstract class Markdown<T> {
  private parser?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, MarkdownParser.Context, [
    MarkdownParser.HeaderParser,
    MarkdownParser.BlockParser,
  ]> {
}
export namespace MarkdownParser {
  export interface Context extends Ctx {
    readonly host?: URL;
    readonly url?: URL;
    readonly id?: string;
    readonly header?: boolean;
    readonly caches?: {
      readonly code?: Dict<string, HTMLElement>;
      readonly math?: Dict<string, HTMLElement>;
      readonly media?: Dict<string, HTMLElement>;
    };
  }
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<string, Context, [
      BlockParser.HeadingParser.SegmentParser,
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.EmptyLineParser,
    ]> {
  }
  export interface HeaderParser extends
    // ---
    // url: https://host/path
    // ---
    Markdown<'header'>,
    Parser<HTMLElement | HTMLPreElement, Context, [
      Parser<HTMLElement | HTMLPreElement, Context, [
        Parser<HTMLElement, Context, [
          HeaderParser.FieldParser,
        ]>,
        Parser<HTMLPreElement, Context, []>,
      ]>,
      Parser<never, Context, []>,
    ]> {
  }
  export namespace HeaderParser {
    export interface FieldParser extends
      Markdown<'header/field'>,
      Parser<HTMLSpanElement, Context, []> {
    }
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, Context, [
      SourceParser.EmptyLineParser,
      BlockParser.PagebreakParser,
      BlockParser.HeadingParser,
      BlockParser.UListParser,
      BlockParser.OListParser,
      BlockParser.IListParser,
      BlockParser.DListParser,
      BlockParser.TableParser,
      BlockParser.CodeBlockParser,
      BlockParser.MathBlockParser,
      BlockParser.ExtensionParser,
      BlockParser.SidefenceParser,
      BlockParser.BlockquoteParser,
      BlockParser.MediaBlockParser,
      BlockParser.ReplyParser,
      BlockParser.ParagraphParser,
    ]> {
  }
  export namespace BlockParser {
    interface Block<T extends string> extends Markdown<`block/${T}`> { }
    export interface PagebreakParser extends
      // ===
      Block<'pagebreak'>,
      Parser<HTMLHRElement, Context, [
        SourceParser.StrParser,
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'heading'>,
      Parser<HTMLHeadingElement, Context, [
        Parser<HTMLElement | string, Context, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]>,
        Parser<HTMLElement | string, Context, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]>,
      ]> {
    }
    export namespace HeadingParser {
      export interface SegmentParser extends
        Block<'heading/segment'>,
        Parser<string, Context, []> {
      }
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, Context, [
        UListParser.ItemParser,
      ]> {
    }
    export namespace UListParser {
      export interface ItemParser extends
        Block<'ulist/item'>,
        Parser<HTMLLIElement, Context, [
          Parser<HTMLElement | string, Context, [
            InlineParser,
            Parser<HTMLElement | string, Context, [
              InlineParser.ExtensionParser.IndexerParser,
              InlineParser,
            ]>,
          ]>,
          Parser<HTMLUListElement | HTMLOListElement, Context, [
            UListParser,
            OListParser,
            IListParser,
          ]>,
        ]> {
      }
    }
    export interface OListParser extends
      // 0. item
      // 1-1. item
      // (a)-1 item
      Block<'olist'>,
      Parser<HTMLOListElement, Context, [
        OListParser.ListParser,
        OListParser.ListParser,
      ]> {
    }
    export namespace OListParser {
      export interface ListParser extends
        Block<'olist/list'>,
        Parser<HTMLOListElement, Context, [
          OListParser.ItemParser,
        ]> {
      }
      export interface ItemParser extends
        Block<'olist/item'>,
        Parser<HTMLLIElement, Context, [
          Parser<HTMLElement | string, Context, [
            InlineParser,
            Parser<HTMLElement | string, Context, [
              InlineParser.ExtensionParser.IndexerParser,
              InlineParser,
            ]>,
          ]>,
          Parser<HTMLUListElement | HTMLOListElement, Context, [
            UListParser,
            OListParser,
            IListParser,
          ]>,
        ]> {
      }
    }
    export interface IListParser extends
      // + item
      // * item
      Block<'ilist'>,
      Parser<HTMLUListElement, Context, [
        IListParser.ItemParser,
      ]> {
    }
    export namespace IListParser {
      export interface ItemParser extends
        Block<'ilist/item'>,
        Parser<HTMLLIElement, Context, [
          InlineParser,
          Parser<HTMLUListElement | HTMLOListElement, Context, [
            UListParser,
            OListParser,
            IListParser,
          ]>,
        ]> {
      }
    }
    export interface DListParser extends
      // ~ term
      // : description
      Block<'dlist'>,
      Parser<HTMLDListElement, Context, [
        DListParser.TermParser,
        DListParser.DescriptionParser,
      ]> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, Context, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, Context, [
          InlineParser,
        ]> {
      }
    }
    export interface SidefenceParser extends
      // | abc
      Block<'sidefence'>,
      Parser<HTMLQuoteElement, Context, [
        SidefenceParser.SourceParser,
      ]> {
    }
    export namespace SidefenceParser {
      export interface SourceParser extends
        Block<'sidefence/source'>,
        Parser<HTMLQuoteElement, Context, [
          SourceParser,
          AutolinkParser,
        ]> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, Context, [
        TableParser.RowParser<TableParser.CellParser.HeadParser>,
        TableParser.RowParser<TableParser.AlignParser>,
        TableParser.RowParser<TableParser.CellParser.DataParser>,
      ]> {
    }
    export namespace TableParser {
      export interface RowParser<P extends CellParser | AlignParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, Context, [
          P,
        ]> {
      }
      export interface AlignParser extends
        Block<'table/align'>,
        Parser<HTMLTableCellElement, Context, [
          SourceParser.StrParser,
          SourceParser.StrParser,
          SourceParser.StrParser,
          SourceParser.StrParser,
        ]> {
      }
      export type CellParser
        = CellParser.HeadParser
        | CellParser.DataParser;
      export namespace CellParser {
        export interface HeadParser extends
          Block<'table/cell/head'>,
          Parser<HTMLTableCellElement, Context, [
            InlineParser.LinkParser.MediaLinkParser,
            InlineParser.MediaParser,
            InlineParser.ShortMediaParser,
            InlineParser,
          ]> {
        }
        export interface DataParser extends
          Block<'table/cell/data'>,
          Parser<HTMLTableCellElement, Context, [
            InlineParser.LinkParser.MediaLinkParser,
            InlineParser.MediaParser,
            InlineParser.ShortMediaParser,
            InlineParser,
          ]> {
        }
      }
    }
    export interface CodeBlockParser extends
      // ```js index.js
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, Context, []> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, Context, []> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement | HTMLPreElement, Context, []> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, Context, []> {
      }
    }
    export interface ExtensionParser extends
      // ~~~abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, Context, [
        ExtensionParser.FigbaseParser,
        ExtensionParser.FigParser,
        ExtensionParser.FigureParser,
        ExtensionParser.TableParser,
        ExtensionParser.MessageParser,
        ExtensionParser.AsideParser,
        ExtensionParser.ExampleParser,
        ExtensionParser.PlaceholderParser,
      ]> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<never, Context, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          TableParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ]> {
      }
      export interface FigureParser extends
        // ~~~figure $group-name
        // !https://host/image.png
        //
        // caption
        // ~~~
        Block<'extension/figure'>,
        Parser<HTMLElement, Context, [
          Parser<HTMLElement | string, Context, [
            InlineParser.ExtensionParser.LabelParser,
            SourceParser.StrParser,
          ]>,
          Parser<HTMLElement | string, Context, [
            Parser<HTMLElement | string, Context, [
              UListParser,
              OListParser,
              BlockParser.TableParser,
              CodeBlockParser,
              MathBlockParser,
              ExampleParser,
              TableParser,
              BlockquoteParser,
              PlaceholderParser,
              InlineParser.MediaParser,
              InlineParser.ShortMediaParser,
            ]>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ]>,
        ]> {
      }
      export namespace FigureParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<never, Context, [
            SourceParser.ContentLineParser,
            Parser<never, Context, [
              Parser<never, Context, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                TableParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                PlaceholderParser.SegmentParser,
                SourceParser.ContentLineParser,
              ]>,
              SourceParser.EmptyLineParser,
              Parser<never, Context, [
                SourceParser.EmptyLineParser,
                SourceParser.ContentLineParser,
              ]>,
            ]>,
          ]> {
        }
      }
      export interface FigParser extends
        // $group-name
        // !https://host/image.png
        Block<'extension/fig'>,
        Parser<HTMLElement, Context, [
          FigureParser,
        ]> {
      }
      export namespace FigParser {
        export interface SegmentParser extends
          Block<'extension/fig/segment'>,
          Parser<never, Context, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, Context, [
              CodeBlockParser.SegmentParser,
              MathBlockParser.SegmentParser,
              TableParser.SegmentParser,
              BlockquoteParser.SegmentParser,
              PlaceholderParser.SegmentParser,
              SourceParser.ContentLineParser,
            ]>,
          ]> {
        }
      }
      export interface FigbaseParser extends
        // $group-name
        Block<'extension/figbase'>,
        Parser<HTMLElement, Context, [
          InlineParser.ExtensionParser.LabelParser,
        ]> {
      }
      export interface TableParser extends
        // ~~~table
        // -/-
        // # header
        // : data
        // ~~~
        Block<'extension/table'>,
        Parser<HTMLElement, Context, [
          TableParser.RowParser,
        ]> {
      }
      export namespace TableParser {
        export interface SegmentParser extends
          Block<'extension/table/segment'>,
          Parser<never, Context, []> {
        }
        export interface RowParser extends
          Block<'extension/table/row'>,
          Parser<[[string[], string[]?], ...HTMLTableCellElement[]], Context, [
            Parser<[string[], string[]?], Context, [
              AlignParser,
            ]>,
            Parser<HTMLTableCellElement, Context, [
              CellParser.HeadParser,
              CellParser.DataParser,
              CellParser.DatalineParser,
              SourceParser.EmptyLineParser,
            ]>,
          ]> {
        }
        export interface AlignParser extends
          Block<'extension/table/align'>,
          Parser<string[], Context, [
            SourceParser.StrParser,
          ]> {
        }
        export namespace CellParser {
          export interface HeadParser extends
            Block<'extension/table/cell/head'>,
            Parser<HTMLTableCellElement, Context, [
              InlineParser.LinkParser.MediaLinkParser,
              InlineParser.MediaParser,
              InlineParser.ShortMediaParser,
              InlineParser,
            ]> {
          }
          export interface DataParser extends
            Block<'extension/table/cell/data'>,
            Parser<HTMLTableCellElement, Context, [
              InlineParser.LinkParser.MediaLinkParser,
              InlineParser.MediaParser,
              InlineParser.ShortMediaParser,
              InlineParser,
            ]> {
          }
          export interface DatalineParser extends
            Block<'extension/table/cell/dataline'>,
            Parser<HTMLTableCellElement, Context, [
              DataParser,
              DataParser,
            ]> {
          }
        }
      }
      export interface MessageParser extends
        // ~~~message/note
        // Message
        // ~~~
        Block<'extension/message'>,
        Parser<HTMLElement, Context, [
          MessageParser.ContentParser,
        ]> {
      }
      export namespace MessageParser {
        export interface ContentParser extends
          Block<'extension/message/content'>,
          Parser<HTMLElement, Context, [
            SourceParser.EmptyLineParser,
            BlockParser.UListParser,
            BlockParser.OListParser,
            BlockParser.IListParser,
            BlockParser.TableParser,
            BlockParser.CodeBlockParser,
            BlockParser.MathBlockParser,
            BlockParser.SidefenceParser,
            BlockParser.BlockquoteParser,
            BlockParser.MediaBlockParser,
            BlockParser.ParagraphParser,
          ]> {
        }
      }
      export interface AsideParser extends
        // ~~~aside
        // ## title
        // ~~~
        Block<'extension/aside'>,
        Parser<HTMLElement, Context, [
          MarkdownParser,
        ]> {
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Context, [
          MarkdownParser,
        ]> {
      }
      export interface PlaceholderParser extends
        // ~~~abc
        // ~~~
        Block<'extension/placeholder'>,
        Parser<HTMLElement, Context, []> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, Context, []> {
        }
      }
    }
    export interface BlockquoteParser extends
      // > abc
      // !> *abc*
      Block<'blockquote'>,
      Parser<HTMLQuoteElement, Context, [
        BlockquoteParser.SourceParser,
        BlockquoteParser.MarkdownParser,
      ]> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, Context, [
          SourceParser.ContentLineParser,
        ]> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, Context, [
          SourceParser,
          AutolinkParser,
        ]> {
      }
      export interface MarkdownParser extends
        Block<'blockquote/markdown'>,
        Parser<HTMLQuoteElement, Context, [
          MarkdownParser,
          Parser<HTMLElement, Context, []>,
        ]> {
      }
    }
    export interface MediaBlockParser extends
      // abc
      Block<'mediablock'>,
      Parser<HTMLDivElement, Context, [
        Parser<HTMLElement, Context, [
          InlineParser.LinkParser.MediaLinkParser,
          InlineParser.MediaParser,
          InlineParser.ShortMediaParser,
        ]>,
        Parser<HTMLElement, Context, [
          InlineParser.LinkParser.MediaLinkParser,
          InlineParser.MediaParser,
          InlineParser.ShortMediaParser,
        ]>,
      ]> {
    }
    export interface ReplyParser extends
      // >>1
      // > text
      // abc
      Block<'reply'>,
      Parser<HTMLParagraphElement, Context, [
        Parser<HTMLElement, Context, [
          ReplyParser.CiteParser,
          ReplyParser.QuoteParser,
        ]>,
        Parser<HTMLElement | string, Context, [
          ReplyParser.QuoteParser,
          InlineParser,
        ]>,
      ]> {
    }
    export namespace ReplyParser {
      export interface CiteParser extends
        Block<'reply/cite'>,
        Parser<HTMLSpanElement | HTMLBRElement, Context, [
          SourceParser.StrParser,
          Parser<HTMLAnchorElement, Context, [
            InlineParser.AutolinkParser.AnchorParser,
            Parser<HTMLAnchorElement, Context, []>,
            Parser<HTMLAnchorElement, Context, []>,
            Parser<HTMLAnchorElement, Context, []>,
          ]>,
        ]> {
      }
      export interface QuoteParser extends
        Block<'reply/quote'>,
        Parser<HTMLSpanElement | HTMLBRElement, Context, [
          QuoteParser.BlockParser,
          QuoteParser.PlaceholderParser,
        ]> {
      }
      export namespace QuoteParser {
        export interface BlockParser extends
          Block<'reply/quote/block'>,
          Parser<string | HTMLElement, Context, [
            InlineParser.MathParser,
            InlineParser.AutolinkParser,
            SourceParser.LinebreakParser,
            SourceParser.UnescapableSourceParser,
          ]> {
        }
        export interface PlaceholderParser extends
          Block<'reply/quote/placeholder'>,
          Parser<string | HTMLElement, Context, [
            SourceParser.StrParser,
          ]> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, Context, [
        InlineParser,
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | string, Context, [
      InlineParser.AnnotationParser,
      InlineParser.ReferenceParser,
      InlineParser.TemplateParser,
      InlineParser.RemarkParser,
      InlineParser.ExtensionParser,
      InlineParser.RubyParser,
      InlineParser.LinkParser.TextLinkParser,
      InlineParser.HTMLParser,
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.MarkParser,
      InlineParser.EmStrongParser,
      InlineParser.StrongParser,
      InlineParser.EmphasisParser,
      InlineParser.MathParser,
      InlineParser.CodeParser,
      InlineParser.HTMLEntityParser,
      InlineParser.AutolinkParser,
      InlineParser.BracketParser,
      SourceParser.TextParser,
    ]> {
  }
  export namespace InlineParser {
    interface Inline<T extends string> extends Markdown<`inline/${T}`> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, Context, [
        InlineParser,
      ]> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      // [[^Abbr]]
      // [[^Abbr| abc]]
      Inline<'reference'>,
      Parser<HTMLElement, Context, [
        ReferenceParser.AbbrParser,
        InlineParser,
      ]> {
    }
    export namespace ReferenceParser {
      export interface AbbrParser extends
        // ^X 2020, 1-2
        // ^X. Y., and Z et al. 2020, 1-2
        Inline<'reference/abbr'>,
        Parser<string, Context, [
          SourceParser.StrParser,
        ]> {
      }
    }
    export interface TemplateParser extends
      // {{abc}}
      Inline<'template'>,
      Parser<HTMLSpanElement, Context, [
        TemplateParser.BracketParser,
        SourceParser.EscapableSourceParser,
      ]> {
    }
    export namespace TemplateParser {
      export interface BracketParser extends
        Inline<'template/bracket'>,
        Parser<string, Context, [
          Parser<string, Context, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ]>,
          Parser<string, Context, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ]>,
          Parser<string, Context, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ]>,
          SourceParser.EscapableSourceParser,
        ]> {
      }
    }
    export interface RemarkParser extends
      // [% remark %]
      Inline<'remark'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
      ]> {
    }
    export interface ExtensionParser extends
      Inline<'extension'>,
      Parser<HTMLElement | string, Context, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.PlaceholderParser,
      ]> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        // [#index|signature]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, Context, [
          InlineParser,
          IndexParser.SignatureParser,
        ]> {
      }
      export namespace IndexParser {
        export interface SignatureParser extends
          Inline<'extension/index/signature'>,
          Parser<HTMLElement, Context, [
            SignatureParser.BracketParser,
            SourceParser.TxtParser,
          ]> {
        }
        export namespace SignatureParser {
          export interface BracketParser extends
            Inline<'extension/index/signature/bracket'>,
            Parser<string, Context, [
              Parser<string, Context, [
                BracketParser,
                SourceParser.TxtParser,
              ]>,
              Parser<string, Context, [
                BracketParser,
                SourceParser.TxtParser,
              ]>,
              Parser<string, Context, [
                BracketParser,
                SourceParser.TxtParser,
              ]>,
              SourceParser.TxtParser,
            ]> {
          }
        }
      }
      export interface IndexerParser extends
        // [|signature]
        // [|]
        Inline<'extension/indexer'>,
        Parser<HTMLElement, Context, [
          IndexParser.SignatureParser,
          Parser<HTMLSpanElement, Context, []>,
        ]> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, Context, [
          SourceParser.StrParser,
          SourceParser.StrParser,
        ]> {
      }
      export namespace LabelParser {
        export interface SegmentParser extends
          Inline<'extension/label/segment'>,
          Parser<never, Context, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ]> {
        }
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLElement | string, Context, [
          InlineParser,
        ]> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, Context, [
        SourceParser.StrParser,
        SourceParser.StrParser,
      ]> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<string[], Context, []> {
      }
    }
    export interface LinkParser extends
      // { uri }
      // [abc]{uri nofollow}
      Inline<'link'>,
      Parser<HTMLAnchorElement, Context, [
        LinkParser.MediaLinkParser,
        LinkParser.TextLinkParser,
      ]> {
    }
    export namespace LinkParser {
      export interface LineMediaLinkParser extends
        Inline<'link/linemedialink'>,
        Parser<HTMLElement, Context, [
          LinkParser.MediaLinkParser,
        ]> {
      }
      export interface TextLinkParser extends
        Inline<'link/textlink'>,
        Parser<HTMLAnchorElement, Context, [
          Parser<(HTMLElement | string)[], Context, [
            InlineParser,
          ]>,
          LinkParser.ParameterParser,
        ]> {
      }
      export interface MediaLinkParser extends
        Inline<'link/medialink'>,
        Parser<HTMLAnchorElement, Context, [
          Parser<HTMLElement[], Context, [
            MediaParser,
            ShortMediaParser,
          ]>,
          LinkParser.ParameterParser,
        ]> {
      }
      export interface UnsafeLinkParser extends
        Inline<'link/unsafelink'>,
        Parser<HTMLAnchorElement, Context, [
          LinkParser.TextParser,
          LinkParser.ParameterParser,
        ]> {
      }
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<(HTMLElement | string)[], Context, [
          MediaParser,
          ShortMediaParser,
          InlineParser,
        ]> {
      }
      export interface TextParser extends
        Inline<'link/text'>,
        Parser<string[], Context, [
          SourceParser.UnescapableSourceParser,
        ]> {
      }
      export interface ParameterParser extends
        Inline<'link/parameter'>,
        Parser<string[], Context, [
          LinkParser.ParameterParser.UriParser,
          LinkParser.ParameterParser.OptionParser,
        ]> {
      }
      export namespace ParameterParser {
        export interface UriParser extends
          Inline<'link/parameter/uri'>,
          Parser<string, Context, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ]> {
        }
        export interface OptionParser extends
          Inline<'link/parameter/option'>,
          Parser<string, Context, [
            SourceParser.StrParser,
            SourceParser.StrParser,
            SourceParser.StrParser,
          ]> {
        }
      }
    }
    export interface MediaParser extends
      // !{ uri }
      // ![abc]{uri nofollow}
      Inline<'media'>,
      Parser<HTMLElement, Context, [
        MediaParser.TextParser,
        MediaParser.ParameterParser,
      ]> {
    }
    export namespace MediaParser {
      export interface LineMediaParser extends
        Inline<'media/linemedia'>,
        Parser<HTMLElement, Context, [
          MediaParser,
        ]> {
      }
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<string[], Context, [
          UnsafeHTMLEntityParser,
          TextParser.BracketParser,
          SourceParser.TxtParser,
        ]> {
      }
      export namespace TextParser {
        export interface BracketParser extends
          Inline<'media/text/bracket'>,
          Parser<string, Context, [
            Parser<string, Context, [
              UnsafeHTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Context, [
              UnsafeHTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Context, [
              UnsafeHTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Context, [
              UnsafeHTMLEntityParser,
              SourceParser.TxtParser,
            ]>,
          ]> {
        }
      }
      export interface ParameterParser extends
        Inline<'media/parameter'>,
        Parser<string[], Context, [
          LinkParser.ParameterParser.UriParser,
          ParameterParser.OptionParser,
        ]> {
      }
      export namespace ParameterParser {
        export interface OptionParser extends
          Inline<'media/parameter/option'>,
          Parser<string, Context, [
            SourceParser.StrParser,
            SourceParser.StrParser,
            LinkParser.ParameterParser.OptionParser,
          ]> {
        }
      }
    }
    export interface HTMLParser extends
      // Allow: wbr, bdo, bdi
      // <bdi>abc</bdi>
      Inline<'html'>,
      Parser<HTMLElement | string, Context, [
        HTMLParser.VoidTagParser,
        HTMLParser.VoidTagParser,
        HTMLParser.TagParser,
        HTMLParser.TagParser,
      ]> {
    }
    export namespace HTMLParser {
      export interface VoidTagParser extends
        Inline<'html/voidtag'>,
        Parser<HTMLElement | string, Context, [
          AttributeParser,
        ]> {
      }
      export interface TagParser extends
        Inline<'html/tag'>,
        Parser<HTMLElement | string, Context, [
          InlineParser,
          InlineParser,
        ]> {
      }
      export interface AttributeParser extends
        Inline<'html/attribute'>,
        Parser<string, Context, [
          SourceParser.StrParser,
        ]> {
      }
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
        InlineParser,
      ]> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
        InlineParser,
      ]> {
    }
    export interface MarkParser extends
      // ==abc==
      Inline<'mark'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
        MarkParser,
      ]> {
    }
    export interface EmStrongParser extends
      // ***abc***
      Inline<'emstrong'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
        InlineParser,
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
        Parser<HTMLElement | string, Context, [
          EmStrongParser,
          StrongParser,
        ]>,
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement | string, Context, [
        StrongParser,
        InlineParser,
        Parser<HTMLElement | string, Context, [
          EmStrongParser,
          StrongParser,
          EmphasisParser,
        ]>,
      ]> {
    }
    export interface MathParser extends
      // $expr$
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLElement, Context, [
        MathParser.BracketParser,
        Parser<string, Context, [
          MathParser.BracketParser,
          SourceParser.UnescapableSourceParser,
        ]>,
      ]> {
    }
    export namespace MathParser {
      export interface BracketParser extends
        Inline<'math/bracket'>,
        Parser<HTMLElement, Context, [
          BracketParser,
          SourceParser.EscapableSourceParser,
        ]> {
      }
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | string, Context, [
        SourceParser.StrParser,
      ]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<string | HTMLSpanElement, Context, [
        UnsafeHTMLEntityParser,
      ]> {
    }
    export interface UnsafeHTMLEntityParser extends
      // &copy;
      Inline<'unsafehtmlentity'>,
      Parser<string, Context, []> {
    }
    export interface ShortMediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, Context, [
        MediaParser,
      ]> {
    }
    export namespace ShortMediaParser {
      export interface LineShortMediaParser extends
        Inline<'shortmedia/lineshortmedia'>,
        Parser<HTMLElement, Context, [
          MediaParser,
        ]> {
      }
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLElement | string, Context, [
        Parser<HTMLElement | string, Context, [
          AutolinkParser.UrlParser.LineUrlParser,
        ]>,
        Parser<HTMLElement | string, Context, [
          AutolinkParser.UrlParser,
          AutolinkParser.EmailParser,
          SourceParser.StrParser,
          AutolinkParser.ChannelParser,
          AutolinkParser.AccountParser,
          SourceParser.StrParser,
          SourceParser.StrParser,
          AutolinkParser.HashtagParser,
          AutolinkParser.HashnumParser,
          SourceParser.StrParser,
          SourceParser.StrParser,
          AutolinkParser.AnchorParser,
        ]>,
      ]> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Inline<'url'>,
        Parser<HTMLAnchorElement, Context, [
          LinkParser.UnsafeLinkParser,
        ]> {
      }
      export namespace UrlParser {
        export interface LineUrlParser extends
          Inline<'url/lineurl'>,
          Parser<string | HTMLElement, Context, [
            SourceParser.StrParser,
            InlineParser.LinkParser.UnsafeLinkParser,
          ]> {
        }
        export interface BracketParser extends
          Inline<'url/bracket'>,
          Parser<string, Context, [
            Parser<string, Context, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ]>,
            Parser<string, Context, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ]>,
            Parser<string, Context, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ]>,
            SourceParser.UnescapableSourceParser,
          ]> {
        }
      }
      export interface EmailParser extends
        // user@host
        Inline<'email'>,
        Parser<HTMLAnchorElement, Context, [
          SourceParser.StrParser,
        ]> {
      }
      export interface ChannelParser extends
        // @user#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, Context, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ]> {
      }
      export interface AccountParser extends
        // @user
        Inline<'account'>,
        Parser<HTMLAnchorElement, Context, [
          LinkParser.UnsafeLinkParser,
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, Context, [
          LinkParser.UnsafeLinkParser,
        ]> {
      }
      export interface HashnumParser extends
        // #1
        Inline<'hashnum'>,
        Parser<HTMLAnchorElement, Context, [
          LinkParser.UnsafeLinkParser,
        ]> {
      }
      export interface AnchorParser extends
        // >>1
        Inline<'anchor'>,
        Parser<HTMLAnchorElement, Context, [
          LinkParser.UnsafeLinkParser,
        ]> {
      }
    }
    export interface BracketParser extends
      // ()
      // []
      // {}
      // ""
      Inline<'bracket'>,
      Parser<HTMLElement | string, Context, [
        SourceParser.StrParser,
        InlineParser,
        SourceParser.StrParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
      ]> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<string | HTMLElement, Context, [
      InlineParser.AutolinkParser,
      SourceParser.LinebreakParser,
      SourceParser.UnescapableSourceParser,
    ]> {
  }
  export namespace SourceParser {
    interface Source<T extends string> extends Markdown<`source/${T}`> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<string | HTMLBRElement | HTMLSpanElement, Context, []> {
    }
    export interface TxtParser extends
      // abc
      Source<'txt'>,
      Parser<string, Context, [
        TextParser,
      ]> {
    }
    export interface LinebreakParser extends
      // \n
      Source<'linebreak'>,
      Parser<HTMLBRElement, Context, [
        TextParser,
      ]> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<string, Context, []> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<string, Context, []> {
    }
    export interface StrParser extends
      Source<'str'>,
      Parser<string, Context, []> {
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, Context, []> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, Context, []> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, Context, []> {
    }
  }
}
