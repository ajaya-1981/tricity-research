import React, { useState } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, UploadFile, Close } from "@mui/icons-material";
import type { GridColDef } from "@mui/x-data-grid";

interface DeviceData {
  id: number;
  section: string;
  deviceType: string;
  brand: string;
  model: string;
  leadAccessories: string;
  mriCompatible: boolean;
  mriCondition: string;
}

const initialData: DeviceData[] = [
  {
    id: 1,
    section: "ICU",
    deviceType: "Pacemaker",
    brand: "Medtronic",
    model: "Model A",
    leadAccessories: "Lead X",
    mriCompatible: true,
    mriCondition: "Conditional",
  },
];

const ManageDataPage: React.FC = () => {
  const [data, setData] = useState<DeviceData[]>(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DeviceData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const openModal = (item: DeviceData | null = null) => {
    setIsEditMode(!!item);
    setEditingItem(
      item || {
        id: 0,
        section: "",
        deviceType: "",
        brand: "",
        model: "",
        leadAccessories: "",
        mriCompatible: false,
        mriCondition: "",
      }
    );
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!editingItem) return;
    if (isEditMode) {
      setData((prev) =>
        prev.map((d) => (d.id === editingItem.id ? editingItem : d))
      );
    } else {
      setData((prev) => [...prev, { ...editingItem, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBulkDelete = () => {
    setData((prev) => prev.filter((item) => !selectedRows.includes(item.id)));
    setSelectedRows([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  };

  const columns: GridColDef[] = [
    { field: "section", headerName: "Section", flex: 1 },
    { field: "deviceType", headerName: "Device Type", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
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
        </Stack>
      </Stack>

      <DataGrid
        rows={data}
        columns={columns}
        autoHeight
        checkboxSelection
        onRowSelectionModelChange={(selectionModel) => {
          setSelectedRows(
            Array.from(selectionModel.ids).map((id) => Number(id))
          );
        }}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
      />

      {/* Add/Edit Modal */}
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
            />
            <TextField
              label="Model"
              fullWidth
              value={editingItem?.model || ""}
              onChange={(e) =>
                setEditingItem(
                  (prev) => prev && { ...prev, model: e.target.value }
                )
              }
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

      {/* Import Modal */}
      <Dialog
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Import Device Data
          <IconButton
            onClick={() => setImportModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Drag and drop a CSV or Excel file below, or click the button to
            upload.
          </DialogContentText>

          <Box
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileUpload({ target: { files: [file] } } as any);
            }}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              border: "2px dashed #aaa",
              borderRadius: 2,
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              backgroundColor: "#fafafa",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Button variant="contained" component="label" sx={{ zIndex: 2 }}>
              Upload CSV or Excel
              <input
                hidden
                accept=".csv, .xlsx, .xls"
                type="file"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageDataPage;
