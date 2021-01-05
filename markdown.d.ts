import { Parser, Ctx } from './src/combinator';
import { Collection } from 'spica/collection';

declare abstract class Markdown<T> {
  private parser?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, [
    MarkdownParser.BlockParser,
  ], MarkdownParser.Context> {
}
export namespace MarkdownParser {
  export interface Context extends Ctx {
    readonly host?: URL;
    readonly url?: URL;
    readonly id?: string;
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
        readonly bdx?: boolean;
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
    Parser<string, [
      BlockParser.HeadingParser.SegmentParser,
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.EmptyLineParser,
    ], Context> {
  }
  export interface HeaderParser extends
    // ---
    // url: https://host/path
    // ---
    Markdown<'header'>,
    Parser<HTMLDetailsElement, [], Context> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
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
    ], Context> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'heading'>,
      Parser<HTMLHeadingElement, [
        Parser<HTMLElement | string, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], Context>,
        Parser<HTMLElement | string, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], Context>,
      ], Context> {
    }
    export namespace HeadingParser {
      export interface SegmentParser extends
        Block<'heading/segment'>,
        Parser<string, [], Context> {
      }
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        UListParser.ListItemParser,
      ], Context> {
    }
    export namespace UListParser {
      export interface ListItemParser extends
        Block<'ulist/listitem'>,
        Parser<HTMLLIElement, [
          InlineParser,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ], Context>,
        ], Context> {
      }
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        OListParser.ListItemParser,
      ], Context> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, [
          Parser<HTMLElement | string, [
            SourceParser.StrParser,
            InlineParser,
          ], Context>,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ], Context>,
        ], Context> {
      }
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        IListParser.ListItemParser,
      ], Context> {
    }
    export namespace IListParser {
      export type ListItemParser = UListParser.ListItemParser;
    }
    export interface DListParser extends
      // ~ term
      // : description
      Block<'dlist'>,
      Parser<HTMLDListElement, [
        DListParser.TermParser,
        DListParser.DescriptionParser,
      ], Context> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], Context> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser,
        ], Context> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, [
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.AlignmentParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
      ], Context> {
    }
    export namespace TableParser {
      export interface RowParser<P extends RowParser.CellParser.ContentParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          RowParser.CellParser<P>,
        ], Context> {
      }
      export namespace RowParser {
        export interface CellParser<P extends CellParser.ContentParser> extends
          Block<'table/row/cell'>,
          Parser<HTMLTableDataCellElement, [
            P,
          ], Context> {
        }
        export namespace CellParser {
          export type ContentParser = DataParser | AlignmentParser;
          export interface DataParser extends
            Block<'table/row/cell/data'>,
            Parser<HTMLElement | string, [
              InlineParser,
            ], Context> {
          }
          export interface AlignmentParser extends
            Block<'table/row/cell/alignment'>,
            Parser<string, [
              SourceParser.StrParser,
              SourceParser.StrParser,
              SourceParser.StrParser,
              SourceParser.StrParser,
            ], Context> {
          }
        }
      }
    }
    export interface BlockquoteParser extends
      // > abc
      Block<'blockquote'>,
      Parser<HTMLQuoteElement, [
        BlockquoteParser.SourceParser,
        BlockquoteParser.MarkdownParser,
      ], Context> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], Context> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, [
          SourceParser,
          AutolinkParser,
        ], Context> {
      }
      export interface MarkdownParser extends
        Block<'blockquote/markdown'>,
        Parser<HTMLQuoteElement, [
          MarkdownParser,
          Parser<DocumentFragment | HTMLOListElement, [], Context>,
        ], Context> {
      }
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [], Context> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, [], Context> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement | HTMLPreElement, [], Context> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, [], Context> {
      }
    }
    export interface ExtensionParser extends
      // ~~~abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.FigbaseParser,
        ExtensionParser.FigParser,
        ExtensionParser.FigureParser,
        ExtensionParser.ExampleParser,
        ExtensionParser.AsideParser,
        ExtensionParser.PlaceholderParser,
      ], Context> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<never, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          ExampleParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ], Context> {
      }
      export interface FigureParser extends
        // ~~~figure $group-name
        // !https://host/image.png
        //
        // caption
        // ~~~
        Block<'extension/figure'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.LabelParser,
          Parser<HTMLElement | string, [
            Parser<HTMLElement | string, [
              TableParser,
              CodeBlockParser,
              MathBlockParser,
              ExampleParser,
              BlockquoteParser,
              InlineParser.MediaParser,
              InlineParser.ShortmediaParser,
            ], Context>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ], Context>,
        ], Context> {
      }
      export namespace FigureParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<never, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, [
              Parser<never, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                ExampleParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                SourceParser.ContentLineParser,
              ], Context>,
              SourceParser.EmptyLineParser,
              Parser<never, [
                SourceParser.EmptyLineParser,
                SourceParser.ContentLineParser,
              ], Context>,
            ], Context>,
          ], Context> {
        }
      }
      export interface FigParser extends
        // $group-name
        // !https://host/image.png
        Block<'extension/fig'>,
        Parser<HTMLElement, [
          FigureParser,
        ], Context> {
      }
      export namespace FigParser {
        export interface SegmentParser extends
          Block<'extension/fig/segment'>,
          Parser<never, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
            Parser<never, [
              CodeBlockParser.SegmentParser,
              MathBlockParser.SegmentParser,
              ExampleParser.SegmentParser,
              BlockquoteParser.SegmentParser,
              SourceParser.ContentLineParser,
            ], Context>,
          ], Context> {
        }
      }
      export interface FigbaseParser extends
        // $group-name
        Block<'extension/figbase'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.LabelParser,
        ], Context> {
      }
      export namespace FigbaseParser {
        export interface SegmentParser extends
          Block<'extension/figbase/segment'>,
          Parser<never, [
            InlineParser.ExtensionParser.LabelParser.SegmentParser,
          ], Context> {
        }
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, [
          MarkdownParser,
        ], Context> {
      }
      export namespace ExampleParser {
        export interface SegmentParser extends
          Block<'extension/example/segment'>,
          Parser<never, [], Context> {
        }
      }
      export interface AsideParser extends
        // ~~~aside
        // ~~~
        Block<'extension/aside'>,
        Parser<HTMLElement, [
          MarkdownParser,
        ], Context> {
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, [], Context> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, [], Context> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.MentionParser,
        InlineParser,
      ], Context> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // abc
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, [
          ParagraphParser.MentionParser.AddressParser,
          ParagraphParser.MentionParser.QuotationParser,
        ], Context> {
      }
      export namespace MentionParser {
        export interface AddressParser extends
          // >>1
          Block<'paragraph/mention/address'>,
          Parser<HTMLSpanElement, [
            SourceParser.StrParser,
            InlineParser.AutolinkParser.AddressParser,
          ], Context> {
        }
        export interface QuotationParser extends
          // > text
          Block<'paragraph/mention/quotation'>,
          Parser<HTMLSpanElement, [
            QuotationParser.BlockParser,
            QuotationParser.BlockParser,
          ], Context> {
        }
        export namespace QuotationParser {
          export interface BlockParser extends
            Block<'paragraph/mention/quotation/block'>,
            Parser<string | HTMLElement, [
              TextParser,
            ], Context> {
          }
          export interface TextParser extends
            Block<'paragraph/mention/quotation/text'>,
            Parser<string | HTMLElement, [
              InlineParser.MathParser,
              AutolinkParser,
            ], Context> {
          }
        }
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | string, [
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
    ], Context> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Context> {
    }
    export interface EscapeParser extends
      // ****
      // +++
      // ~~~
      // ===
      Inline<'escape'>,
      Parser<string, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      Inline<'reference'>,
      Parser<HTMLElement, [
        ReferenceParser.AliasParser,
        InlineParser,
      ], Context> {
    }
    export namespace ReferenceParser {
      export interface AliasParser extends
        // ^Xyz2020:
        // ^X, 2020, p1-2:
        // ^X. Y., Z et al., 2020, p1-2
        Inline<'reference/alias'>,
        Parser<HTMLElement, [
          SourceParser.StrParser,
        ], Context> {
      }
    }
    export interface TemplateParser extends
      // {{abc}}
      Inline<'template'>,
      Parser<HTMLSpanElement, [
        TemplateParser.BracketParser,
        SourceParser.EscapableSourceParser,
      ], Context> {
    }
    export namespace TemplateParser {
      export interface BracketParser extends
        Inline<'template/bracket'>,
        Parser<string, [
          Parser<string, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ], Context>,
          Parser<string, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ], Context>,
          Parser<string, [
            BracketParser,
            SourceParser.EscapableSourceParser,
          ], Context>,
          SourceParser.EscapableSourceParser,
        ], Context> {
      }
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement | string, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.PlaceholderParser,
      ], Context> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          InlineParser,
        ], Context> {
      }
      export interface IndexerParser extends
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLElement | string, [
          IndexParser,
        ], Context> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
          SourceParser.StrParser,
        ], Context> {
      }
      export namespace LabelParser {
        export interface SegmentParser extends
          Inline<'extension/label/segment'>,
          Parser<never, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ], Context> {
        }
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLElement | string, [
          InlineParser,
        ], Context> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        RubyParser.TextParser,
        RubyParser.TextParser,
      ], Context> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<string[], [], Context> {
      }
    }
    export interface LinkParser extends
      // {uri}
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLElement, [
        LinkParser.ContentParser,
        LinkParser.ParameterParser,
      ], Context> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<(HTMLElement | string)[], [
          MediaParser,
          ShortmediaParser,
          InlineParser,
        ], Context> {
      }
      export interface ParameterParser extends
        Inline<'link/parameter'>,
        Parser<string[], [
          LinkParser.ParameterParser.UriParser,
          LinkParser.ParameterParser.OptionParser,
        ], Context> {
      }
      export namespace ParameterParser {
        export interface UriParser extends
          Inline<'link/parameter/uri'>,
          Parser<string, [
            SourceParser.StrParser,
            SourceParser.StrParser,
          ], Context> {
        }
        export interface OptionParser extends
          Inline<'link/parameter/option'>,
          Parser<string, [
            SourceParser.StrParser,
          ], Context> {
        }
      }
    }
    export interface MediaParser extends
      // !{uri}
      // ![abc]{uri}
      Inline<'media'>,
      Parser<HTMLElement, [
        MediaParser.TextParser,
        MediaParser.ParameterParser,
      ], Context> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<string[], [
          TextParser.BracketParser,
          SourceParser.TextParser,
        ], Context> {
      }
      export namespace TextParser {
        export interface BracketParser extends
          Inline<'media/text/bracket'>,
          Parser<HTMLElement | string, [
            Parser<HTMLElement | string, [
              BracketParser,
              SourceParser.TextParser,
            ], Context>,
            Parser<HTMLElement | string, [
              BracketParser,
              SourceParser.TextParser,
            ], Context>,
            Parser<HTMLElement | string, [
              BracketParser,
              SourceParser.TextParser,
            ], Context>,
            SourceParser.TextParser,
          ], Context> {
        }
      }
      export interface ParameterParser extends
        Inline<'media/parameter'>,
        Parser<string[], [
          LinkParser.ParameterParser.UriParser,
          LinkParser.ParameterParser.OptionParser,
        ], Context> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement | string, [
        HTMLParser.OpenTagParser,
        HTMLParser.TagParser,
        HTMLParser.TagParser,
      ], Context> {
    }
    export namespace HTMLParser {
      export interface OpenTagParser extends
        Inline<'html/opentag'>,
        Parser<HTMLElement, [
          TagParser.AttributeParser,
        ], Context> {
      }
      export interface TagParser extends
        Inline<'html/tag'>,
        Parser<HTMLElement | string, [
          InlineParser,
        ], Context> {
      }
      export namespace TagParser {
        export interface AttributeParser extends
          Inline<'html/tag/attribute'>,
          Parser<string, [
            SourceParser.StrParser,
          ], Context> {
        }
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, [], Context> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement | string, [
        InlineParser,
      ], Context> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement | string, [
        InlineParser,
      ], Context> {
    }
    export interface MarkParser extends
      // ==abc==
      Inline<'mark'>,
      Parser<HTMLElement | string, [
        InlineParser,
      ], Context> {
    }
    export interface EmStrongParser extends
      // *abc*
      Inline<'emstrong'>,
      Parser<HTMLElement | string, [
        InlineParser,
      ], Context> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement | string, [
        StrongParser,
        InlineParser,
      ], Context> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement | string, [
        EmphasisParser,
        InlineParser,
        SourceParser.StrParser,
      ], Context> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | string, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLElement, [
        SourceParser.StrParser,
      ], Context> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<string, [], Context> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, [
        MediaParser,
      ], Context> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLElement | string, [
        AutolinkParser.UrlParser,
        AutolinkParser.EmailParser,
        SourceParser.StrParser,
        SourceParser.StrParser,
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        SourceParser.StrParser,
        SourceParser.StrParser,
        AutolinkParser.HashtagParser,
        AutolinkParser.HashrefParser,
        SourceParser.StrParser,
        AutolinkParser.AddressParser,
      ], Context> {
    }
    export namespace AutolinkParser {
      export interface UrlParser extends
        // https://host
        Inline<'url'>,
        Parser<HTMLElement, [
          LinkParser,
        ], Context> {
      }
      export namespace UrlParser {
        export interface BracketParser extends
          Inline<'url/bracket'>,
          Parser<string, [
            Parser<string, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], Context>,
            Parser<string, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], Context>,
            Parser<string, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], Context>,
            Parser<string, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], Context>,
            SourceParser.UnescapableSourceParser,
          ], Context> {
        }
      }
      export interface EmailParser extends
        // user@host
        Inline<'email'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
        ], Context> {
      }
      export interface ChannelParser extends
        // @user#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ], Context> {
      }
      export interface AccountParser extends
        // @user
        Inline<'account'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
        ], Context> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
        ], Context> {
      }
      export interface HashrefParser extends
        // #1
        Inline<'hashref'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
        ], Context> {
      }
      export interface AddressParser extends
        // >>1
        Inline<'address'>,
        Parser<HTMLAnchorElement, [
          SourceParser.StrParser,
        ], Context> {
      }
    }
    export interface BracketParser extends
      // ()
      // []
      // {}
      // ""
      Inline<'bracket'>,
      Parser<HTMLElement | string, [
        InlineParser,
        InlineParser,
        InlineParser,
        InlineParser,
      ], Context> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | string, [
      InlineParser.AutolinkParser,
      SourceParser.LinebreakParser,
      SourceParser.UnescapableSourceParser,
    ], Context> {
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | string, [], Context> {
    }
    export interface LinebreakParser extends
      Source<'linebreak'>,
      Parser<HTMLBRElement, [TextParser], Context> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<string, [], Context> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<string, [], Context> {
    }
    export interface StrParser extends
      Source<'str'>,
      Parser<string, [], Context> {
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, [], Context> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, [], Context> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, [], Context> {
    }
  }
}
