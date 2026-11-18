import { pool } from "../config/db.js";

export const createSlotService = async ({
  provider_id,
  service_id,
  date,
  start_time,
  end_time,
}) => {
  const result = await pool.query(
    `
    INSERT INTO availability_slots (
      provider_id,
      service_id,
      slot_date,
      start_time,
      end_time,
      status
    )
    VALUES ($1, $2, $3, $4, $5, 'available')
    RETURNING *
    `,
    [
      provider_id,
      service_id,
      date,
      start_time,
      end_time,
    ]
  );

  return result.rows[0];
};

export const getMySlotsService = async (
  provider_id
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      provider_id,
      service_id,
      slot_date,
      start_time,
      end_time,
      status
    FROM availability_slots
    WHERE provider_id = $1
    ORDER BY slot_date, start_time
    `,
    [provider_id]
  );

  return result.rows;
};