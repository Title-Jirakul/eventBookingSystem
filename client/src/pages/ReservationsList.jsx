import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import styled from "styled-components";
import api from "../api";
import { AdminNavBar } from "../components";

const Wrapper = styled.div`
  padding: 0 40px 40px 40px;
`;

const DeleteButton = styled.div`
  color: #ff0000;
  cursor: pointer;
`;

const DeleteReservation = ({ id, reservationNo, roomID }) => {
  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Do you want to delete reservation ${reservationNo} permanently?`)) {
      return;
    }

    try {
      await api.deleteReservation(id);

      const pass = await api.getPassByReservationId(reservationNo);
      const passType = pass?.data?.data?.passType;
      const passId = pass?.data?.data?._id;

      const updateRoom = () => api.updateRoomByLess(roomID);
      const updateRoomVirtual = () => api.updateVirtualRoomByLess(roomID);

      switch (passType) {
        case "class":
          await api.updateSinglePassUsed(passId);
          await updateRoom();
          break;

        case "vclass":
          await api.updateSinglePassUsed(passId);
          await updateRoomVirtual();
          break;

        case "one":
        case "three":
        case "two":
          try {
            await api.getReservationByReservationNo(reservationNo);
            await updateRoom();
          } catch {
            await api.deleteDayPass(passId);
          }
          break;

        case "vone":
          try {
            await api.getReservationByReservationNo(reservationNo);
            await updateRoomVirtual();
          } catch {
            await api.deleteDayPass(passId);
          }
          break;

        default:
          break;
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      window.location.reload();
    }
  }, [id, reservationNo, roomID]);

  return <DeleteButton onClick={handleDelete}>Delete</DeleteButton>;
};

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReservations = async () => {
      setIsLoading(true);
      const res = await api.getReservations();
      setReservations(res.data.data);
      setIsLoading(false);
    };
    loadReservations();
  }, []);

  const columns = [
    { field: "reservationNo", headerName: "Ticket No", flex: 1 },
    { field: "name", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "phoneNo", headerName: "Phone Number", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    { field: "roomNo", headerName: "Room No", flex: 1 },
    { field: "instructor", headerName: "Instructor", flex: 1 },
    {
      field: "delete",
      headerName: "",
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <DeleteReservation
          id={params.row._id}
          reservationNo={params.row.reservationNo}
          roomID={params.row.roomID}
        />
      ),
    },
  ];

  return (
    <Wrapper>
      <AdminNavBar />

      <Box sx={{ height: "80vh", width: "100%", mt: 3 }}>
        <DataGrid
          rows={reservations}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          disableRowSelectionOnClick
          sx={{
            background: "white",
            borderRadius: 2,
          }}
        />
      </Box>
    </Wrapper>
  );
};

export default ReservationsList;
