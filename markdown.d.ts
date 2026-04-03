import { Parser, List, Node } from './src/combinator/parser';
import { Input } from './src/parser/context';

declare abstract class Markdown<T> {
  private parser?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, Input, [
    MarkdownParser.HeaderParser,
    MarkdownParser.BlockParser,
  ]> {
}
export namespace MarkdownParser {
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<string, Input, [
      SourceParser.EmptySegmentParser,
      Parser<string, Input, [
        BlockParser.HeadingParser.SegmentParser,
        BlockParser.CodeBlockParser.SegmentParser,
        BlockParser.MathBlockParser.SegmentParser,
        BlockParser.ExtensionParser.SegmentParser,
      ]>,
      SourceParser.ContentLineParser,
    ]> {
  }
  export interface HeaderParser extends
    // ---
    // url: https://host/path
    // ---
    Markdown<'header'>,
    Parser<HTMLElement | HTMLPreElement, Input, [
      Parser<HTMLElement | HTMLPreElement, Input, [
        Parser<HTMLElement, Input, [
          HeaderParser.FieldParser,
        ]>,
        Parser<HTMLPreElement, Input, []>,
      ]>,
      Parser<never, Input, []>,
    ]> {
  }
  export namespace HeaderParser {
    export interface FieldParser extends
      Markdown<'header/field'>,
      Parser<HTMLSpanElement, Input, []> {
    }
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, Input, [
      SourceParser.EmptySegmentParser,
      Parser<HTMLElement, Input, [
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
      ]>,
      BlockParser.ParagraphParser,
    ]> {
  }
  export namespace BlockParser {
    interface Block<T extends string> extends Markdown<`block/${T}`> { }
    export interface PagebreakParser extends
      // ===
      Block<'pagebreak'>,
      Parser<HTMLElement, Input, [
        SourceParser.StrParser,
      ]> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'heading'>,
      Parser<HTMLElement, Input, [
        Parser<HTMLElement | string, Input, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]>,
        Parser<HTMLElement | string, Input, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]>,
      ]> {
    }
    export namespace HeadingParser {
      export interface SegmentParser extends
        Block<'heading/segment'>,
        Parser<string, Input, []> {
      }
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLElement, Input, [
        UListParser.ItemParser,
      ]> {
    }
    export namespace UListParser {
      export interface ItemParser extends
        Block<'ulist/item'>,
        Parser<HTMLLIElement, Input, [
          Parser<HTMLElement | string, Input, [
            InlineParser,
            Parser<HTMLElement | string, Input, [
              InlineParser.ExtensionParser.IndexerParser,
              InlineParser,
            ]>,
          ]>,
          Parser<HTMLUListElement | HTMLOListElement, Input, [
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
      Parser<HTMLElement, Input, [
        OListParser.ListParser,
        OListParser.ListParser,
      ]> {
    }
    export namespace OListParser {
      export interface ListParser extends
        Block<'olist/list'>,
        Parser<HTMLOListElement, Input, [
          OListParser.ItemParser,
        ]> {
      }
      export interface ItemParser extends
        Block<'olist/item'>,
        Parser<HTMLLIElement, Input, [
          Parser<HTMLElement | string, Input, [
            InlineParser,
            Parser<HTMLElement | string, Input, [
              InlineParser.ExtensionParser.IndexerParser,
              InlineParser,
            ]>,
          ]>,
          Parser<HTMLUListElement | HTMLOListElement, Input, [
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
      Parser<HTMLElement, Input, [
        IListParser.ItemParser,
      ]> {
    }
    export namespace IListParser {
      export interface ItemParser extends
        Block<'ilist/item'>,
        Parser<HTMLLIElement, Input, [
          InlineParser,
          Parser<HTMLUListElement | HTMLOListElement, Input, [
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
      Parser<HTMLElement, Input, [
        DListParser.TermParser,
        DListParser.DescriptionParser,
      ]> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, Input, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ]> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, Input, [
          InlineParser,
        ]> {
      }
    }
    export interface SidefenceParser extends
      // | abc
      Block<'sidefence'>,
      Parser<HTMLElement, Input, [
        SidefenceParser.SourceParser,
      ]> {
    }
    export namespace SidefenceParser {
      export interface SourceParser extends
        Block<'sidefence/source'>,
        Parser<HTMLQuoteElement, Input, [
          SourceParser,
          AutolinkParser,
          Parser<HTMLElement, Input, []>,
        ]> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLElement, Input, [
        TableParser.RowParser<TableParser.CellParser.HeadParser>,
        TableParser.RowParser<TableParser.AlignParser>,
        TableParser.RowParser<TableParser.CellParser.DataParser>,
      ]> {
    }
    export namespace TableParser {
      export interface RowParser<P extends CellParser | AlignParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, Input, [
          P,
        ]> {
      }
      export interface AlignParser extends
        Block<'table/align'>,
        Parser<HTMLTableCellElement, Input, [
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
          Parser<HTMLTableCellElement, Input, [
            InlineParser.LinkParser.MediaLinkParser,
            InlineParser.MediaParser,
            InlineParser.ShortMediaParser,
            InlineParser,
          ]> {
        }
        export interface DataParser extends
          Block<'table/cell/data'>,
          Parser<HTMLTableCellElement, Input, [
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
      Parser<HTMLElement, Input, [
        Parser<string, Input, []>,
        Parser<HTMLElement, Input, []>,
        AutolinkParser,
        Parser<HTMLElement, Input, []>,
      ]> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<string, Input, []> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLElement, Input, [
        Parser<string, Input, []>,
        Parser<HTMLElement, Input, []>,
      ]> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<string, Input, []> {
      }
    }
    export interface ExtensionParser extends
      // ~~~abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, Input, [
        //ExtensionParser.FigbaseParser,
        //ExtensionParser.FigParser,
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
        Parser<string, Input, [
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
        Parser<HTMLElement, Input, [
          Parser<HTMLElement | string, Input, [
            InlineParser.ExtensionParser.LabelParser,
            SourceParser.StrParser,
          ]>,
          Parser<HTMLElement | string, Input, [
            Parser<HTMLElement | string, Input, [
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
              InlineParser.ShortMediaParser.LineShortMediaParser,
            ]>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ]>,
        ]> {
      }
      export namespace FigureParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<never, Input, [
            SourceParser.ContentLineParser,
            Parser<never, Input, [
              Parser<never, Input, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                TableParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                PlaceholderParser.SegmentParser,
                SourceParser.ContentLineParser,
              ]>,
              SourceParser.EmptyLineParser,
              Parser<never, Input, [
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
        Parser<HTMLElement, Input, [
          FigureParser,
        ]> {
      }
      export namespace FigParser {
        export interface SegmentParser extends
          Block<'extension/fig/segment'>,
          Parser<never, Input, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, Input, [
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
        Parser<HTMLElement, Input, [
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
        Parser<HTMLElement, Input, [
          Parser<string, Input, []>,
          TableParser.GridTableParser,
        ]> {
      }
      export namespace TableParser {
        export interface SegmentParser extends
          Block<'extension/table/segment'>,
          Parser<never, Input, []> {
        }
        export interface GridTableParser extends
          Block<'extension/table/gridtable'>,
          Parser<HTMLElement, Input, [
            TableParser.RowParser,
          ]> {
        }
        export interface RowParser extends
          Block<'extension/table/row'>,
          Parser<List<Node<[string[], string[]?] | HTMLTableCellElement>>, Input, [
            Parser<[string[], string[]?], Input, [
              AlignParser,
            ]>,
            Parser<HTMLTableCellElement, Input, [
              CellParser.HeadParser,
              CellParser.DataParser,
              CellParser.DatalineParser,
              SourceParser.EmptyLineParser,
            ]>,
          ]> {
        }
        export interface AlignParser extends
          Block<'extension/table/align'>,
          Parser<[string[], string[]?], Input, [
            SourceParser.StrParser,
          ]> {
        }
        export namespace CellParser {
          export interface HeadParser extends
            Block<'extension/table/cell/head'>,
            Parser<HTMLTableCellElement, Input, [
              Parser<HTMLElement, Input, [
                InlineParser.LinkParser.MediaLinkParser,
                InlineParser.MediaParser,
                InlineParser.ShortMediaParser.LineShortMediaParser,
              ]>,
              InlineParser,
            ]> {
          }
          export interface DataParser extends
            Block<'extension/table/cell/data'>,
            Parser<HTMLTableCellElement, Input, [
              Parser<HTMLElement, Input, [
                InlineParser.LinkParser.MediaLinkParser,
                InlineParser.MediaParser,
                InlineParser.ShortMediaParser.LineShortMediaParser,
              ]>,
              InlineParser,
            ]> {
          }
          export interface DatalineParser extends
            Block<'extension/table/cell/dataline'>,
            Parser<HTMLTableCellElement, Input, [
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
        Parser<HTMLElement, Input, [
          Parser<string, Input, []>,
          Parser<HTMLElement, Input, []>,
          MessageParser.ContentParser,
          Parser<HTMLElement, Input, []>,
        ]> {
      }
      export namespace MessageParser {
        export interface ContentParser extends
          Block<'extension/message/content'>,
          Parser<HTMLElement, Input, [
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
        Parser<HTMLElement, Input, [
          Parser<string, Input, []>,
          Parser<HTMLElement, Input, []>,
          MarkdownParser,
          Parser<HTMLElement, Input, []>,
        ]> {
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Input, [
          Parser<string, Input, []>,
          Parser<HTMLElement, Input, []>,
        ]> {
      }
      export interface PlaceholderParser extends
        // ~~~abc
        // ~~~
        Block<'extension/placeholder'>,
        Parser<HTMLElement, Input, [
          Parser<string, Input, []>,
          Parser<HTMLElement, Input, []>,
        ]> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, Input, []> {
        }
      }
    }
    export interface BlockquoteParser extends
      // > abc
      // !> *abc*
      Block<'blockquote'>,
      Parser<HTMLElement, Input, [
        BlockquoteParser.SourceParser,
        BlockquoteParser.MarkdownParser,
      ]> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, Input, [
          SourceParser.ContentLineParser,
        ]> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, Input, [
          SourceParser,
          AutolinkParser,
        ]> {
      }
      export interface MarkdownParser extends
        Block<'blockquote/markdown'>,
        Parser<HTMLQuoteElement, Input, [
          MarkdownParser,
          MarkdownParser,
        ]> {
      }
    }
    export interface MediaBlockParser extends
      // abc
      Block<'mediablock'>,
      Parser<HTMLElement, Input, [
        Parser<HTMLElement, Input, [
          InlineParser.LinkParser.MediaLinkParser,
          InlineParser.MediaParser,
          InlineParser.ShortMediaParser.LineShortMediaParser,
        ]>,
        Parser<HTMLElement, Input, [
          InlineParser.LinkParser.MediaLinkParser,
          InlineParser.MediaParser,
          InlineParser.ShortMediaParser.LineShortMediaParser,
        ]>,
      ]> {
    }
    export interface ReplyParser extends
      // >>1
      // > text
      // abc
      Block<'reply'>,
      Parser<HTMLElement, Input, [
        ReplyParser.CiteParser,
        ReplyParser.QuoteParser,
        InlineParser,
      ]> {
    }
    export namespace ReplyParser {
      export interface CiteParser extends
        Block<'reply/cite'>,
        Parser<HTMLSpanElement | HTMLBRElement, Input, [
          InlineParser.AutolinkParser.AnchorParser,
          Parser<HTMLAnchorElement, Input, []>,
          Parser<HTMLAnchorElement, Input, []>,
          Parser<string, Input, []>,
        ]> {
      }
      export interface QuoteParser extends
        Block<'reply/quote'>,
        Parser<HTMLSpanElement | HTMLBRElement, Input, [
          InlineParser.MathParser,
          InlineParser.AutolinkParser,
          SourceParser.UnescapableSourceParser,
        ]> {
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLElement, Input, [
        InlineParser,
      ]> {
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | string, Input, [
      Parser<HTMLElement | string, Input, [
        InlineParser.AnnotationParser,
        InlineParser.ReferenceParser,
        InlineParser.TemplateParser,
        InlineParser.RemarkParser,
        InlineParser.ExtensionParser,
        InlineParser.LinkParser.TextLinkParser,
        InlineParser.RubyParser,
        InlineParser.HTMLParser,
        InlineParser.InsertionParser,
        InlineParser.DeletionParser,
        InlineParser.MarkParser,
        InlineParser.EmStrongParser,
        InlineParser.StrongParser,
        InlineParser.EmphasisParser,
        InlineParser.ItalicParser,
        InlineParser.MathParser,
        InlineParser.CodeParser,
        InlineParser.HTMLEntityParser,
        InlineParser.BracketParser,
      ]>,
      InlineParser.AutolinkParser,
      SourceParser.TextParser,
    ]> {
  }
  export namespace InlineParser {
    interface Inline<T extends string> extends Markdown<`inline/${T}`> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<string | HTMLElement, Input, [
        InlineParser,
      ]> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      // [[^Abbr]]
      // [[^Abbr| abc]]
      Inline<'reference'>,
      Parser<string | HTMLElement, Input, [
        ReferenceParser.AbbrParser,
        InlineParser,
      ]> {
    }
    export namespace ReferenceParser {
      export interface AbbrParser extends
        // ^X 2020, 1-2
        // ^X. Y., and Z et al. 2020, 1-2
        Inline<'reference/abbr'>,
        Parser<string, Input, [
          SourceParser.StrParser,
        ]> {
      }
    }
    export interface TemplateParser extends
      // {{abc}}
      Inline<'template'>,
      Parser<HTMLElement | string, Input, [
        TemplateParser.BracketParser,
        SourceParser.EscapableSourceParser,
      ]> {
    }
    export namespace TemplateParser {
      export interface BracketParser extends
        Inline<'template/bracket'>,
        Parser<string | HTMLBRElement, Input, [
          Parser<string | HTMLBRElement, Input, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ]>,
          Parser<string | HTMLBRElement, Input, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ]>,
          Parser<string | HTMLBRElement, Input, [
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
      Parser<HTMLElement | string, Input, [
        InlineParser,
      ]> {
    }
    export interface ExtensionParser extends
      Inline<'extension'>,
      Parser<HTMLElement | string, Input, [
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
        Parser<HTMLAnchorElement, Input, [
          InlineParser,
          IndexParser.SignatureParser,
        ]> {
      }
      export namespace IndexParser {
        export interface SignatureParser extends
          Inline<'extension/index/signature'>,
          Parser<string | HTMLElement, Input, [
            UnsafeHTMLEntityParser,
            SourceParser.TxtParser,
          ]> {
        }
      }
      export interface IndexerParser extends
        // [|signature]
        // [|]
        Inline<'extension/indexer'>,
        Parser<HTMLElement, Input, [
          IndexParser.SignatureParser,
          Parser<HTMLSpanElement, Input, []>,
        ]> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, Input, [
          SourceParser.StrParser,
          SourceParser.StrParser,
        ]> {
      }
      export namespace LabelParser {
        export interface SegmentParser extends
          Inline<'extension/label/segment'>,
          Parser<never, Input, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ]> {
        }
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLElement | string, Input, [
          InlineParser,
        ]> {
      }
    }
    export interface LinkParser extends
      // { uri }
      // [abc]{uri nofollow}
      Inline<'link'>,
      Parser<HTMLAnchorElement | HTMLSpanElement | string, Input, [
        LinkParser.MediaLinkParser,
        LinkParser.TextLinkParser,
      ]> {
    }
    export namespace LinkParser {
      export interface TextLinkParser extends
        Inline<'link/textlink'>,
        Parser<HTMLAnchorElement | HTMLSpanElement | string, Input, [
          Parser<List<Node<string | HTMLElement>>, Input, [
            InlineParser,
          ]>,
          LinkParser.ParameterParser,
        ]> {
      }
      export interface MediaLinkParser extends
        Inline<'link/medialink'>,
        Parser<HTMLAnchorElement | HTMLSpanElement, Input, [
          Parser<List<Node<HTMLElement>>, Input, [
            MediaParser,
            ShortMediaParser,
          ]>,
          LinkParser.ParameterParser,
        ]> {
      }
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<List<Node<string | HTMLElement>>, Input, [
          MediaParser,
          ShortMediaParser,
          InlineParser,
        ]> {
      }
      export interface TextParser extends
        Inline<'link/text'>,
        Parser<List<Node<string>>, Input, [
          SourceParser.UnescapableSourceParser,
        ]> {
      }
      export interface ParameterParser extends
        Inline<'link/parameter'>,
        Parser<List<Node<string>>, Input, [
          LinkParser.ParameterParser.UriParser,
          LinkParser.ParameterParser.OptionParser,
        ]> {
      }
      export namespace ParameterParser {
        export interface UriParser extends
          Inline<'link/parameter/uri'>,
          Parser<string, Input, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ]> {
        }
        export interface OptionParser extends
          Inline<'link/parameter/option'>,
          Parser<string, Input, [
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
      Parser<HTMLElement, Input, [
        MediaParser.TextParser,
        MediaParser.ParameterParser,
      ]> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<List<Node<string>>, Input, [
          UnsafeHTMLEntityParser,
          TextParser.BracketParser,
          SourceParser.TxtParser,
        ]> {
      }
      export namespace TextParser {
        export interface BracketParser extends
          Inline<'media/text/bracket'>,
          Parser<string, Input, [
            Parser<string, Input, [
              UnsafeHTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Input, [
              UnsafeHTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Input, [
              UnsafeHTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Input, [
              UnsafeHTMLEntityParser,
              SourceParser.TxtParser,
            ]>,
          ]> {
        }
      }
      export interface ParameterParser extends
        Inline<'media/parameter'>,
        Parser<List<Node<string>>, Input, [
          LinkParser.ParameterParser.UriParser,
          ParameterParser.OptionParser,
        ]> {
      }
      export namespace ParameterParser {
        export interface OptionParser extends
          Inline<'media/parameter/option'>,
          Parser<string, Input, [
            SourceParser.StrParser,
            LinkParser.ParameterParser.OptionParser,
          ]> {
        }
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement | string, Input, [
        Parser<List<Node<string>>, Input, [RubyParser.TextParser]>,
        Parser<List<Node<string>>, Input, [RubyParser.TextParser]>,
      ]> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<string, Input, []> {
      }
    }
    export interface HTMLParser extends
      // Allow: wbr, bdo, bdi
      // <bdi>abc</bdi>
      Inline<'html'>,
      Parser<HTMLElement | string, Input, [
        HTMLParser.VoidTagParser,
        HTMLParser.TagParser,
        HTMLParser.VoidTagParser,
      ]> {
    }
    export namespace HTMLParser {
      export interface VoidTagParser extends
        Inline<'html/voidtag'>,
        Parser<HTMLElement | string, Input, [
          AttributeParser,
        ]> {
      }
      export interface TagParser extends
        Inline<'html/tag'>,
        Parser<HTMLElement | string, Input, [
          InlineParser,
          InlineParser,
        ]> {
      }
      export interface AttributeParser extends
        Inline<'html/attribute'>,
        Parser<string, Input, [
          SourceParser.StrParser,
          SourceParser.StrParser,
        ]> {
      }
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
        InlineParser,
      ]> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
        InlineParser,
      ]> {
    }
    export interface MarkParser extends
      // ==abc==
      Inline<'mark'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
      ]> {
    }
    export interface EmStrongParser extends
      // ***abc***
      Inline<'emstrong'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
        EmphasisParser,
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
        StrongParser,
      ]> {
    }
    export interface ItalicParser extends
      // ///abc///
      Inline<'italic'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
      ]> {
    }
    export interface MathParser extends
      // $expr$
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLElement | string, Input, [
        MathParser.BracketParser,
        Parser<string, Input, [
          SourceParser.EscapableSourceParser,
          MathParser.BracketParser,
        ]>,
      ]> {
    }
    export namespace MathParser {
      export interface BracketParser extends
        Inline<'math/bracket'>,
        Parser<HTMLElement, Input, [
          BracketParser,
          SourceParser.EscapableSourceParser,
        ]> {
      }
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | string, Input, [
        SourceParser.StrParser,
      ]> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<string | HTMLSpanElement, Input, [
        UnsafeHTMLEntityParser,
      ]> {
    }
    export interface UnsafeHTMLEntityParser extends
      // &copy;
      Inline<'unsafehtmlentity'>,
      Parser<string, Input, [
        SourceParser.StrParser,
      ]> {
    }
    export interface ShortMediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, Input, [
        MediaParser,
      ]> {
    }
    export namespace ShortMediaParser {
      export interface LineShortMediaParser extends
        Inline<'shortmedia/lineshortmedia'>,
        Parser<HTMLElement, Input, [
          MediaParser,
        ]> {
      }
    }
    export interface BracketParser extends
      // ()
      // []
      // {}
      // ""
      Inline<'bracket'>,
      Parser<HTMLElement | string, Input, [
        InlineParser,
      ]> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLElement | string, Input, [
        AutolinkParser.UrlParser.LineUrlParser,
        AutolinkParser.UrlParser,
        AutolinkParser.EmailParser,
        AutolinkParser.AccountParser,
        AutolinkParser.HashtagParser,
        AutolinkParser.HashnumParser,
        AutolinkParser.AnchorParser,
      ]> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Inline<'url'>,
        Parser<string | HTMLElement, Input, [
          Parser<HTMLAnchorElement, Input, []>,
          Parser<string, Input, []>,
        ]> {
      }
      export namespace UrlParser {
        export interface LineUrlParser extends
          Inline<'url/lineurl'>,
          Parser<string | HTMLElement, Input, [
            SourceParser.StrParser,
            Parser<string | HTMLElement, Input, [
              Parser<HTMLAnchorElement, Input, []>,
              Parser<string, Input, []>,
            ]>,
          ]> {
        }
        export interface BracketParser extends
          Inline<'url/bracket'>,
          Parser<string | HTMLBRElement, Input, [
            Parser<string | HTMLBRElement, Input, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ]>,
            Parser<string | HTMLBRElement, Input, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ]>,
            Parser<string | HTMLBRElement, Input, [
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
        Parser<HTMLElement | string, Input, [
          SourceParser.StrParser,
        ]> {
      }
      export interface AccountParser extends
        // @user
        // @user#tag
        Inline<'account'>,
        Parser<HTMLElement | string, Input, [
          SourceParser.StrParser,
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLElement | string, Input, [
          SourceParser.StrParser,
        ]> {
      }
      export interface HashnumParser extends
        // #1
        Inline<'hashnum'>,
        Parser<HTMLElement | string, Input, [
          SourceParser.StrParser,
        ]> {
      }
      export interface AnchorParser extends
        // >>1
        Inline<'anchor'>,
        Parser<HTMLElement | string, Input, [
          SourceParser.StrParser,
        ]> {
      }
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<string | HTMLElement, Input, [
      InlineParser.AutolinkParser,
      SourceParser.UnescapableSourceParser,
    ]> {
  }
  export namespace SourceParser {
    interface Source<T extends string> extends Markdown<`source/${T}`> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<string | HTMLBRElement, Input, []> {
    }
    export interface TxtParser extends
      // abc
      Source<'txt'>,
      Parser<string, Input, [
        TextParser,
      ]> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<string | HTMLBRElement, Input, []> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<string | HTMLBRElement, Input, []> {
    }
    export interface StrParser extends
      Source<'str'>,
      Parser<string, Input, []> {
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, Input, []> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, Input, []> {
    }
    export interface EmptySegmentParser extends
      Source<'emptysegment'>,
      Parser<never, Input, []> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, Input, []> {
    }
  }
}
