type noticias = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: Array<string>;
  ['content:encoded']: string;
};

export interface INoticiasXml {
  channel: {
    title: string;
    item: Array<noticias>;
  };
}
