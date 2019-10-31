import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, [
    MarkdownParser.BlockParser,
  ], MarkdownParser.Config, MarkdownParser.State> {
}
export namespace MarkdownParser {
  export interface Config {
    readonly syntax?: {
      readonly inline?: {
        readonly emphasis?: boolean;
        readonly strong?: boolean;
        readonly link?: boolean;
        readonly media?: boolean;
        readonly insertion?: boolean;
        readonly deletion?: boolean;
        readonly annotation?: boolean;
        readonly reference?: boolean;
      };
    };
  }
  export interface State {
  }
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<HTMLElement, [
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.BlankLineParser,
    ], Config, State> {
  }
  export interface BlockParser extends
    Markdown<'block'>,
    Parser<HTMLElement, [
      BlockParser.NewlineParser,
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
    ], Config, State> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface NewlineParser extends
      Block<'newline'>,
      Parser<never, [
        SourceParser.BlankLineParser,
      ], Config, State> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser,
      ], Config, State> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        InlineParser.ExtensionParser.IndexerParser,
        InlineParser,
      ], Config, State> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        UListParser.ListItemParser,
      ], Config, State> {
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
          ], Config, State>,
        ], Config, State> {
      }
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        OListParser.ListItemParser,
      ], Config, State> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, [
          Parser<HTMLElement | Text, [
            SourceParser.UnescapableSourceParser,
            InlineParser,
          ], Config, State>,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ], Config, State>,
        ], Config, State> {
      }
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        IListParser.ListItemParser,
      ], Config, State> {
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
      ], Config, State> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], Config, State> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser,
        ], Config, State> {
      }
    }
    export interface TableParser extends
      // |Head|
      // |:--:|
      // |data|
      Block<'table'>,
      Parser<HTMLTableElement, [
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.AlignParser>,
        TableParser.RowParser<TableParser.RowParser.CellParser.DataParser>,
      ], Config, State> {
    }
    export namespace TableParser {
      export interface RowParser<P extends RowParser.CellParser.IncellParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          RowParser.CellParser<P>,
        ], Config, State> {
      }
      export namespace RowParser {
        export interface CellParser<P extends CellParser.IncellParser> extends
          Block<'table/row/cell'>,
          Parser<HTMLTableDataCellElement, [
            P,
          ], Config, State> {
        }
        export namespace CellParser {
          export type IncellParser = DataParser | AlignParser;
          export interface DataParser extends
            Block<'table/row/cell/data'>,
            Parser<HTMLElement | Text, [
              InlineParser,
            ], Config, State> {
          }
          export interface AlignParser extends
            Block<'table/row/cell/align'>,
            Parser<Text, [
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
            ], Config, State> {
          }
        }
      }
    }
    export interface BlockquoteParser extends
      // > abc
      Block<'blockquote'>,
      Parser<HTMLQuoteElement, [
        BlockquoteParser.TextParser,
        BlockquoteParser.SourceParser,
      ], Config, State> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
          SourceParser.ContentLineParser,
        ], Config, State> {
      }
      export interface TextParser extends
        Block<'blockquote/text'>,
        Parser<HTMLQuoteElement, [
          TextParser,
          AutolinkParser,
        ], Config, State> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, [
          SourceParser,
          MarkdownParser,
        ], Config, State> {
      }
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [
        AutolinkParser,
      ], Config, State> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], Config, State> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser,
      ], Config, State> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], Config, State> {
      }
    }
    export interface ExtensionParser extends
      // ~~~abc
      // ~~~
      Block<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.FigureParser,
        ExtensionParser.FigureParser,
        ExtensionParser.ExampleParser,
        ExtensionParser.PlaceholderParser,
      ], Config, State> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<HTMLElement, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          ExampleParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ], Config, State> {
      }
      export interface FigureParser extends
        // ~~~figure [$group-name]
        // !https://host/image.png
        //
        // caption
        // ~~~
        //
        // [$group-name]
        // !https://host/image.png
        Block<'extension/figure'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.LabelParser,
          Parser<HTMLElement | Text, [
            Parser<HTMLElement, [
              TableParser,
              CodeBlockParser,
              MathBlockParser,
              ExtensionParser.ExampleParser,
              BlockquoteParser,
              InlineParser.MediaParser,
              InlineParser.ShortmediaParser,
            ], Config, State>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ], Config, State>,
        ], Config, State> {
      }
      export namespace FigureParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<HTMLElement, [
            InlineParser.ExtensionParser.LabelParser,
            Parser<never, [
              Parser<never, [
                CodeBlockParser.SegmentParser,
                MathBlockParser.SegmentParser,
                ExtensionParser.ExampleParser.SegmentParser,
                BlockquoteParser.SegmentParser,
                SourceParser.ContentLineParser,
              ], Config, State>,
              SourceParser.EmptyLineParser,
              Parser<never, [
                SourceParser.BlankLineParser,
                SourceParser.ContentLineParser,
              ], Config, State>,
            ], Config, State>,
          ], Config, State> {
        }
      }
      export namespace FigParser {
        export interface SegmentParser extends
          Block<'extension/figure/segment'>,
          Parser<HTMLElement, [
            InlineParser.ExtensionParser.LabelParser,
            Parser<never, [
              CodeBlockParser.SegmentParser,
              MathBlockParser.SegmentParser,
              ExtensionParser.ExampleParser.SegmentParser,
              BlockquoteParser.SegmentParser,
              SourceParser.ContentLineParser,
            ], Config, State>,
          ], Config, State> {
        }
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Parser<HTMLElement, [], Config, State>[], Config, State> {
      }
      export namespace ExampleParser {
        export interface SegmentParser extends
          Block<'extension/example/segment'>,
          Parser<never, [], Config, State> {
        }
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, [], Config, State> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, [], Config, State> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.MentionParser,
        InlineParser,
      ], Config, State> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // abc
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, [
          ParagraphParser.MentionParser.AddressParser,
          ParagraphParser.MentionParser.QuotationParser,
        ], Config, State> {
      }
      export namespace MentionParser {
        export interface AddressParser extends
          // >0a
          Block<'paragraph/mention/address'>,
          Parser<HTMLAnchorElement, [
            InlineParser.LinkParser,
            InlineParser.LinkParser,
          ], Config, State> {
        }
        export interface QuotationParser extends
          // > text
          Block<'paragraph/mention/quotation'>,
          Parser<HTMLSpanElement, [
            AutolinkParser,
            AutolinkParser,
          ], Config, State> {
        }
      }
    }
  }
  export interface InlineParser extends
    Markdown<'inline'>,
    Parser<HTMLElement | Text, [
      InlineParser.AnnotationParser,
      InlineParser.ReferenceParser,
      InlineParser.TemplateParser,
      InlineParser.ExtensionParser,
      InlineParser.LinkParser,
      InlineParser.MediaParser,
      InlineParser.RubyParser,
      InlineParser.HTMLParser,
      InlineParser.CommentParser,
      InlineParser.InsertionParser,
      InlineParser.DeletionParser,
      InlineParser.EmphasisParser,
      InlineParser.StrongParser,
      InlineParser.CodeParser,
      InlineParser.MathParser,
      InlineParser.HTMLEntityParser,
      InlineParser.ShortmediaParser,
      InlineParser.AutolinkParser,
      InlineParser.BracketParser,
      SourceParser.TextParser,
    ], Config, State> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config, State> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      Inline<'reference'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config, State> {
    }
    export interface TemplateParser extends
      // {{ abc }}
      Inline<'template'>,
      Parser<HTMLSpanElement | Text, [
        SourceParser.CharParser.ExclamationParser,
        InlineParser,
      ], Config, State> {
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.DataParser,
        ExtensionParser.PlaceholderParser,
      ], Config, State> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ], Config, State> {
      }
      export interface IndexerParser extends
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLSpanElement, [
          IndexParser,
        ], Config, State> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
          LinkParser,
        ], Config, State> {
      }
      export interface DataParser extends
        // [~name]
        // [~name=value]
        // [~name=value|text]
        Inline<'extension/data'>,
        Parser<HTMLSpanElement, [
          SourceParser.UnescapableSourceParser,
          InlineParser,
        ], Config, State> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          InlineParser,
        ], Config, State> {
      }
    }
    export interface LinkParser extends
      // {uri}
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        LinkParser.ContentParser,
        LinkParser.ParamParser,
      ], Config, State> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<DocumentFragment, [
          MediaParser,
          ShortmediaParser,
          InlineParser,
        ], Config, State> {
      }
      export interface ParamParser extends
        Inline<'link/param'>,
        Parser<DocumentFragment, [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ], Config, State> {
      }
      export namespace ParamParser {
        export interface UriParser extends
          Inline<'link/uri'>,
          Parser<Text, [
            UriParser.BracketParser,
            SourceParser.UnescapableSourceParser,
          ], Config, State> {
        }
        export namespace UriParser {
          export interface BracketParser extends
            Inline<'link/uri/bracket'>,
            Parser<Text, Parser<Text, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], Config, State>[], Config, State> {
          }
        }
      }
    }
    export interface MediaParser extends
      // !{uri}
      // ![abc]{uri}
      Inline<'media'>,
      Parser<HTMLAnchorElement, [
        MediaParser.TextParser,
        MediaParser.ParamParser,
      ], Config, State> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<(HTMLElement | Text)[], [
          SourceParser.TextParser,
        ], Config, State> {
      }
      export interface ParamParser extends
        Inline<'media/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ], Config, State> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        RubyParser.TextParser,
        RubyParser.TextParser,
      ], Config, State> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<(HTMLElement | Text)[], [
          HTMLEntityParser,
          SourceParser.TextParser,
        ], Config, State> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
          HTMLParser.ContentParser,
        ], Config, State>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ], Config, State>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ], Config, State>,
      ], Config, State> {
    }
    export namespace HTMLParser {
      export interface ParamParser extends
        Inline<'html/param'>,
        Parser<Text[], [
          ParamParser.AttributeParser,
        ], Config, State> {
      }
      export namespace ParamParser {
        export interface AttributeParser extends
          Inline<'html/param/attribute'>,
          Parser<Text, [
            SourceParser.UnescapableSourceParser,
            SourceParser.CharParser.EqualParser,
            SourceParser.EscapableSourceParser,
          ], Config, State> {
        }
      }
      export interface ContentParser extends
        Inline<'html/content'>,
        Parser<(HTMLElement | Text)[], [
          InlineParser,
        ], Config, State> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, [], Config, State> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config, State> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config, State> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement, [
        StrongParser,
        InlineParser,
      ], Config, State> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config, State> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | Text, [
        Parser<HTMLElement, [
          SourceParser.UnescapableSourceParser,
        ], Config, State>,
        SourceParser.UnescapableSourceParser,
      ], Config, State> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser,
      ], Config, State> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, [], Config, State> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, [
        MediaParser,
      ], Config, State> {
    }
    export interface AutolinkParser extends
      Inline<'autolink'>,
      Parser<HTMLAnchorElement | HTMLImageElement | Text, [
        AutolinkParser.UriParser,
        AutolinkParser.EmailParser,
        SourceParser.UnescapableSourceParser,
        SourceParser.UnescapableSourceParser,
        AutolinkParser.ChannelParser,
        AutolinkParser.AccountParser,
        AutolinkParser.HashtagParser,
        AutolinkParser.HashrefParser,
        SourceParser.UnescapableSourceParser,
      ], Config, State> {
    }
    export namespace AutolinkParser {
      export interface UriParser extends
        // https://host
        Inline<'uri'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ], Config, State> {
      }
      export interface EmailParser extends
        // account@host
        Inline<'email'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config, State> {
      }
      export interface ChannelParser extends
        // @account#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ], Config, State> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config, State> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config, State> {
      }
      export interface HashrefParser extends
        // #1
        Inline<'hashref'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config, State> {
      }
    }
    export interface BracketParser extends
      // [abc]
      Inline<'bracket'>,
      Parser<HTMLElement | Text, InlineParser[], Config, State> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | Text, [
      InlineParser.AutolinkParser,
      SourceParser.NewlineParser,
      SourceParser.UnescapableSourceParser,
    ], Config, State> {
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, [], Config, State> {
    }
    export interface NewlineParser extends
      // abc
      Source<'newline'>,
      Parser<HTMLBRElement, [TextParser], Config, State> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<Text, [], Config, State> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<Text, [], Config, State> {
    }
    export namespace CharParser {
      export interface ExclamationParser extends
        // !
        Source<'char/exclamation'>,
        Parser<Text, [], Config, State> {
      }
      export interface EqualParser extends
        // =
        Source<'char/equal'>,
        Parser<Text, [], Config, State> {
      }
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, [], Config, State> {
    }
    export interface BlankLineParser extends
      Source<'blankline'>,
      Parser<never, [], Config, State> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, [], Config, State> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, [], Config, State> {
    }
  }
}
