export interface NewsBillboard {
  id: any;
  name: any;
  type: any;
  imgUrl: any;
  refreshAt: any;
  linksList: NewsLink[];
}

export interface NewsLink {
  id: any;
  href: any;
  rank: any;
  title: any;
  oinfo: any;
}
