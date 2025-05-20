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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  organization: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    username: "jdoe",
    email: "john@example.com",
    phone: "1234567890",
    organization: "Tricity",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    username: "jsmith",
    email: "jane@example.com",
    phone: "9876543210",
    organization: "Tricity",
  },
];

const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const openModal = (user: User | null = null) => {
    setIsEditMode(!!user);
    setEditingUser(
      user
        ? { ...user }
        : {
            id: 0,
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            organization: "",
          }
    );
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSave = () => {
    if (!editingUser) return;

    if (isEditMode) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
      );
    } else {
      const newUser = {
        ...editingUser,
        id: Date.now(),
        username: editingUser.email.split("@")[0],
      };
      setUsers((prev) => [...prev, newUser]);
    }
    handleModalClose();
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    setSelectionModel((prev) => {
      const newIds = new Set(prev.ids);
      newIds.delete(id);
      return { ...prev, ids: newIds };
    });
  };

  const handleBulkDelete = () => {
    setUsers(users.filter((u) => !selectionModel.ids.has(u.id)));
    setSelectionModel({ type: "include", ids: new Set() });
  };

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", flex: 1, minWidth: 120 },
    { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 120 },
    { field: "username", headerName: "Username", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 200 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 140 },
    {
      field: "organization",
      headerName: "Organization",
      flex: 1,
      minWidth: 160,
    },
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
            onClick={() => alert(`Assign Role to ${params.row.firstName}`)}
            title="Assign Role"
          >
            <Security />
          </IconButton>
          <IconButton onClick={() => openModal(params.row)} title="Edit User">
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            title="Delete User"
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
      flex: 1,
      minWidth: 160,
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
          Manage Users
        </Typography>
        <Stack direction="row" spacing={2}>
          {selectionModel.ids.size > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleBulkDelete}
              aria-label="Delete selected users"
            >
              Delete Selected ({selectionModel.ids.size})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openModal()}
            aria-label="Add new user"
          >
            Add User
          </Button>
        </Stack>
      </Stack>

      <div style={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newModel) => {
            // newModel: { type: string, ids: Set<GridRowId> }
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
          aria-label="Manage users data grid"
        />
      </div>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="user-form-dialog"
      >
        <DialogTitle id="user-form-dialog">
          {isEditMode ? "Edit User" : "Add User"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="First Name"
              fullWidth
              value={editingUser?.firstName || ""}
              onChange={(e) =>
                setEditingUser(
                  (prev) => prev && { ...prev, firstName: e.target.value }
                )
              }
              autoFocus
            />
            <TextField
              label="Last Name"
              fullWidth
              value={editingUser?.lastName || ""}
              onChange={(e) =>
                setEditingUser(
                  (prev) => prev && { ...prev, lastName: e.target.value }
                )
              }
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={editingUser?.email || ""}
              onChange={(e) =>
                setEditingUser(
                  (prev) => prev && { ...prev, email: e.target.value }
                )
              }
            />
            <TextField
              label="Phone"
              fullWidth
              value={editingUser?.phone || ""}
              onChange={(e) =>
                setEditingUser(
                  (prev) => prev && { ...prev, phone: e.target.value }
                )
              }
            />
            <TextField
              label="Organization"
              fullWidth
              value={editingUser?.organization || ""}
              onChange={(e) =>
                setEditingUser(
                  (prev) => prev && { ...prev, organization: e.target.value }
                )
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} aria-label="Cancel user form">
            Cancel
          </Button>
          <Button
            onClick={handleModalSave}
            variant="contained"
            aria-label={isEditMode ? "Update user" : "Create user"}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsersPage;
