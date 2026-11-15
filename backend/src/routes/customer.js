import express from "express";

import {
  getCustomerReservations,
  getApprovedServices,
  getCustomerAnalytics,
  getServiceById,
} from "../controllers/customer.controller.js";

const router = express.Router();

/*
=====================================
PUBLIC SERVICES
=====================================
*/

router.get(
  "/services",
  getApprovedServices
);

router.get(
  "/service/:id",
  getServiceById
);

/*
=====================================
CUSTOMER ANALYTICS
=====================================
*/

router.get(
  "/:id/analytics",
  getCustomerAnalytics
);

/*
=====================================
CUSTOMER RESERVATIONS
=====================================
*/

router.get(
  "/:id/reservations",
  getCustomerReservations
);

export default router;