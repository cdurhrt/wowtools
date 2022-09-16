export interface NewsBillboard {
  id: any;
  name: any;
  type: any;
  imgUrl: any;
  refreshAt: any;
  linksList: NewsLink[];
}
export interface NewsBillboardTag {
  id: any;
  name: any;
  type: any;
  disabled: boolean;
  sort: number;
}
export interface NewsLink {
  id: any;
  href: any;
  rank: any;
  title: any;
  oinfo: any;
}
