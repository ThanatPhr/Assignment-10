const express = require("express");
const {
  getHospitals,
  createHospital,
  getHospital,
  deleteHospital,
  updateHospital,
  getVacCenters,
} = require("../controller/hospitals");

const appointmentRouter = require("./appointments");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use("/:hospitalId/appointments", appointmentRouter);

router.route("/vacCenters").get(getVacCenters);
router
  .route("/")
  .get(getHospitals)
  .post(protect, authorize("admin"), createHospital);
router
  .route("/:id")
  .get(getHospital)
  .delete(protect, authorize("admin"), deleteHospital)
  .put(protect, authorize("admin"), updateHospital);

module.exports = router;
