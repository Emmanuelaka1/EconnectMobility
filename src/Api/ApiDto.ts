// Types de base pour l'API EconnectMobility VTC
export interface BaseDto {
  ucreation?: string;
  umodification?: string;
  dcreation?: string;
  dmodification?: string;
}

export interface ResponseDto<T = any> {
  statut: boolean;
  message: string;
  data?: T;
}

export interface ResponseMessage {
  message: string;
}

export interface FileInfo {
  name: string;
  url: string;
}

export interface DataFileDto {
  name: string;
  data: string; // base64 encoded
}

// DTOs principaux
export interface CarDto extends BaseDto {
  referenceCar?: string;
  immatriculation?: string;
  marque?: string;
  modele?: string;
  couleur?: string;
  carburant?: string;
  anneeAchat?: string;
  kilometrage?: string;
  prixAchat?: number;
  dateAchat?: string;
  dateMiseEnCirculation?: string;
  documents?: DocumentDto[];
}

export interface DocumentDto extends BaseDto {
  idDocument?: number;
  typeDocument?: string;
  description?: string;
  dateDocument?: string;
  fileName?: string;
  pathFile?: string;
  parentId?: string;
  parentType?: string;
  urlFile?: string;
  dataFile?: DataFileDto;
}

export interface RecetteDto extends BaseDto {
  readonly idrecette?: number;
  car?: CarDto;
  amount?: number;
  dateRecette?: string;
  commentRecette?: string;
  week?: string;
  ideecette?: number;
}

export interface OperationDto extends BaseDto {
  readonly idoperation?: number;
  dateOperation?: string;
  typeOperation?: string;
  typeDepense?: string;
  description?: string;
  amount?: number;
  parentId?: string;
  parentType?: string;
  documentId?: string;
  referenceTransaction?: string;
  idperation?: number;
  documents?: DocumentDto[];
}

export interface ParamsDto extends BaseDto {
  name?: string;
  value?: string;
  description?: string;
  type?: string;
}

export interface WeekDto extends BaseDto {
  id: number;
  week: string;
  dateStart?: string;
  dateEnd?: string;
  status?: 'active' | 'archived';
}

export interface MenuDto extends BaseDto {
  child?: string;
  parentId?: string;
  title?: string;
  typetache?: string;
  numeroOrder?: number;
  orderRacine?: number;
  niveau?: number;
  routerLink?: string;
  url?: string;
  icon?: string;
  target?: string;
  hasSubMenu?: boolean;
  status?: boolean;
  idMenu?: string;
}

export interface ProfilsDto extends BaseDto {
  role?: string;
  menu?: MenuDto;
  ajouter?: boolean;
  modifier?: boolean;
  supprimer?: boolean;
  consulter?: boolean;
  valider?: boolean;
  status?: boolean;
}

export interface RolesDto extends BaseDto {
  idrole?: string;
  libelleRole?: string;
  status?: boolean;
  profils?: ProfilsDto[];
}

export interface UsersDto extends BaseDto {
  username?: string;
  password?: string;
  newPassword?: string;
  token?: string;
  refreshToken?: string;
  nbconnexion?: number;
  nom?: string;
  prenoms?: string;
  email?: string;
  telephone?: string;
  role?: string;
  status?: string;
  etat?: number;
  profils?: ProfilsDto[];
  menus?: MenuDto[];
}