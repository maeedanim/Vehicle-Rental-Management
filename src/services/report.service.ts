import type {
  RentalReportQuery,
  MonthlyRentalReport,
} from '../types/report.types.js';

import type { RentalRepository } from '../repositories/rental.repository.js';

export class ReportService {
  constructor(
    private readonly rentalRepository: RentalRepository,
  ) {}

  async getMonthlyRentalReport(
    query: RentalReportQuery,
  ): Promise<MonthlyRentalReport> {
    const rows = await this.rentalRepository.getMonthlyRentalReport(
      query.month,
      query.vehicleId,
    );

    const vehicles = rows.map((row) => ({
      id: row.id,
      name: row.name,
      totalBookings: Number(row.total_bookings),
      daysRented: Number(row.days_rented),
      revenue: Number(row.revenue),
    }));

    const highestRevenueVehicle =
      vehicles.length > 0
        ? vehicles.reduce((highest, vehicle) =>
            vehicle.revenue > highest.revenue ? vehicle : highest,
          )
        : null;

    return {
      month: query.month,
      vehicles,
      highestRevenueVehicle,
    };
  }
}