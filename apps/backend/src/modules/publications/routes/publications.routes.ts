import { Router } from "express";
import { PublicationController } from "../controllers/PublicationController.js";
import { authenticate } from "../../auth/middleware/authenticate.js";
import { authorize } from "../../auth/middleware/authorize.js";

const router = Router();
const controller = new PublicationController();

router.get("/section", controller.getSection.bind(controller));
router.get("/categories", controller.listCategories.bind(controller));
router.get("/", controller.listPublications.bind(controller));

router.put(
    "/section",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.saveSection.bind(controller),
);

router.post(
    "/categories",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.createCategory.bind(controller),
);

router.put(
    "/categories/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.updateCategory.bind(controller),
);

router.delete(
    "/categories/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.removeCategory.bind(controller),
);

router.post(
    "/",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.createPublication.bind(controller),
);

router.put(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.updatePublication.bind(controller),
);

router.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN", "SUPER_ADMIN"]),
    controller.removePublication.bind(controller),
);

export { router as publicationRoutes };