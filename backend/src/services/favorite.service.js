import { pool } from "../config/db.js";

export const addFavoriteService = async (
  customer_id,
  service_id
) => {
  const result = await pool.query(
    `
    INSERT INTO favorites (
      customer_id,
      service_id
    )
    VALUES ($1, $2)
    ON CONFLICT (
      customer_id,
      service_id
    )
    DO NOTHING
    RETURNING *
    `,
    [customer_id, service_id]
  );

  return result.rows[0];
};

export const removeFavoriteService =
  async (
    customer_id,
    service_id
  ) => {
    await pool.query(
      `
      DELETE FROM favorites
      WHERE customer_id = $1
      AND service_id = $2
      `,
      [customer_id, service_id]
    );
  };

export const getFavoritesService =
  async (customer_id) => {
    const result = await pool.query(
      `
      SELECT
        s.*
      FROM favorites f

      JOIN services s
        ON s.id = f.service_id

      WHERE f.customer_id = $1

      ORDER BY f.created_at DESC
      `,
      [customer_id]
    );

    return result.rows;
  };