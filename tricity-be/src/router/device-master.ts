import { isAuthenticated } from "../middleware/authenticate";
import DeviceMaster from "../model/DeviceMaster";
import {
  createDeviceMasterSchema,
  updateDeviceMasterSchema,
  paginationSchema,
} from "../validator/device-master";
import { bulkDeleteDeviceMasterSchema } from "../validator/device-master";
import { Request, Response, Router } from "express";
import multer from "multer";
import { fileImportQueue } from "../worker/file-import-queue";

const createDeviceMaster = async (req: Request, res: Response) => {
  const parsed = createDeviceMasterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const data = parsed.data;
  const organizationId = (req.user as any).organizationId;

  const device = await DeviceMaster.create({ ...data, organizationId });
  res.status(201).json(device);
};

const getDeviceMasters = async (req: Request, res: Response) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { page, limit } = parsed.data;
  const organizationId = (req.user as any).organizationId;

  const [devices, total] = await Promise.all([
    DeviceMaster.find({ organizationId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    DeviceMaster.countDocuments({ organizationId }),
  ]);

  res.json({
    data: devices,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

const getDeviceMasterById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const organizationId = (req.user as any).organizationId;

  const device = await DeviceMaster.findOne({ _id: id, organizationId });
  if (!device) return res.status(404).json({ message: "Device not found" });

  res.json(device);
};

const updateDeviceMaster = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsed = updateDeviceMasterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const organizationId = (req.user as any).organizationId;
  const updated = await DeviceMaster.findOneAndUpdate(
    { _id: id, organizationId },
    parsed.data,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: "Device not found" });
  res.json(updated);
};

const deleteDeviceMaster = async (req: Request, res: Response) => {
  const { id } = req.params;
  const organizationId = (req.user as any).organizationId;

  const deleted = await DeviceMaster.findOneAndDelete({
    _id: id,
    organizationId,
  });
  if (!deleted) return res.status(404).json({ message: "Device not found" });

  res.json({ message: "Deleted successfully" });
};

const bulkDeleteDeviceMasters = async (req: Request, res: Response) => {
  const parsed = bulkDeleteDeviceMasterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const { ids } = parsed.data;
  const organizationId = (req.user as any).organizationId;

  const result = await DeviceMaster.deleteMany({
    _id: { $in: ids },
    organizationId,
  });

  res.json({
    message: `${result.deletedCount} device(s) deleted successfully.`,
  });
};

const router = Router();

// @ts-ignore
router.post("/", isAuthenticated, createDeviceMaster);
// @ts-ignore
router.get("/", isAuthenticated, getDeviceMasters);
// @ts-ignore
router.get("/:id", isAuthenticated, getDeviceMasterById);
// @ts-ignore
router.put("/:id", isAuthenticated, updateDeviceMaster);
// @ts-ignore
router.delete("/bulk", isAuthenticated, bulkDeleteDeviceMasters);
// @ts-ignore
router.delete("/:id", isAuthenticated, deleteDeviceMaster);

const upload = multer({ dest: "uploads/" });
router.post(
  "/import",
  isAuthenticated,
  upload.single("file"),
  // @ts-ignore
  async (req, res) => {
    try {
      const filePath = (req as any)?.file?.path;
      if (!filePath)
        return res.status(400).json({ error: "File not uploaded" });

      const job = await fileImportQueue.add("process-file", {
        filePath,
        organizationId: (req.user as any).organizationId,
      });

      return res.status(200).json({ message: "File received", jobId: job.id });
    } catch (error) {
      console.error("Import error:", error);
      return res.status(500).json({ error: "Failed to import file" });
    }
  }
);

export default router;
