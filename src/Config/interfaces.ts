export interface ILoadingButton {
  btn:
    | ""
    | "NEW_DESIGN"
    | "LINK_AND_ICON"
    | "ABOUT_ME"
    | "EDIT_COMMENT"
    | "EDIT_DESIGN";
}

export interface INewDesign {
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