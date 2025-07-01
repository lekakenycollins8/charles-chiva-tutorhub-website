export interface Resource {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isPaid: boolean;
  price: number | null;
  category: string;
  downloads: number;
}

export interface ResourceResponse {
  success: boolean;
  data: Resource[];
  error: string | null;
}

export interface SingleResourceResponse {
  success: boolean;
  data: Resource | null;
  error: string | null;
}
