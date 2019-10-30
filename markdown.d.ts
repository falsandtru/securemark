import { Parser } from './src/combinator';

declare abstract class Markdown<T> {
  private MARKDOWN?: T;
}
export interface MarkdownParser extends
  Markdown<'markdown'>,
  Parser<DocumentFragment, [
    MarkdownParser.BlockParser,
  ], MarkdownParser.Config> {
}
export namespace MarkdownParser {
  export interface Config {
  }
  export interface SegmentParser extends
    Markdown<'segment'>,
    Parser<HTMLElement, [
      BlockParser.CodeBlockParser.SegmentParser,
      BlockParser.MathBlockParser.SegmentParser,
      BlockParser.ExtensionParser.SegmentParser,
      SourceParser.ContentLineParser,
      SourceParser.BlankLineParser,
    ], Config> {
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
    ], Config> {
  }
  export namespace BlockParser {
    interface Block<T> extends Markdown<['block', T]> { }
    export interface NewlineParser extends
      Block<'newline'>,
      Parser<never, [
        SourceParser.BlankLineParser,
      ], Config> {
    }
    export interface HorizontalRuleParser extends
      // ---
      Block<'horizontalrule'>,
      Parser<HTMLHRElement, [
        SourceParser.ContentLineParser,
      ], Config> {
    }
    export interface HeadingParser extends
      // # Title
      Block<'header'>,
      Parser<HTMLHeadingElement, [
        InlineParser.ExtensionParser.IndexerParser,
        InlineParser,
      ], Config> {
    }
    export interface UListParser extends
      // - item
      Block<'ulist'>,
      Parser<HTMLUListElement, [
        UListParser.ListItemParser,
      ], Config> {
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
          ], Config>,
        ], Config> {
      }
    }
    export interface OListParser extends
      // 0. item
      Block<'olist'>,
      Parser<HTMLOListElement, [
        OListParser.ListItemParser,
      ], Config> {
    }
    export namespace OListParser {
      export interface ListItemParser extends
        Block<'olist/listitem'>,
        Parser<HTMLLIElement, [
          Parser<HTMLElement | Text, [
            SourceParser.UnescapableSourceParser,
            InlineParser,
          ], Config>,
          Parser<HTMLUListElement | HTMLOListElement, [
            UListParser,
            OListParser,
            IListParser,
          ], Config>,
        ], Config> {
      }
    }
    export interface IListParser extends
      // + item
      Block<'ilist'>,
      Parser<HTMLUListElement, [
        IListParser.ListItemParser,
      ], Config> {
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
      ], Config> {
    }
    export namespace DListParser {
      export interface TermParser extends
        Block<'dlist/term'>,
        Parser<HTMLElement, [
          InlineParser.ExtensionParser.IndexerParser,
          InlineParser,
        ], Config> {
      }
      export interface DescriptionParser extends
        Block<'dlist/description'>,
        Parser<HTMLElement, [
          InlineParser,
        ], Config> {
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
      ], Config> {
    }
    export namespace TableParser {
      export interface RowParser<P extends RowParser.CellParser.IncellParser> extends
        Block<'table/row'>,
        Parser<HTMLTableRowElement, [
          RowParser.CellParser<P>,
        ], Config> {
      }
      export namespace RowParser {
        export interface CellParser<P extends CellParser.IncellParser> extends
          Block<'table/row/cell'>,
          Parser<HTMLTableDataCellElement, [
            P,
          ], Config> {
        }
        export namespace CellParser {
          export type IncellParser = DataParser | AlignParser;
          export interface DataParser extends
            Block<'table/row/cell/data'>,
            Parser<HTMLElement | Text, [
              InlineParser,
            ], Config> {
          }
          export interface AlignParser extends
            Block<'table/row/cell/align'>,
            Parser<Text, [
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
              SourceParser.UnescapableSourceParser,
            ], Config> {
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
      ], Config> {
    }
    export namespace BlockquoteParser {
      export interface SegmentParser extends
        Block<'blockquote/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
          SourceParser.ContentLineParser,
        ], Config> {
      }
      export interface TextParser extends
        Block<'blockquote/text'>,
        Parser<HTMLQuoteElement, [
          TextParser,
          AutolinkParser,
        ], Config> {
      }
      export interface SourceParser extends
        Block<'blockquote/source'>,
        Parser<HTMLQuoteElement, [
          SourceParser,
          MarkdownParser,
        ], Config> {
      }
    }
    export interface CodeBlockParser extends
      // ```
      // abc
      // ```
      Block<'codeblock'>,
      Parser<HTMLPreElement, [
        AutolinkParser,
      ], Config> {
    }
    export namespace CodeBlockParser {
      export interface SegmentParser extends
        Block<'codeblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], Config> {
      }
    }
    export interface MathBlockParser extends
      // $$
      // expr
      // $$
      Block<'mathblock'>,
      Parser<HTMLDivElement, [
        SourceParser.EscapableSourceParser,
      ], Config> {
    }
    export namespace MathBlockParser {
      export interface SegmentParser extends
        Block<'mathblock/segment'>,
        Parser<never, [
          SourceParser.ContentLineParser,
        ], Config> {
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
      ], Config> {
    }
    export namespace ExtensionParser {
      export interface SegmentParser extends
        Block<'extension/segment'>,
        Parser<HTMLElement, [
          FigParser.SegmentParser,
          FigureParser.SegmentParser,
          ExampleParser.SegmentParser,
          PlaceholderParser.SegmentParser,
        ], Config> {
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
            ], Config>,
            SourceParser.EmptyLineParser,
            InlineParser,
          ], Config>,
        ], Config> {
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
              ], Config>,
              SourceParser.EmptyLineParser,
              Parser<never, [
                SourceParser.BlankLineParser,
                SourceParser.ContentLineParser,
              ], Config>,
            ], Config>,
          ], Config> {
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
            ], Config>,
          ], Config> {
        }
      }
      export interface ExampleParser extends
        // ~~~example
        // ~~~
        Block<'extension/example'>,
        Parser<HTMLElement, Parser<HTMLElement, [], Config>[], Config> {
      }
      export namespace ExampleParser {
        export interface SegmentParser extends
          Block<'extension/example/segment'>,
          Parser<never, [], Config> {
        }
      }
      export interface PlaceholderParser extends
        Block<'extension/placeholder'>,
        Parser<HTMLElement, [], Config> {
      }
      export namespace PlaceholderParser {
        export interface SegmentParser extends
          Block<'extension/placeholder/segment'>,
          Parser<never, [], Config> {
        }
      }
    }
    export interface ParagraphParser extends
      // abc
      Block<'paragraph'>,
      Parser<HTMLParagraphElement, [
        ParagraphParser.MentionParser,
        InlineParser,
      ], Config> {
    }
    export namespace ParagraphParser {
      export interface MentionParser extends
        // abc
        Block<'paragraph/mention'>,
        Parser<HTMLSpanElement, [
          ParagraphParser.MentionParser.AddressParser,
          ParagraphParser.MentionParser.QuotationParser,
        ], Config> {
      }
      export namespace MentionParser {
        export interface AddressParser extends
          // >0a
          Block<'paragraph/mention/address'>,
          Parser<HTMLAnchorElement, [
            InlineParser.LinkParser,
            InlineParser.LinkParser,
          ], Config> {
        }
        export interface QuotationParser extends
          // > text
          Block<'paragraph/mention/quotation'>,
          Parser<HTMLSpanElement, [
            AutolinkParser,
            AutolinkParser,
          ], Config> {
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
    ], Config> {
  }
  export namespace InlineParser {
    interface Inline<T> extends Markdown<['inline', T]> { }
    export interface AnnotationParser extends
      // ((abc))
      Inline<'annotation'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config> {
    }
    export interface ReferenceParser extends
      // [[abc]]
      Inline<'reference'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config> {
    }
    export interface TemplateParser extends
      // {{ abc }}
      Inline<'template'>,
      Parser<HTMLSpanElement | Text, [
        SourceParser.CharParser.ExclamationParser,
        InlineParser,
      ], Config> {
    }
    export interface ExtensionParser extends
      // [#abc]
      Inline<'extension'>,
      Parser<HTMLElement, [
        ExtensionParser.IndexParser,
        ExtensionParser.LabelParser,
        ExtensionParser.DataParser,
        ExtensionParser.PlaceholderParser,
      ], Config> {
    }
    export namespace ExtensionParser {
      export interface IndexParser extends
        // [#index]
        Inline<'extension/index'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ], Config> {
      }
      export interface IndexerParser extends
        // [#index]
        Inline<'extension/indexer'>,
        Parser<HTMLSpanElement, [
          IndexParser,
        ], Config> {
      }
      export interface LabelParser extends
        // $group-name
        // [$group-name]
        Inline<'extension/label'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
          LinkParser,
        ], Config> {
      }
      export interface DataParser extends
        // [~name]
        // [~name=value]
        // [~name=value|text]
        Inline<'extension/data'>,
        Parser<HTMLSpanElement, [
          SourceParser.UnescapableSourceParser,
          InlineParser,
        ], Config> {
      }
      export interface PlaceholderParser extends
        // [^abc]
        Inline<'extension/placeholder'>,
        Parser<HTMLSpanElement, [
          InlineParser,
        ], Config> {
      }
    }
    export interface LinkParser extends
      // {uri}
      // [abc]{uri}
      Inline<'link'>,
      Parser<HTMLAnchorElement, [
        LinkParser.ContentParser,
        LinkParser.ParamParser,
      ], Config> {
    }
    export namespace LinkParser {
      export interface ContentParser extends
        Inline<'link/content'>,
        Parser<DocumentFragment, [
          InlineParser,
        ], Config> {
      }
      export interface ParamParser extends
        Inline<'link/param'>,
        Parser<DocumentFragment, [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ], Config> {
      }
      export namespace ParamParser {
        export interface UriParser extends
          Inline<'link/uri'>,
          Parser<Text, [
            UriParser.BracketParser,
            SourceParser.UnescapableSourceParser,
          ], Config> {
        }
        export namespace UriParser {
          export interface BracketParser extends
            Inline<'link/uri/bracket'>,
            Parser<Text, Parser<Text, [
              BracketParser,
              SourceParser.UnescapableSourceParser,
            ], Config>[], Config> {
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
      ], Config> {
    }
    export namespace MediaParser {
      export interface TextParser extends
        Inline<'media/text'>,
        Parser<(HTMLElement | Text)[], [
          SourceParser.TextParser,
        ], Config> {
      }
      export interface ParamParser extends
        Inline<'media/param'>,
        Parser<Text[], [
          LinkParser.ParamParser.UriParser,
          HTMLParser.ParamParser.AttributeParser,
        ], Config> {
      }
    }
    export interface RubyParser extends
      // [AB](a b)
      Inline<'ruby'>,
      Parser<HTMLElement, [
        RubyParser.TextParser,
        RubyParser.TextParser,
      ], Config> {
    }
    export namespace RubyParser {
      export interface TextParser extends
        Inline<'ruby/text'>,
        Parser<(HTMLElement | Text)[], [
          HTMLEntityParser,
          SourceParser.TextParser,
        ], Config> {
      }
    }
    export interface HTMLParser extends
      // <small>abc</small>
      Inline<'html'>,
      Parser<HTMLElement, [
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
          HTMLParser.ContentParser,
        ], Config>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ], Config>,
        Parser<HTMLElement, [
          HTMLParser.ParamParser,
        ], Config>,
      ], Config> {
    }
    export namespace HTMLParser {
      export interface ParamParser extends
        Inline<'html/param'>,
        Parser<Text[], [
          ParamParser.AttributeParser,
        ], Config> {
      }
      export namespace ParamParser {
        export interface AttributeParser extends
          Inline<'html/param/attribute'>,
          Parser<Text, [
            SourceParser.UnescapableSourceParser,
            SourceParser.CharParser.EqualParser,
            SourceParser.EscapableSourceParser,
          ], Config> {
        }
      }
      export interface ContentParser extends
        Inline<'html/content'>,
        Parser<(HTMLElement | Text)[], [
          InlineParser,
        ], Config> {
      }
    }
    export interface CommentParser extends
      // <# comment #>
      Inline<'comment'>,
      Parser<HTMLElement, [], Config> {
    }
    export interface InsertionParser extends
      // ++abc++
      Inline<'insertion'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config> {
    }
    export interface DeletionParser extends
      // ~~abc~~
      Inline<'deletion'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config> {
    }
    export interface EmphasisParser extends
      // *abc*
      Inline<'emphasis'>,
      Parser<HTMLElement, [
        StrongParser,
        InlineParser,
      ], Config> {
    }
    export interface StrongParser extends
      // **abc**
      Inline<'strong'>,
      Parser<HTMLElement, [
        InlineParser,
      ], Config> {
    }
    export interface CodeParser extends
      // `abc`
      Inline<'code'>,
      Parser<HTMLElement | Text, [
        Parser<HTMLElement, [
          SourceParser.UnescapableSourceParser,
        ], Config>,
        SourceParser.UnescapableSourceParser,
      ], Config> {
    }
    export interface MathParser extends
      // ${expr}$
      Inline<'math'>,
      Parser<HTMLSpanElement, [
        SourceParser.EscapableSourceParser,
      ], Config> {
    }
    export interface HTMLEntityParser extends
      // &copy;
      Inline<'htmlentity'>,
      Parser<Text, [], Config> {
    }
    export interface ShortmediaParser extends
      // !https://host
      Inline<'shortmedia'>,
      Parser<HTMLElement, [
        MediaParser,
      ], Config> {
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
      ], Config> {
    }
    export namespace AutolinkParser {
      export interface UriParser extends
        // https://host
        Inline<'uri'>,
        Parser<HTMLAnchorElement, [
          LinkParser,
        ], Config> {
      }
      export interface EmailParser extends
        // account@host
        Inline<'email'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config> {
      }
      export interface ChannelParser extends
        // @account#tag
        Inline<'channel'>,
        Parser<HTMLAnchorElement, [
          InlineParser.AutolinkParser.AccountParser,
          InlineParser.AutolinkParser.HashtagParser,
        ], Config> {
      }
      export interface AccountParser extends
        // @account
        Inline<'account'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config> {
      }
      export interface HashtagParser extends
        // #tag
        Inline<'hashtag'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config> {
      }
      export interface HashrefParser extends
        // #1
        Inline<'hashref'>,
        Parser<HTMLAnchorElement, [
          SourceParser.UnescapableSourceParser,
        ], Config> {
      }
    }
    export interface BracketParser extends
      // [abc]
      Inline<'bracket'>,
      Parser<HTMLElement | Text, InlineParser[], Config> {
    }
  }
  export interface AutolinkParser extends
    Markdown<'autolink'>,
    Parser<HTMLElement | Text, [
      InlineParser.AutolinkParser,
      SourceParser.NewlineParser,
      SourceParser.UnescapableSourceParser,
    ], Config> {
  }
  export namespace SourceParser {
    interface Source<T> extends Markdown<['source', T]> { }
    export interface TextParser extends
      // abc
      Source<'text'>,
      Parser<HTMLBRElement | HTMLSpanElement | Text, [], Config> {
    }
    export interface NewlineParser extends
      // abc
      Source<'newline'>,
      Parser<HTMLBRElement, [TextParser], Config> {
    }
    export interface EscapableSourceParser extends
      // abc
      Source<'escsource'>,
      Parser<Text, [], Config> {
    }
    export interface UnescapableSourceParser extends
      // abc
      Source<'unescsource'>,
      Parser<Text, [], Config> {
    }
    export namespace CharParser {
      export interface ExclamationParser extends
        // !
        Source<'char/exclamation'>,
        Parser<Text, [], Config> {
      }
      export interface EqualParser extends
        // =
        Source<'char/equal'>,
        Parser<Text, [], Config> {
      }
    }
    export interface ContentLineParser extends
      Source<'contentline'>,
      Parser<never, [], Config> {
    }
    export interface BlankLineParser extends
      Source<'blankline'>,
      Parser<never, [], Config> {
    }
    export interface EmptyLineParser extends
      Source<'emptyline'>,
      Parser<never, [], Config> {
    }
    export interface AnyLineParser extends
      Source<'anyline'>,
      Parser<never, [], Config> {
    }
  }
}
