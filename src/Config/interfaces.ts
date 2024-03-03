export interface ILoadingButton {
  btn:
    | ""
    | "NEW_DESIGN"
    | "LINK_AND_ICON"
    | "ABOUT_ME"
    | "EDIT_COMMENT"
    | "EDIT_DESIGN"
    | "NEW_FILTER";
}

export interface IFilter {
  id?: string;
  filter: string;
}

export interface IDesign {
  date: Date;
  filter: string;
  id?: string;
  design: null | string;
  title: string;
  decription: string;
}

export interface IIcone {
  icon: string;
}

export interface ILinksSocialMidia {
  instagram: string;
  linkedin: string;
  whatsapp: string;
}

export interface ILinksAndIcon {
  icon: string | null;
  links: ILinksSocialMidia;
}

export interface IAboutMe {
  description: string;
}

export interface IComment {
  avatar: string | null;
  name: string;
  description: string;
}
