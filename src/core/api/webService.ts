import { 
  ResponseDto, 
  CarDto, 
  RecetteDto, 
  OperationDto, 
  ParamsDto, 
  WeekDto, 
  UsersDto, 
  RolesDto, 
  DocumentDto,
  ResponseMessage,
  FileInfo
} from './dataContratDto';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Configuration des headers par défaut
const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const apiKey = localStorage.getItem('API_KEY');
    const token = localStorage.getItem('token');
    
    if (apiKey) {
      headers['API_KEY'] = apiKey;
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Utilitaire pour les requêtes
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ResponseDto<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: getHeaders(),
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json().then(data => {
    if (data.error) {
      throw new Error(`API Error: ${data.error}`);
    }
    return data;
  });
};

// Services pour les voitures
export const carService = {
  getAllCars: () => apiRequest<CarDto[]>('/cars/getAllCars'),
  getCarById: (referenceCar: string) => apiRequest<CarDto>(`/cars/getCarById/${referenceCar}`),
  saveCar: (car: CarDto) => apiRequest<CarDto>('/cars/saveCar', {
    method: 'POST',
    body: JSON.stringify(car),
  }),
  updateCar: (car: CarDto) => apiRequest<CarDto>('/cars/updateCar', {
    method: 'POST',
    body: JSON.stringify(car),
  }),
  deleteCar: (referenceCar: string) => apiRequest<void>(`/cars/deleteCar/${referenceCar}`, {
    method: 'POST',
  }),
};

// Services pour les recettes
export const recetteService = {
  getAllRecettes: () => apiRequest<RecetteDto[]>('/recettes/getAllRecettes'),
  getRecette: (id: number) => apiRequest<RecetteDto>(`/recettes/getRecette/${id}`),
  getRecettesByDate: (date: string) => apiRequest<RecetteDto[]>(`/recettes/getRecettesByDate/${date}`),
  getRecettesByWeek: (week: string) => apiRequest<RecetteDto[]>(`/recettes/getRecettesByWeek/${week}`),
  getRecettesByCar: (car: string) => apiRequest<RecetteDto[]>(`/recettes/getRecettesByCar/${car}`),
  getRecettesByDateAndCar: (date: string, referenceCar: string) => 
    apiRequest<RecetteDto[]>(`/recettes/getRecettesByDateAndCar/${date}/${referenceCar}`),
  getRecettesByIds: (ids: number[]) => 
    apiRequest<RecetteDto[]>(`/recettes/getRecettesByIds/${ids.join(',')}`),
  saveRecette: (recette: RecetteDto) => apiRequest<RecetteDto>('/recettes/saveRecette', {
    method: 'POST',
    body: JSON.stringify(recette),
  }),
  saveRecettes: (recettes: RecetteDto[]) => apiRequest<RecetteDto[]>('/recettes/saveRecettes', {
    method: 'POST',
    body: JSON.stringify(recettes),
  }),
  updateRecette: (recette: RecetteDto) => apiRequest<RecetteDto>('/recettes/updateRecette', {
    method: 'PUT',
    body: JSON.stringify(recette),
  }),
  updateRecettes: (recettes: RecetteDto[]) => apiRequest<RecetteDto[]>('/recettes/updateRecettes', {
    method: 'PUT',
    body: JSON.stringify(recettes),
  }),
  deleteRecette: (id: number) => apiRequest<void>(`/recettes/deleteRecette/${id}`, {
    method: 'DELETE',
  }),
  deleteRecettes: (ids: number[]) => apiRequest<void>('/recettes/deleteRecettes', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  }),
  deleteRecettesByIds: (ids: number[]) => 
    apiRequest<void>(`/recettes/deleteRecettesByIds/${ids.join(',')}`, {
      method: 'DELETE',
    }),
};

// Services pour les opérations
export const operationService = {
  getAllOperations: () => apiRequest<OperationDto[]>('/operations/getAllOperations'),
  getOperationById: (id: number) => apiRequest<OperationDto>(`/operations/getOperationById/${id}`),
  getOperationsByDate: (date: string) => 
    apiRequest<OperationDto[]>(`/operations/getOperationsByDateOperation/${date}`),
  getOperationsByParentId: (parentId: string) => 
    apiRequest<OperationDto[]>(`/operations/getOperationsByParentId/${parentId}`),
  getOperationsByParentType: (parentId: string, parentType: string) => 
    apiRequest<OperationDto[]>(`/operations/getOperationsByParentType/${parentId}/${parentType}`),
  getOperationsByTypeOperation: (type: string) => 
    apiRequest<OperationDto[]>(`/operations/getOperationsByTypeOperation/${type}`),
  getOperationsByReferenceTransaction: (referenceTransaction: string) => 
    apiRequest<OperationDto[]>(`/operations/getOperationsByReferenceTransaction/${referenceTransaction}`),
  saveOperation: (operation: OperationDto) => apiRequest<OperationDto>('/operations/saveOperation', {
    method: 'POST',
    body: JSON.stringify(operation),
  }),
  saveOperations: (operations: OperationDto[]) => apiRequest<OperationDto[]>('/operations/saveOperations', {
    method: 'POST',
    body: JSON.stringify(operations),
  }),
  updateOperation: (operation: OperationDto) => apiRequest<OperationDto>('/operations/updateOperation', {
    method: 'PUT',
    body: JSON.stringify(operation),
  }),
  updateOperations: (operations: OperationDto[]) => apiRequest<OperationDto[]>('/operations/updateOperations', {
    method: 'PUT',
    body: JSON.stringify(operations),
  }),
  deleteOperation: (id: number) => apiRequest<void>(`/operations/deleteOperation/${id}`, {
    method: 'DELETE',
  }),
  deleteOperations: (ids: number[]) => apiRequest<void>('/operations/deleteOperations', {
    method: 'DELETE',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  }),
};

// Services pour les paramètres
export const paramsService = {
  findAllParams: () => apiRequest<ParamsDto[]>('/params/findAllParams'),
  findAllParamsByType: (type: string) => apiRequest<ParamsDto[]>(`/params/findAllParamsByType/${type}`),
  getParams: (name: string) => apiRequest<ParamsDto>(`/params/getParams/${name}`),
  findParamsByNameAndType: (name: string, type: string) => 
    apiRequest<ParamsDto>(`/params/findParamsByNameAndType/${name}/${type}`),
  saveParams: (params: ParamsDto) => apiRequest<ParamsDto>('/params/saveParams', {
    method: 'POST',
    body: JSON.stringify(params),
  }),
  saveAllParams: (params: ParamsDto[]) => apiRequest<ParamsDto[]>('/params/saveAllParams', {
    method: 'POST',
    body: JSON.stringify(params),
  }),
  updateParams: (params: ParamsDto) => apiRequest<ParamsDto>('/params/updateParams', {
    method: 'PUT',
    body: JSON.stringify(params),
  }),
  deleteParams: (name: string) => apiRequest<void>(`/params/deleteParams/${name}`, {
    method: 'DELETE',
  }),
  deleteMultipleParams: (names: string[]) => apiRequest<void>('/params/deleteParams', {
    method: 'DELETE',
    body: JSON.stringify(names),
  }),
};

// Services pour les semaines
export const weekService = {
  getAllWeeks: () => apiRequest<WeekDto[]>('/weeks/getAllWeeks'),
  getWeekById: (week: string) => apiRequest<WeekDto>(`/weeks/getWeek/${week}`),
  getWeeksByDate: (date: string) => apiRequest<WeekDto[]>(`/weeks/getWeeksByDate/${date}`),
  getWeeksByDateRange: (dateStart: string, dateEnd: string) => 
    apiRequest<WeekDto[]>(`/weeks/getWeeksByDateRange/${dateStart}/${dateEnd}`),
  getAllWeeksByIds: (weeks: string[]) => 
    apiRequest<WeekDto[]>(`/weeks/getAllWeeksByIds/${weeks.join(',')}`),
  findWeeksByDateRange: (dateStart: string, dateEnd: string) => 
    apiRequest<WeekDto[]>(`/weeks/findWeeksByDateRange/${dateStart}/${dateEnd}`),
  saveWeek: (week: WeekDto) => apiRequest<WeekDto>('/weeks/saveWeek', {
    method: 'GET',
    headers: { ...getHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  saveWeeks: (weeks: WeekDto[]) => apiRequest<WeekDto[]>('/weeks/saveWeeks', {
    method: 'GET',
    headers: { ...getHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  updateWeek: (week: WeekDto) => apiRequest<WeekDto>('/weeks/updateWeek', {
    method: 'GET',
    headers: { ...getHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  updateWeeks: (weeks: WeekDto[]) => apiRequest<WeekDto[]>('/weeks/updateWeeks', {
    method: 'GET',
    headers: { ...getHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  deleteWeek: (week: string) => apiRequest<void>(`/weeks/deleteWeek/${week}`, {
    method: 'GET',
  }),
  deleteWeeks: (weeks: string[]) => apiRequest<void>('/weeks/deleteWeeks', {
    method: 'GET',
    headers: { ...getHeaders(), 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
};

// Services pour les utilisateurs
export const userService = {
  authenticate: (user: UsersDto) => apiRequest<UsersDto>('/users/authenticate', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  createUtilisateur: (user: UsersDto) => apiRequest<UsersDto>('/users/createutilisateur', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
};

// Services pour les rôles
export const roleService = {
  findAllRoles: () => apiRequest<RolesDto[]>('/roles/allroles'),
  getRole: (role: string) => apiRequest<RolesDto>(`/roles/findrole/${role}`),
  createRole: (role: RolesDto) => apiRequest<RolesDto>('/roles/createrole', {
    method: 'POST',
    body: JSON.stringify(role),
  }),
  updateRole: (role: RolesDto) => apiRequest<RolesDto>('/roles/updateRole', {
    method: 'POST',
    body: JSON.stringify(role),
  }),
  deleteRole: (idrole: string) => apiRequest<void>(`/roles/deleterole/${idrole}`),
};

// Services pour les documents
export const documentService = {
  getAllDocuments: () => apiRequest<DocumentDto[]>('/documents/getAllDocuments'),
  getDocument: (id: number) => apiRequest<DocumentDto>(`/documents/getDocument/${id}`),
  findDocumentsByParent: (parentId: string, parentType: string) => 
    apiRequest<DocumentDto[]>(`/documents/findDocumentsByParentId?parentId=${parentId}&parentType=${parentType}`),
  getPdf: async (filename: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/documents/${filename}`, {
      headers: getHeaders(),
    });
    return response.blob();
  },
  uploadMultiple: async (files: File[], document: DocumentDto): Promise<ResponseDto<DocumentDto>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('document', JSON.stringify(document));
    
    const response = await fetch(`${API_BASE_URL}/documents/uploadMultiple`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    
    return response.json();
  },
  uploadMultiples: async (files: File[], parentId: string, parentType: string): Promise<ResponseDto<DocumentDto>> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await fetch(`${API_BASE_URL}/documents/uploadMultiples?parentId=${parentId}&parentType=${parentType}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    
    return response.json();
  },
  deleteDocument: (id: number) => apiRequest<void>(`/documents/deleteDocument/${id}`, {
    method: 'DELETE',
  }),
  deleteDocuments: (ids: number[]) => apiRequest<void>('/documents/deleteDocuments', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  }),
  deleteDocumentsByParent: (parentId: string, parentType: string) => 
    apiRequest<void>(`/documents/deleteDocuments/${parentId}/${parentType}`, {
      method: 'DELETE',
    }),
};

// Services pour les fichiers
export const fileService = {
  getListFiles: async (): Promise<FileInfo[]> => {
    const response = await fetch(`${API_BASE_URL}/stores/files`, {
      headers: getHeaders(),
    });
    return response.json();
  },
  getFile: async (filename: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/stores/files/${filename}`, {
      headers: getHeaders(),
    });
    return response.blob();
  },
  uploadFile: async (file: File): Promise<ResponseMessage> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/stores/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    
    return response.json();
  },
  deleteFile: async (filename: string): Promise<ResponseMessage> => {
    const response = await fetch(`${API_BASE_URL}/stores/files/${filename}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Service de test sécurisé
export const testService = {
  securedEndpoint: async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL.replace('/v1', '')}/secured`, {
      headers: getHeaders(),
    });
    return response.text();
  },
};