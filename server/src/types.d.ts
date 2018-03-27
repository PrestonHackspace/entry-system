/// <reference types="react" />

declare module 'oy-vey' {
  export const Table: React.DetailedHTMLFactory<Oy.OyTableElementAttributes, HTMLTableElement>;
  export const TBody: React.DetailedHTMLFactory<
    Oy.OyTBodyElementAttributes,
    HTMLTableSectionElement
  >;
  export const TR: any; //React.DetailedHTMLFactory<Oy.OyTRElementAttributes, HTMLTableRowElement>;
  export const TD: any; //React.DetailedHTMLFactory<Oy.OyTDElementAttributes, HTMLTableDataCellElement>;
  export const Img: React.DetailedHTMLFactory<Oy.OyImgElementAttributes, HTMLImageElement>;
  export const A: React.DetailedHTMLFactory<Oy.OyAElementAttributes, HTMLAnchorElement>;
  export const renderTemplate: (
    jsx: JSX.Element,
    opts: Oy.RenderOptions,
    template?: (renderOpts: Oy.CustomTemplateRenderOptions) => string
  ) => string;

  const oy: {
    Table: typeof Table;
    TBody: typeof TBody;
    TR: typeof TR;
    TD: typeof TD;
    Img: typeof Img;
    A: typeof A;
    renderTemplate: typeof renderTemplate;
  };
  export default oy;
}

declare namespace Oy {
  interface OyElementAttributes {
    width?: number | string;
    height?: number | string;
    align?: string;
    background?: string;
    bgcolor?: string;
    border?: number | string;
    valign?: string;
  }

  interface OyTBodyElementAttributes
    extends React.HTMLAttributes<HTMLTableSectionElement>,
      OyElementAttributes {}
  interface OyTableElementAttributes
    extends React.TableHTMLAttributes<HTMLTableElement>,
      OyElementAttributes {}
  interface OyTRElementAttributes
    extends React.HTMLAttributes<HTMLTableRowElement>,
      OyElementAttributes {}
  interface OyTDElementAttributes
    extends React.TdHTMLAttributes<HTMLTableDataCellElement>,
      OyElementAttributes {}
  interface OyImgElementAttributes
    extends React.ImgHTMLAttributes<HTMLImageElement>,
      OyElementAttributes {}
  interface OyAElementAttributes
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
      OyElementAttributes {}

  type RenderOptions = {
    title: string;
    previewText: string;
    headCSS?: string;
    bgColor?: string;
    lang?: string;
    dir?: 'ltr' | 'rtl';
  };

  type CustomTemplateRenderOptions = RenderOptions & {
    bodyContent: string;
  };
}
