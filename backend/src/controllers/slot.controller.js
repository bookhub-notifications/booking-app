import { pool } from "../config/db.js";

import {
  createSlotService,
  getMySlotsService,
  deleteSlotService,
} from "../services/slot.service.js";

export const createSlot = async (
  req,
  res
) => {
  try {
    const providerResult =
      await pool.query(
        `
        SELECT id
        FROM providers
        WHERE user_id = $1
        `,
        [req.user.id]
      );

    if (
      providerResult.rows.length === 0
    ) {
      return res.status(404).json({
        error: "Provider not found",
      });
    }

    const providerId =
      providerResult.rows[0].id;

    const result =
      await createSlotService({
        provider_id: providerId,
        ...req.body,
      });

    res.json(result);
  } catch (error) {
    console.error(error);

    if (
      error.message ===
      "OVERLAPPING_SLOT"
    ) {
      return res.status(400).json({
        error:
          "Esiste già uno slot in questa fascia oraria",
      });
    }

    res.status(500).json({
      error:
        "Internal server error",
    });
  }
};

export const getAvailableSlots =
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
          SELECT
            id,
            slot_date,
            start_time,
            end_time,
            service_id
          FROM availability_slots
          WHERE service_id = $1
          AND status = 'available'
          ORDER BY slot_date, start_time
          `,
          [req.params.id]
        );

      res.json(result.rows);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Internal server error",
      });
    }
  };

export const getMySlots = async (
  req,
  res
) => {
  try {
    const providerResult =
      await pool.query(
        `
        SELECT id
        FROM providers
        WHERE user_id = $1
        `,
        [req.user.id]
      );

    if (
      providerResult.rows.length === 0
    ) {
      return res.status(404).json({
        error: "Provider not found",
      });
    }

    const slots =
      await getMySlotsService(
        providerResult.rows[0].id
      );

    res.json(slots);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error:
        "Internal server error",
    });
  }
};
export const deleteSlot =
  async (req, res) => {
    try {
      const providerResult =
        await pool.query(
          `
          SELECT id
          FROM providers
          WHERE user_id = $1
          `,
          [req.user.id]
        );

      if (
        providerResult.rows.length ===
        0
      ) {
        return res.status(404).json({
          error:
            "Provider not found",
        });
      }

      const deletedSlot =
        await deleteSlotService(
          req.params.id,
          providerResult.rows[0].id
        );

      if (!deletedSlot) {
        return res.status(404).json({
          error: "Slot not found",
        });
      }

      res.json({
        message:
          "Slot deleted successfully",
      });
    } catch (error) {
      console.error(error);

      if (
        error.message ===
        "SLOT_HAS_HISTORY"
      ) {
        return res.status(400).json({
          error:
            "Questo slot contiene storico prenotazioni e non può essere eliminato.",
        });
      }

      res.status(500).json({
        error:
          "Internal server error",
      });
    }
  };

