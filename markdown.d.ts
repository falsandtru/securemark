import { Parser, Ctx } from './src/combinator/data/parser';
import { Collection } from 'spica/collection';

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
    readonly syntax?: {
      readonly inline?: {
        readonly annotation?: boolean;
        readonly reference?: boolean;
        readonly index?: boolean;
        readonly label?: boolean;
        readonly link?: boolean;
        readonly media?: boolean;
        readonly autolink?: boolean;
      };
    };
    readonly state?: {
      readonly in?: {
        readonly supsub?: boolean;
        readonly small?: boolean;
      };
    };
    readonly caches?: {
      readonly code?: Collection<string, HTMLElement>;
      readonly math?: Collection<string, HTMLElement>;
      readonly media?: Collection<string, HTMLElement>;
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
    Parser<HTMLDetailsElement | HTMLPreElement, Context, [
      Parser<HTMLDetailsElement | HTMLPreElement, Context, [
        Parser<HTMLDetailsElement, Context, []>,
        Parser<HTMLPreElement, Context, []>,
      ]>,
      Parser<never, Context, []>,
    ]> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, Context, [
      SourceParser.EmptyLineParser,
      BlockParser.HorizontalRuleParser,
      BlockParser.HeadingParser,
      BlockParser.UListParser,
      BlockParser.OListParser,
      BlockParser.IListParser,
      BlockParser.DListParser,
      BlockParser.TableParser,
      BlockParser.CodeBlockParser,
      BlockParser.MathBlockParser,
      BlockParser.ExtensionParser,
      BlockParser.BlockquoteParser,
      BlockParser.ParagraphParser,
    ]> {
  }
  export namespace BlockParser {
    interface Block<T extends string> extends Markdown<`block/${T}`> { }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
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
        UListParser.ListItemParser,
      ]> {
    }
    export namespace UListParser {
      export interface ListItemParser extends
        Block<'ulist/listitem'>,
        Parser<HTMLLIElement, Context, [
          Parser<HTMLElement | string, Context, [
            InlineParser,
            InlineParser,
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
        OListParser.ListItemParser,
      ]> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, Context, [
          Parser<HTMLElement | string, Context, [
            InlineParser,
            InlineParser,
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
        IListParser.ListItemParser,
      ]> {
    }
    export namespace IListParser {
      export interface ListItemParser extends
        Block<'ilist/listitem'>,
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
            InlineParser,
          ]> {
        }
        export interface DataParser extends
          Block<'table/cell/data'>,
          Parser<HTMLTableCellElement, Context, [
            InlineParser,
          ]> {
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
          Parser<DocumentFragment | HTMLOListElement, Context, []>,
        ]> {
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
          InlineParser.ExtensionParser.LabelParser,
          Parser<HTMLElement | string, Context, [
            Parser<HTMLElement | string, Context, [
              BlockParser.TableParser,
              CodeBlockParser,
              MathBlockParser,
              BlockquoteParser,
              ExampleParser,
              TableParser,
              PlaceholderParser,
              InlineParser.MediaParser,
              InlineParser.ShortmediaParser,
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
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, Context, [
              Parser<never, Context, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                TableParser.SegmentParser,
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
              BlockquoteParser.SegmentParser,
              TableParser.SegmentParser,
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
      export namespace FigbaseParser {
        export interface SegmentParser extends
          Block<'extension/figbase/segment'>,
          Parser<never, Context, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
          ]> {
        }
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
              SourceParser.EmptyLineParser,
              CellParser.DatalineParser,
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
              InlineParser,
            ]> {
          }
          export interface DataParser extends
            Block<'extension/table/cell/data'>,
            Parser<HTMLTableCellElement, Context, [
              InlineParser,
            ]> {
          }
          export interface DatalineParser extends
            Block<'extension/table/cell/dataline'>,
            Parser<HTMLTableCellElement, Context, [
              DataParser,
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
            BlockParser.BlockquoteParser,
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
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, Context, [
        ParagraphParser.MentionParser,
        InlineParser,
      ]> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // >>1
        // > text
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, Context, [
          ParagraphParser.MentionParser.CiteParser,
          ParagraphParser.MentionParser.QuoteParser,
        ]> {
      }
      export namespace MentionParser {
        export interface CiteParser extends
          Block<'paragraph/mention/cite'>,
          Parser<HTMLSpanElement, Context, [
            SourceParser.StrParser,
            InlineParser.AutolinkParser.AnchorParser,
          ]> {
        }
        export interface QuoteParser extends
          Block<'paragraph/mention/quote'>,
          Parser<HTMLSpanElement, Context, [
            QuoteParser.BlockParser,
          ]> {
        }
        export namespace QuoteParser {
          export interface BlockParser extends
            Block<'paragraph/mention/quote/block'>,
            Parser<string | HTMLElement, Context, [
              TextParser,
            ]> {
          }
          export interface TextParser extends
            Block<'paragraph/mention/quote/text'>,
            Parser<string | HTMLElement, Context, [
              InlineParser.MathParser,
              AutolinkParser,
            ]> {
          }
        }
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | string, Context, [
      InlineParser.EscapeParser,
      InlineParser.AnnotationParser,
      InlineParser.ReferenceParser,
      InlineParser.TemplateParser,
      InlineParser.ExtensionParser,
      InlineParser.RubyParser,
      InlineParser.LinkParser,
      InlineParser.MediaParser,
      InlineParser.HTMLParser,
      InlineParser.CommentParser,
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.MarkParser,
      InlineParser.EmStrongParser,
      InlineParser.StrongParser,
      InlineParser.EmphasisParser,
      InlineParser.CodeParser,
      InlineParser.MathParser,
      InlineParser.HTMLEntityParser,
      InlineParser.ShortmediaParser,
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
    export interface EscapeParser extends
      // ****
      // +++
      // ~~~
      // ===
      Inline<'escape'>,
      Parser<string, Context, [
        SourceParser.StrParser,
      ]> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      // [[^abbr]]
      // [[^abbr| abc]]
      Inline<'reference'>,
      Parser<HTMLElement, Context, [
        ReferenceParser.AbbrParser,
        InlineParser,
      ]> {
    }
    export namespace ReferenceParser {
      export interface AbbrParser extends
        // ^Xyz2020
        // ^X, 2020, p1-2
        // ^X. Y., Z et al., 2020, p1-2
        Inline<'reference/abbr'>,
        Parser<HTMLElement, Context, [
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
    export interface ExtensionParser extends
      // [#abc]
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
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, Context, [
          InlineParser,
          IndexParser.IndexerParser,
        ]> {
      }
      export namespace IndexParser {
        export interface IndexerParser extends
          Inline<'extension/index/indexer'>,
          Parser<HTMLElement, Context, [
            IndexerParser.BracketParser,
            SourceParser.TxtParser,
          ]> {
        }
        export namespace IndexerParser {
          export interface BracketParser extends
            Inline<'extension/index/indexer/bracket'>,
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
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLElement, Context, [
          IndexParser,
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
        RubyParser.TextParser,
        RubyParser.TextParser,
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
      Parser<HTMLElement, Context, [
        LinkParser.ContentParser,
        LinkParser.ParameterParser,
      ]> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<(HTMLElement | string)[], Context, [
          MediaParser,
          ShortmediaParser,
          InlineParser,
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
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<string[], Context, [
          HTMLEntityParser,
          TextParser.BracketParser,
          SourceParser.TxtParser,
        ]> {
      }
      export namespace TextParser {
        export interface BracketParser extends
          Inline<'media/text/bracket'>,
          Parser<string, Context, [
            Parser<string, Context, [
              HTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Context, [
              HTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Context, [
              HTMLEntityParser,
              BracketParser,
              SourceParser.TxtParser,
            ]>,
            Parser<string, Context, [
              HTMLEntityParser,
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
            LinkParser.ParameterParser.OptionParser,
          ]> {
        }
      }
    }
    export interface HTMLParser extends
      // Allow: sup, sub, small, bdo, bdi
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement | string, Context, [
        HTMLParser.OpenTagParser,
        HTMLParser.TagParser,
        HTMLParser.TagParser,
      ]> {
    }
    export namespace HTMLParser {
      export interface OpenTagParser extends
        Inline<'html/opentag'>,
        Parser<HTMLElement, Context, [
          TagParser.AttributeParser,
        ]> {
      }
      export interface TagParser extends
        Inline<'html/tag'>,
        Parser<HTMLElement | string, Context, [
          InlineParser,
        ]> {
      }
      export namespace TagParser {
        export interface AttributeParser extends
          Inline<'html/tag/attribute'>,
          Parser<string, Context, [
            SourceParser.StrParser,
          ]> {
        }
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, Context, []> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
      ]> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
      ]> {
    }
    export interface MarkParser extends
      // ==abc==
      Inline<'mark'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
      ]> {
    }
    export interface EmStrongParser extends
      // *abc*
      Inline<'emstrong'>,
      Parser<HTMLElement | string, Context, [
        InlineParser,
      ]> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement | string, Context, [
        EmphasisParser,
        InlineParser,
        SourceParser.StrParser,
      ]> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement | string, Context, [
        StrongParser,
        InlineParser,
      ]> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | string, Context, [
        SourceParser.StrParser,
      ]> {
    }
    export interface MathParser extends
      // $expr$
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLElement, Context, [
        SourceParser.StrParser,
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
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<string, Context, []> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, Context, [
        MediaParser,
      ]> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLElement | string, Context, [
        AutolinkParser.UrlParser,
        AutolinkParser.EmailParser,
        SourceParser.StrParser,
        SourceParser.StrParser,
        SourceParser.StrParser,
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        SourceParser.StrParser,
        SourceParser.StrParser,
        AutolinkParser.HashtagParser,
        AutolinkParser.HashrefParser,
        SourceParser.StrParser,
        AutolinkParser.AnchorParser,
      ]> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Inline<'url'>,
        Parser<HTMLElement, Context, [
          LinkParser,
        ]> {
      }
      export namespace UrlParser {
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
          SourceParser.StrParser,
        ]> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, Context, [
          SourceParser.StrParser,
        ]> {
      }
      export interface HashrefParser extends
        // #1
        Inline<'hashref'>,
        Parser<HTMLAnchorElement, Context, [
          SourceParser.StrParser,
        ]> {
      }
      export interface AnchorParser extends
        // >>1
        Inline<'anchor'>,
        Parser<HTMLAnchorElement, Context, [
          SourceParser.StrParser,
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
    Parser<HTMLElement | string, Context, [
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
      Parser<HTMLBRElement | HTMLSpanElement | string, Context, []> {
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
