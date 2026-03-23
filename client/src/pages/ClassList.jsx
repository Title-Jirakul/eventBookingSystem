import React, { Component } from "react";
import api from "../api";
import { AdminNavBar, BulkDeleteConfirmDialog } from "../components";
import styled from "styled-components";
import { downloadCsv } from "../utils/downloadCsv";

import { DataGrid } from "@mui/x-data-grid";

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`;

const ActionsBar = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 16px;
`;

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`;

class DeleteClass extends Component {
    deleteUser = async (event) => {
        event.preventDefault();

        if (
            window.confirm(`Do you want to delete this class permanently?`)
        ) {
            try {
                await api.deleteRoom(this.props.id);
                await api.deleteReservationsByRoomID(this.props.id);
            } finally {
                window.location.reload();
            }
        }
    };

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>;
    }
}

class ClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            isLoading: false,
            isBulkDeleteOpen: false,
            isBulkDeleting: false,
        };
    }

    async componentDidMount() {
        await this.loadClasses();
    }

    loadClasses = async () => {
        this.setState({ isLoading: true });

        try {
            const response = await api.getRooms();
            const rows = response.data.data.map((item, index) => ({
                id: item._id || index,
                ...item,
            }));

            this.setState({
                classes: rows,
                isLoading: false,
            });
        } catch (err) {
            this.setState({
                classes: [],
                isLoading: false,
            });
        }
    };

    openBulkDelete = () => {
        this.setState({ isBulkDeleteOpen: true });
    };

    closeBulkDelete = () => {
        if (this.state.isBulkDeleting) {
            return;
        }

        this.setState({ isBulkDeleteOpen: false });
    };

    handleBulkDelete = async () => {
        this.setState({ isBulkDeleting: true });

        try {
            await api.deleteAllRooms();
            this.setState({
                classes: [],
                isBulkDeleteOpen: false,
            });
        } catch (error) {
            window.alert("Failed to delete all classes.");
        } finally {
            this.setState({ isBulkDeleting: false });
        }
    };

    handleDownloadCsv = () => {
        downloadCsv("all-classes.csv", this.state.classes, [
            { header: "Room No", key: "roomNo" },
            { header: "Class Name", key: "className" },
            { header: "Instructor", key: "instructor" },
            { header: "Date", key: "date" },
            { header: "Time", key: "time" },
            { header: "Max Capacity", key: "maxCapacity" },
            { header: "Capacity", key: "capacity" },
            { header: "Max Virtual Capacity", key: "maxVirtualCapacity" },
            { header: "Virtual Capacity", key: "virtualCapacity" },
        ]);
    };

    render() {
        const { classes, isLoading, isBulkDeleteOpen, isBulkDeleting } = this.state;

        const columns = [
            { field: "roomNo", headerName: "Room No", flex: 1 },
            { field: "className", headerName: "Class Name", flex: 1 },
            { field: "instructor", headerName: "Instructor", flex: 1 },
            { field: "date", headerName: "Date", flex: 1 },
            { field: "time", headerName: "Time", flex: 1 },
            { field: "maxCapacity", headerName: "Max Capacity", flex: 1 },
            { field: "capacity", headerName: "Capacity", flex: 1 },
            { field: "maxVirtualCapacity", headerName: "Max Virtual Capacity", flex: 1 },
            { field: "virtualCapacity", headerName: "Virtual Capacity", flex: 1 },
            {
                field: "actions",
                headerName: "",
                sortable: false,
                filterable: false,
                width: 120,
                renderCell: (params) => (
                    <DeleteClass id={params.row._id || params.row.id} />
                ),
            },
        ];

        return (
            <Wrapper>
                <AdminNavBar />
                <ActionsBar>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={this.handleDownloadCsv}
                        disabled={classes.length === 0}
                    >
                        Download CSV
                    </button>
                    <button type="button" className="btn btn-danger" onClick={this.openBulkDelete}>
                        Delete
                    </button>
                </ActionsBar>

                <div style={{ width: "100%" }}>
                    <DataGrid
                        rows={classes}
                        columns={columns}
                        loading={isLoading}
                        autoHeight
                        disableColumnMenu
                        disableSelectionOnClick
                        pageSize={classes.length || 10}
                        rowsPerPageOptions={[classes.length || 10]}
                        hideFooterPagination
                    />
                </div>
                <BulkDeleteConfirmDialog
                    open={isBulkDeleteOpen}
                    title="Delete all classes?"
                    description="This will permanently delete all classes and the reservations linked to them. Type DELETE to confirm."
                    onClose={this.closeBulkDelete}
                    onConfirm={this.handleBulkDelete}
                    isSubmitting={isBulkDeleting}
                />
            </Wrapper>
        );
    }
}

export default ClassList;
