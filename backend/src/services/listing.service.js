import { pool } from "../config/db.js";

export const createListingService = async ({
  provider_id,
  title,
  description,
  price,
  category,
  image_url,
}) => {
  const result = await pool.query(
    `
    INSERT INTO services (
      provider_id,
      title,
      description,
      price,
      category,
      approved,
      image_url
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      false,
      $6
    )
    RETURNING *
    `,
    [
      provider_id,
      title,
      description,
      price,
      category,
      image_url,
    ]
  );

  return result.rows[0];
};

export const getProviderServicesService = async (
  provider_id
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      category,
      price,
      description,
      image_url,
      approved
    FROM services
    WHERE provider_id = $1
    ORDER BY title
    `,
    [provider_id]
  );

  return result.rows;
};

export const deleteServiceService = async (
  serviceId,
  providerId
) => {
  const result = await pool.query(
    `
    DELETE FROM services
    WHERE id = $1
    AND provider_id = $2
    RETURNING *
    `,
    [serviceId, providerId]
  );

  return result.rows[0];
};

export const updateServiceService = async (
  serviceId,
  providerId,
  title,
  description,
  price,
  category
) => {
  const result = await pool.query(
    `
    UPDATE services
    SET
      title = $1,
      description = $2,
      price = $3,
      category = $4
    WHERE id = $5
    AND provider_id = $6
    RETURNING *
    `,
    [
      title,
      description,
      price,
      category,
      serviceId,
      providerId,
    ]
  );

  return result.rows[0];
};