import React, { Component } from "react";
import api from "../api";
import { AdminNavBar } from "../components";
import styled from "styled-components";

import { DataGrid } from "@mui/x-data-grid";

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
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
        };
    }

    async componentDidMount() {
        this.setState({ isLoading: true });

        try {
            const response = await api.getRooms();
            const rows = response.data.data.map((item, index) => ({
                id: item._id || index, // DataGrid requires "id"
                ...item,
            }));

            this.setState({
                classes: rows,
                isLoading: false,
            });
        } catch (err) {
            console.error(err);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { classes, isLoading } = this.state;

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
            </Wrapper>
        );
    }
}

export default ClassList;
