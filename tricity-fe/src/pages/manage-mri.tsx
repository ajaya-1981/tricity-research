import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  Checkbox,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Delete,
  Edit,
  Add,
  UploadFile,
  Close,
  Refresh,
} from "@mui/icons-material";
import type { GridColDef } from "@mui/x-data-grid";
import backendApi from "../utils/axios-instance";
import { z } from "zod";

const createDeviceMasterSchema = z.object({
  section: z.string().min(1, "Section is required"),
  deviceType: z.string().min(1, "Device Type is required"),
  brand: z.string().min(1, "Brand is required"),
  deviceModel: z.string().min(1, "Device Model is required"),
  leadAccessories: z.string().min(1, "Lead/Accessories is required"),
  mriCompatible: z.boolean(),
  mriCondition: z.string().optional(),
});

interface DeviceData {
  id: number;
  section: string;
  deviceType: string;
  brand: string;
  deviceModel: string;
  leadAccessories: string;
  mriCompatible: boolean;
  mriCondition?: string;
}

type ValidationErrors = Partial<Record<keyof Omit<DeviceData, "id">, string>>;

const ManageDataPage: React.FC = () => {
  const [data, setData] = useState<DeviceData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeviceData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDownloadSampleCSV = () => {
    const headers = [
      "section",
      "deviceType",
      "brand",
      "deviceModel",
      "leadAccessories",
      "mriCompatible",
      "mriCondition",
    ];

    const sampleData = Array.from({ length: 10 }, (_, index) => ({
      section: `Section ${index + 1}`,
      deviceType: `Type ${index + 1}`,
      brand: `Brand ${index + 1}`,
      deviceModel: `Model ${index + 1}`,
      leadAccessories: `Accessories ${index + 1}`,
      mriCompatible: index % 2 === 0,
      mriCondition: `Condition ${index + 1}`,
    }));

    const csvContent = [
      headers.join(","), // header row
      ...sampleData.map((row) =>
        headers
          .map((key) => {
            const val = row[key as keyof typeof row];
            return typeof val === "string" ? `"${val}"` : val;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sample_device_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const res = await backendApi.get("/api/device-master", {
        params: { page: 1, limit: 100 },
        withCredentials: true,
      });
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch devices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const openModal = (item: DeviceData | null = null) => {
    setIsEditMode(!!item);
    setValidationErrors({});
    setEditingItem(
      item || {
        id: 0,
        section: "",
        deviceType: "",
        brand: "",
        deviceModel: "",
        leadAccessories: "",
        mriCompatible: false,
        mriCondition: "",
      }
    );
    setModalOpen(true);
  };

  const validate = (data: DeviceData) => {
    const result = createDeviceMasterSchema.safeParse({
      section: data.section,
      deviceType: data.deviceType,
      brand: data.brand,
      deviceModel: data.deviceModel,
      leadAccessories: data.leadAccessories,
      mriCompatible: data.mriCompatible,
      mriCondition: data.mriCondition,
    });
    if (result.success) return null;

    const errors: ValidationErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ValidationErrors;
      errors[key] = issue.message;
    }
    return errors;
  };

  const handleSave = async () => {
    if (!editingItem) return;

    const errors = validate(editingItem);
    if (errors) {
      setValidationErrors(errors);
      return;
    }

    try {
      if (isEditMode) {
        await backendApi.put(
          `/api/device-master/${editingItem.id}`,
          editingItem,
          {
            withCredentials: true,
          }
        );
      } else {
        await backendApi.post("/api/device-master", editingItem, {
          withCredentials: true,
        });
      }
      fetchDevices();
      setModalOpen(false);
      setEditingItem(null);
      setValidationErrors({});
    } catch (err) {
      console.error("Failed to save device", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await backendApi.delete(`/api/device-master/${id}`, {
        withCredentials: true,
      });
      fetchDevices();
    } catch (err) {
      console.error("Failed to delete device", err);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const res = await backendApi.delete("/api/device-master/bulk", {
        data: { ids: selectedRows },
        withCredentials: true,
      });

      setSnackbarMessage(res.data.message || "Devices deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      fetchDevices();
      setSelectedRows([]);
    } catch (err: any) {
      console.error("Failed to bulk delete", err);
      setSnackbarMessage("Failed to delete devices.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await backendApi.post("/api/device-master/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      fetchDevices();
      setImportModalOpen(false);
      setSnackbarMessage("File uploaded successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to upload file", err);
      setSnackbarMessage("Failed to upload file");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const columns: GridColDef[] = [
    { field: "section", headerName: "Section", flex: 1 },
    { field: "deviceType", headerName: "Device Type", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "deviceModel", headerName: "Device Model", flex: 1 },
    { field: "leadAccessories", headerName: "Lead/Accessories", flex: 1.5 },
    {
      field: "mriCompatible",
      headerName: "MRI Compatible",
      flex: 1,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    { field: "mriCondition", headerName: "MRI Condition", flex: 1.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => openModal(params.row)} title="Edit">
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            color="error"
            title="Delete"
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5" color="primary">
          Manage Device Data
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<UploadFile />}
            onClick={handleDownloadSampleCSV}
          >
            Download Sample CSV
          </Button>

          <Button
            variant="outlined"
            startIcon={<UploadFile />}
            onClick={() => setImportModalOpen(true)}
          >
            Import Excel
          </Button>
          {selectedRows.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openModal()}
          >
            Add Data
          </Button>

          <IconButton
            onClick={fetchDevices}
            color="primary"
            aria-label="reload data"
            size="large"
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "50%",
            }}
            title="Reload Data"
            disabled={loading}
          >
            <Refresh
              sx={{
                animation: loading ? "spin 1s linear infinite" : "none",
              }}
            />
          </IconButton>
        </Stack>
      </Stack>

      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        checkboxSelection
        onRowSelectionModelChange={(selectionModel) => {
          console.log("Selected rows:", selectionModel);
          // @ts-ignore
          setSelectedRows(Array.from(selectionModel.ids || []));
        }}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
      />

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditMode ? "Edit Device" : "Add Device"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Section"
              fullWidth
              value={editingItem?.section || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, section: e.target.value }
                )
              }
              error={!!validationErrors.section}
              helperText={validationErrors.section}
            />
            <TextField
              label="Device Type"
              fullWidth
              value={editingItem?.deviceType || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, deviceType: e.target.value }
                )
              }
              error={!!validationErrors.deviceType}
              helperText={validationErrors.deviceType}
            />
            <TextField
              label="Brand"
              fullWidth
              value={editingItem?.brand || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, brand: e.target.value }
                )
              }
              error={!!validationErrors.brand}
              helperText={validationErrors.brand}
            />
            <TextField
              label="Device Model"
              fullWidth
              value={editingItem?.deviceModel || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, deviceModel: e.target.value }
                )
              }
              error={!!validationErrors.deviceModel}
              helperText={validationErrors.deviceModel}
            />
            <TextField
              label="Lead/Accessories"
              fullWidth
              value={editingItem?.leadAccessories || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, leadAccessories: e.target.value }
                )
              }
              error={!!validationErrors.leadAccessories}
              helperText={validationErrors.leadAccessories}
            />
            <Stack direction="row" alignItems="center">
              <Checkbox
                checked={editingItem?.mriCompatible || false}
                onChange={(e) =>
                  setEditingItem(
                    (prev) =>
                      prev && { ...prev, mriCompatible: e.target.checked }
                  )
                }
              />
              <Typography>MRI Compatible</Typography>
            </Stack>
            <TextField
              label="MRI Condition"
              fullWidth
              value={editingItem?.mriCondition || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, mriCondition: e.target.value }
                )
              }
              error={!!validationErrors.mriCondition}
              helperText={validationErrors.mriCondition}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Import Excel File
          <IconButton
            onClick={() => setImportModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Please upload an Excel file with the correct format to import device
            data.
          </DialogContentText>
          <Button variant="contained" component="label" fullWidth>
            Upload File
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageDataPage;
