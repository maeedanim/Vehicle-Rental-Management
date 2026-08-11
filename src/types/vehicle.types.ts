export interface Vehicle {
  id: number;
  name: string;
  plateNumber: string;
  category: string;
  dailyRate: number;
  photoPath: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVehicleRequest {
  name: string;
  plateNumber: string;
  category: string;
  dailyRate: number;
}

export interface UpdateVehicleRequest {
  name?: string;
  plateNumber?: string;
  category?: string;
  dailyRate?: number;
}

export interface VehicleListQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface VehicleDatabaseRow {
  id: number;
  name: string;
  plate_number: string;
  category: string;
  daily_rate: string | number;
  photo_path: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}