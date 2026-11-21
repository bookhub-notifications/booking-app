import { pool } from "../config/db.js";

export const getDashboardStatsService =
  async (provider_id) => {
    const services =
      await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM services
        WHERE provider_id = $1
        `,
        [provider_id]
      );

    const slots =
      await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM availability_slots
        WHERE provider_id = $1
        `,
        [provider_id]
      );

    const bookings =
      await pool.query(
        `
        SELECT COUNT(*)::int AS total
        FROM reservations r
        JOIN availability_slots s
          ON s.id = r.slot_id
        WHERE s.provider_id = $1
        AND r.status = 'confirmed'
        `,
        [provider_id]
      );

    return {
      services:
        services.rows[0].total,
      slots:
        slots.rows[0].total,
      bookings:
        bookings.rows[0].total,
      reviews: 0,
    };
  };