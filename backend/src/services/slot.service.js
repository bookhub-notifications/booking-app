import { pool } from "../config/db.js";

export const createSlotService = async ({
  provider_id,
  service_id,
  date,
  start_time,
  end_time,
}) => {
  const overlapping =
    await pool.query(
      `
      SELECT id
      FROM availability_slots
      WHERE provider_id = $1
      AND slot_date = $2
      AND (
        start_time < $4
        AND end_time > $3
      )
      LIMIT 1
      `,
      [
        provider_id,
        date,
        start_time,
        end_time,
      ]
    );

  if (
    overlapping.rows.length > 0
  ) {
    throw new Error(
      "OVERLAPPING_SLOT"
    );
  }

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
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      'available'
    )
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
  s.id,
  s.provider_id,
  s.service_id,
  s.slot_date,
  s.start_time,
  s.end_time,

  r.id AS reservation_id,

  CASE
    WHEN r.id IS NOT NULL
    THEN 'booked'
    ELSE 'available'
  END AS status,

  sv.title AS service_title

FROM availability_slots s
JOIN services sv
  ON sv.id = s.service_id
LEFT JOIN reservations r
  ON r.slot_id = s.id
WHERE s.provider_id = $1
ORDER BY
  s.slot_date,
  s.start_time
    `,
    [provider_id]
  );

  return result.rows;
};

export const deleteSlotService = async (
  slot_id,
  provider_id
) => {
  const result = await pool.query(
    `
    DELETE FROM availability_slots
    WHERE id = $1
    AND provider_id = $2
    RETURNING *
    `,
    [slot_id, provider_id]
  );

  return result.rows[0];
};