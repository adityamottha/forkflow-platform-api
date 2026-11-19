import { Router } from "express";

import { AsyncHandler } from "../../../utils/ayncHandler.js";
import { verifyJWT } from "../../../middleware/verifyJWT.middleware.js";

import { addressController } from "../controllers/address.controller.js";

const router: Router = Router();

// ADD ADDRESS
router.post(
  "/",
  verifyJWT,
  AsyncHandler(addressController.addAddress.bind(addressController)),
);

// GET ALL ADDRESSES
router.get(
  "/",
  verifyJWT,
  AsyncHandler(addressController.getAddresses.bind(addressController)),
);

// GET SINGLE ADDRESS
router.get(
  "/:addressId",
  verifyJWT,
  AsyncHandler(addressController.getAddressById.bind(addressController)),
);

// UPDATE ADDRESS
router.patch(
  "/:addressId",
  verifyJWT,
  AsyncHandler(addressController.updateAddress.bind(addressController)),
);

// DELETE ADDRESS
router.delete(
  "/:addressId",
  verifyJWT,
  AsyncHandler(addressController.deleteAddress.bind(addressController)),
);

// SET DEFAULT ADDRESS
router.patch(
  "/:addressId/default",
  verifyJWT,
  AsyncHandler(addressController.setDefaultAddress.bind(addressController)),
);

export default router;
