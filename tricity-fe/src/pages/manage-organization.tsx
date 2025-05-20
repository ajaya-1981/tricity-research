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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, Security } from "@mui/icons-material";
import type {
  GridColDef,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

interface Organization {
  id: number;
  name: string;
  location: string;
  description: string;
  culture: string;
  mission: string;
}

const initialOrganizations: Organization[] = [
  {
    id: 1,
    name: "Tech Corp",
    location: "New York",
    description: "A leading tech company",
    culture: "Innovative, Collaborative",
    mission: "Empower innovation worldwide",
  },
  {
    id: 2,
    name: "Health Plus",
    location: "San Francisco",
    description: "Healthcare solutions provider",
    culture: "Caring, Patient-centric",
    mission: "Improve health globally",
  },
];

const ManageOrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] =
    useState<Organization[]>(initialOrganizations);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const openModal = (org: Organization | null = null) => {
    setIsEditMode(!!org);
    setEditingOrg(
      org
        ? { ...org }
        : {
            id: 0,
            name: "",
            location: "",
            description: "",
            culture: "",
            mission: "",
          }
    );
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingOrg(null);
  };

  const handleModalSave = () => {
    if (!editingOrg) return;

    if (isEditMode) {
      setOrganizations((prev) =>
        prev.map((o) => (o.id === editingOrg.id ? editingOrg : o))
      );
    } else {
      const newOrg = {
        ...editingOrg,
        id: Date.now(),
      };
      setOrganizations((prev) => [...prev, newOrg]);
    }
    handleModalClose();
  };

  const handleDelete = (id: number) => {
    setOrganizations(organizations.filter((o) => o.id !== id));
    setSelectionModel((prev) => {
      const newIds = new Set(prev.ids);
      newIds.delete(id);
      return { ...prev, ids: newIds };
    });
  };

  const handleBulkDelete = () => {
    setOrganizations(
      organizations.filter((o) => !selectionModel.ids.has(o.id))
    );
    setSelectionModel({ type: "include", ids: new Set() });
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "location", headerName: "Location", flex: 1, minWidth: 150 },
    { field: "description", headerName: "Description", flex: 2, minWidth: 250 },
    { field: "culture", headerName: "Culture", flex: 1, minWidth: 200 },
    { field: "mission", headerName: "Mission", flex: 2, minWidth: 250 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => alert(`Assign Role to ${params.row.name}`)}
            title="Assign Role"
          >
            <Security />
          </IconButton>
          <IconButton
            onClick={() => openModal(params.row)}
            title="Edit Organization"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            title="Delete Organization"
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
      flex: 1,
      minWidth: 180,
    },
  ];

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" color="primary">
          Manage Organizations
        </Typography>
        <Stack direction="row" spacing={2}>
          {selectionModel.ids.size > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleBulkDelete}
              aria-label="Delete selected organizations"
            >
              Delete Selected ({selectionModel.ids.size})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openModal()}
            aria-label="Add new organization"
          >
            Add Organization
          </Button>
        </Stack>
      </Stack>

      <div style={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={organizations}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newModel) => {
            setSelectionModel({
              type: newModel.type,
              ids: new Set(newModel.ids),
            });
          }}
          getRowId={(row) => row.id}
          pagination
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          aria-label="Manage organizations data grid"
        />
      </div>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="organization-form-dialog"
      >
        <DialogTitle id="organization-form-dialog">
          {isEditMode ? "Edit Organization" : "Add Organization"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={editingOrg?.name || ""}
              onChange={(e) =>
                setEditingOrg(
                  (prev) => prev && { ...prev, name: e.target.value }
                )
              }
              autoFocus
            />
            <TextField
              label="Location"
              fullWidth
              value={editingOrg?.location || ""}
              onChange={(e) =>
                setEditingOrg(
                  (prev) => prev && { ...prev, location: e.target.value }
                )
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={2}
              value={editingOrg?.description || ""}
              onChange={(e) =>
                setEditingOrg(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
            <TextField
              label="Culture"
              fullWidth
              multiline
              minRows={2}
              value={editingOrg?.culture || ""}
              onChange={(e) =>
                setEditingOrg(
                  (prev) => prev && { ...prev, culture: e.target.value }
                )
              }
            />
            <TextField
              label="Mission"
              fullWidth
              multiline
              minRows={2}
              value={editingOrg?.mission || ""}
              onChange={(e) =>
                setEditingOrg(
                  (prev) => prev && { ...prev, mission: e.target.value }
                )
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            aria-label="Cancel organization form"
          >
            Cancel
          </Button>
          <Button
            onClick={handleModalSave}
            variant="contained"
            aria-label={
              isEditMode ? "Update organization" : "Create organization"
            }
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOrganizationsPage;
