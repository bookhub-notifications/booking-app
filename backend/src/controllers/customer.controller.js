import { pool } from "../config/db.js";
import { getCustomerReservationsService } from "../services/customer.service.js";
import { getCustomerAnalyticsService } from "../services/customer.analytics.service.js";

export const getCustomerReservations = async (req, res) => {
  res.json(
    await getCustomerReservationsService(
      req.params.id
    )
  );
};

export const getCustomerAnalytics = async (
  req,
  res
) => {
  try {
    const analytics =
      await getCustomerAnalyticsService(
        req.params.id
      );

    res.json(analytics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getApprovedServices = async (
  req,
  res
) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.title,
        s.description,
        s.price,
        s.category,
        s.image_url,

        p.id AS provider_id,
        p.name AS provider_name,
        p.profile_image,
        p.city,
        p.status AS provider_status,

        COALESCE(
          ROUND(
            AVG(r.rating)::numeric,
            1
          ),
          0
        ) AS average_rating,

        COUNT(r.id)::integer
          AS total_reviews

      FROM services s

      LEFT JOIN providers p
        ON p.id = s.provider_id

      LEFT JOIN reviews r
        ON r.provider_id = s.provider_id

      WHERE s.approved = true

      GROUP BY
        s.id,
        s.title,
        s.description,
        s.price,
        s.category,
        s.image_url,
        p.id,
        p.name,
        p.profile_image,
        p.city,
        p.status

      ORDER BY
        average_rating DESC,
        total_reviews DESC,
        s.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getServiceById = async (
  req,
  res
) => {
  try {
    const result = await pool.query(
      `
      SELECT
        s.*,

        p.id AS provider_id,
        p.name AS provider_name,
        p.email AS provider_email,
        p.phone AS provider_phone,
        p.city AS provider_city,
        p.profile_image,
        p.status AS provider_status,

        COALESCE(
          ROUND(
            AVG(r.rating)::numeric,
            1
          ),
          0
        ) AS average_rating,

        COUNT(r.id)::integer
          AS total_reviews

      FROM services s

      LEFT JOIN providers p
        ON p.id = s.provider_id

      LEFT JOIN reviews r
        ON r.provider_id = s.provider_id

      WHERE s.id = $1

      GROUP BY
        s.id,
        p.id,
        p.name,
        p.email,
        p.phone,
        p.city,
        p.profile_image,
        p.status
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Service not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};